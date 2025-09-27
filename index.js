import { createClient } from 'redis';
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import db from './db.js'; 
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = process.env.PORT || 9990;
app.use(express.json());

// Redis client setup
const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: {},
  }
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

async function ensureRedisConnected() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Connected to Redis');
  }
}

// Helper to send email alerts
async function sendAlertEmail(alert, currentPrice) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: alert.userEmail,
    subject: `Crypto Price Alert: ${alert.cryptoId}`,
    text: `The price of ${alert.cryptoId} (${alert.fiatCurrency.toUpperCase()}) has ${alert.alertType} your target price of ${alert.targetPrice}.\nCurrent Price: ${currentPrice}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to ${alert.userEmail} for ${alert.cryptoId}`);
  } catch (error) {
    console.error('Error sending alert email:', error);
  }
}

// Fetch crypto prices from CoinGecko grouped by fiat currency
async function fetchAndCachePrices() {
  try {
    await ensureRedisConnected();

    // Fetch all unique (cryptoId, fiatCurrency) sets from alerts
    const [alerts] = await db.query("SELECT DISTINCT cryptoId, fiatCurrency FROM alerts");

    // Group alerts by fiatCurrency to batch fetch prices
    const alertsGrouped = {};
    alerts.forEach(({ cryptoId, fiatCurrency }) => {
      if (!alertsGrouped[fiatCurrency]) alertsGrouped[fiatCurrency] = [];
      alertsGrouped[fiatCurrency].push(cryptoId);
    });

    // For each fiat currency, fetch prices for relevant cryptos and cache in Redis hash
    for (const [fiatCurrency, cryptoIds] of Object.entries(alertsGrouped)) {
      const idsParam = [...new Set(cryptoIds)].join(',');

      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: fiatCurrency,
          ids: idsParam,
        },
      });

      // Create a mapping: coin id -> current_price
      const priceMap = {};
      response.data.forEach(coin => {
        priceMap[coin.id] = coin.current_price;
      });

      // Cache the mapped prices in Redis under a key per fiat currency with 60 seconds expiry
      await redisClient.set(`crypto_prices_${fiatCurrency}`, JSON.stringify(priceMap), { EX: 60 });

      // Check alerts for this fiat currency now
      await checkAlertsForFiat(fiatCurrency, priceMap);
    }

  } catch (error) {
    console.error('Error fetching or caching crypto prices:', error);
  }
}

// Check alerts by fiat currency group
async function checkAlertsForFiat(fiatCurrency, priceMap) {
  try {
    const [alerts] = await db.query("SELECT * FROM alerts WHERE fiatCurrency = ?", [fiatCurrency]);

    for (const alert of alerts) {
      const currentPrice = priceMap[alert.cryptoId];
      if (currentPrice === undefined) {
        console.log(`Price data missing for ${alert.cryptoId} in ${fiatCurrency}, skipping alert id ${alert.id}`);
        continue;
      }

      if ((alert.alertType === 'above' && currentPrice > alert.targetPrice) ||
          (alert.alertType === 'below' && currentPrice < alert.targetPrice)) {

        // Send alert email asynchronously
        await sendAlertEmail(alert, currentPrice);

        // Remove alert from DB after alerting
        await db.query("DELETE FROM alerts WHERE id = ?", [alert.id]);
        console.log(`Alert id ${alert.id} cleared after sending.`);
      }
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
}

// API to list all cryptocurrencies with current market data
app.get('/', async (req, res) => {
  const fiatCurrency = req.query.fiatCurrency || 'usd';
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 250; // Max supported by CoinGecko

  try {
    // Fetch market data for all coins, paginated
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: fiatCurrency,
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching all crypto data:', error);
    res.status(500).json({ message: 'Failed to get cryptocurrency data.' });
  }
});


// Endpoint to create an alert
app.post('/set-alert', async (req, res) => {
  const { userId, cryptoId, targetPrice, alertType, userEmail, fiatCurrency } = req.body;

  if (!cryptoId || !targetPrice || !alertType || !userEmail || !fiatCurrency) {
    return res.status(400).json({ message: 'Missing required alert fields.' });
  }
  if (!['above', 'below'].includes(alertType)) {
    return res.status(400).json({ message: "alertType must be 'above' or 'below'." });
  }

  try {
    await db.query(
      "INSERT INTO alerts (userId, cryptoId, targetPrice, alertType, userEmail, fiatCurrency) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, cryptoId, targetPrice, alertType, userEmail, fiatCurrency]
    );

    res.status(201).json({ message: 'Alert created successfully!' });

    // Immediately check if alert conditions met and send alert
    await fetchAndCachePrices();

  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to get current prices for a fiat currency (default usd)
app.get('/crypto-prices', async (req, res) => {
  const fiatCurrency = req.query.fiatCurrency || 'usd';
  try {
    await ensureRedisConnected();
    const data = await redisClient.get(`crypto_prices_${fiatCurrency}`);
    if (data) {
      res.json(JSON.parse(data));
    } else {
      // If no cache, fetch prices for top coins (or fallback)
      await fetchAndCachePrices();
      const freshData = await redisClient.get(`crypto_prices_${fiatCurrency}`);
      if (freshData) {
        res.json(JSON.parse(freshData));
      } else {
        res.status(500).json({ message: 'Failed to get crypto prices.' });
      }
    }
  } catch (error) {
    console.error('Error getting prices:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start price polling every 60 seconds  ethereum 1500 eur   dogecoin 0.15 usd
setInterval(fetchAndCachePrices, 60000);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Initial price fetch on startup
fetchAndCachePrices();
