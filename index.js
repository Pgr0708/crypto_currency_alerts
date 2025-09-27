// const express = require("express");
// const redis = require("redis");
// const mysql = require("mysql2");
// const dotenv = require("dotenv");
// const db = require("./db");
// const axios = require("axios");

// // Load environment variables
// dotenv.config();

// // Setup Express server
// const app = express();
// const port = process.env.PORT || 9990;

// // Setup Redis Client
// const redis = redis.createClient({ host: "localhost", port: 6379 });
// redis.on("error", (err) => console.log("Redis error:", err));

// // Cryptocurrency Price Monitoring API (CoinGecko)
// const COINGECKO_API = "https://api.coingecko.com/api/v3/global";

// // Fetch and Cache Cryptocurrency Prices from CoinGecko
// async function fetchCryptoPrices() {
//   try {
//     const response = await axios.get(COINGECKO_API, { params: { x_cg_demo_api_key: process.env.COINGECKO_API_KEY } });
//     const prices = response.data.data;

//     // Cache prices in Redis with an expiration of 1 minute
//     await redis.set('crypto_prices', JSON.stringify(prices), {
//       EX: 60 // Expiry time in seconds
//     });
//     console.log("Prices updated and cached");

//     // Check if alerts should be triggered
//     checkAlerts(prices);
//   } catch (error) {
//     console.error("Error fetching cryptocurrency data:", error);
//   }
// }

// // Check if any alert criteria are met
// async function checkAlerts(prices) {
//   db.query("SELECT * FROM alerts", (err, results) => {
//     if (err) {
//       console.error("Error fetching alerts from MySQL:", err);
//       return;
//     }

//     results.forEach((alert) => {
//       const price = prices[alert.cryptoId]?.usd;
//       if (!price) return;

//       if (alert.alertType === "above" && price > alert.targetPrice) {
//         sendAlert(alert);
//       } else if (alert.alertType === "below" && price < alert.targetPrice) {
//         sendAlert(alert);
//       }
//     });
//   });
// }

// // Send Alert to User (In a real app, use email/sms/notification systems)
// function sendAlert(alert) {
//   console.log(`Alert for User ${alert.userId}: ${alert.cryptoId} price has ${alert.alertType} ${alert.targetPrice}`);
//   // Send actual alert here (email/sms)
// }

// // Setup Interval to Fetch Prices every minute
// setInterval(fetchCryptoPrices, 60000); // Every minute

// // Fetch data on server start
// fetchCryptoPrices();

// // Express Routes
// app.get("/crypto-prices", async (req, res) => {
//   redis.get("crypto_prices", (err, data) => {
//     if (err || !data) {
//       res.status(500).send("Error fetching data from cache");
//       return;
//     }
//     res.json(JSON.parse(data));
//   });
// });

// // Create an alert
// app.post("/set-alert", express.json(), (req, res) => {
//   const { userId, cryptoId, targetPrice, alertType } = req.body;

//   // Validate the alert type
//   if (!['above', 'below'].includes(alertType)) {
//     return res.status(400).json({ message: "Invalid alert type. Use 'above' or 'below'." });
//   }

//   // Insert alert into MySQL
//   const query = "INSERT INTO alerts (userId, cryptoId, targetPrice, alertType) VALUES (?, ?, ?, ?)";
//   db.query(query, [userId, cryptoId, targetPrice, alertType], (err, result) => {
//     if (err) {
//       console.error("Error creating alert:", err);
//       return res.status(500).json({ message: "Error creating alert." });
//     }
//     res.status(201).json({ message: "Alert created successfully!" });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// const express = require("express");
// const redis = require("@redis/client");
// const mysql = require("mysql2");
// const dotenv = require("dotenv");
// const db = require("./db");
// const axios = require("axios");

// // Load environment variables
// dotenv.config();

// // Setup Express server
// const app = express();
// const port = process.env.PORT || 9990;

// // Setup Redis Client
// const redis = redis.createClient({ url: `redis://localhost:${port}`});

// redis.connect()
//   .then(() => console.log("Connected to Redis"))
//   .catch((err) => console.log("Error connecting to Redis:", err));

// // Cryptocurrency Price Monitoring API (CoinGecko)
// const COINGECKO_API = "https://api.coingecko.com/api/v3/global";

// // Fetch and Cache Cryptocurrency Prices from CoinGecko
// async function fetchCryptoPrices() {
//   try {
//     const response = await axios.get(COINGECKO_API, { params: { x_cg_demo_api_key: process.env.COINGECKO_API_KEY } });
//     const prices = response.data.data;

//     // Ensure the client is connected before setting the cache
//     if (redis.isOpen) {
//       await redis.set("crypto_prices", JSON.stringify(prices), {
//         EX: 60,  // Expiry time (in seconds)
//       });
//       console.log("Prices updated and cached");

//       // Check if alerts should be triggered
//       checkAlerts(prices);
//     } else {
//       console.log("Redis client is not connected");
//     }
//   } catch (error) {
//     console.error("Error fetching cryptocurrency data:", error);
//   }
// }

// // Check if any alert criteria are met
// async function checkAlerts(prices) {
//   db.query("SELECT * FROM alerts", (err, results) => {
//     if (err) {
//       console.error("Error fetching alerts from MySQL:", err);
//       return;
//     }

//     results.forEach((alert) => {
//       const price = prices[alert.cryptoId]?.usd;
//       if (!price) return;

//       if (alert.alertType === "above" && price > alert.targetPrice) {
//         sendAlert(alert);
//       } else if (alert.alertType === "below" && price < alert.targetPrice) {
//         sendAlert(alert);
//       }
//     });
//   });
// }

// // Send Alert to User (In a real app, use email/sms/notification systems)
// function sendAlert(alert) {
//   console.log(`Alert for User ${alert.userId}: ${alert.cryptoId} price has ${alert.alertType} ${alert.targetPrice}`);
//   // Send actual alert here (email/sms)
// }

// // Setup Interval to Fetch Prices every minute
// setInterval(fetchCryptoPrices, 60000); // Every minute

// // Fetch data on server start
// fetchCryptoPrices();

// // Express Routes
// app.get("/crypto-prices", async (req, res) => {
//   redis.get("crypto_prices", (err, data) => {
//     if (err || !data) {
//       res.status(500).send("Error fetching data from cache");
//       return;
//     }
//     res.json(JSON.parse(data));
//   });
// });

// // Create an alert
// app.post("/set-alert", express.json(), (req, res) => {
//   const { userId, cryptoId, targetPrice, alertType } = req.body;

//   // Validate the alert type
//   if (!['above', 'below'].includes(alertType)) {
//     return res.status(400).json({ message: "Invalid alert type. Use 'above' or 'below'." });
//   }

//   // Insert alert into MySQL
//   const query = "INSERT INTO alerts (userId, cryptoId, targetPrice, alertType) VALUES (?, ?, ?, ?)";
//   db.query(query, [userId, cryptoId, targetPrice, alertType], (err, result) => {
//     if (err) {
//       console.error("Error creating alert:", err);
//       return res.status(500).json({ message: "Error creating alert." });
//     }
//     res.status(201).json({ message: "Alert created successfully!" });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// import express from 'express';
// import { createClient } from 'redis';  // Use the new Redis client package
// import dotenv from 'dotenv';
// import mysql from 'mysql2';
// import axios from 'axios';

// // Load environment variables
// dotenv.config();

// // Setup Express server
// const app = express();
// const port = process.env.PORT || 9990;

// // Redis configuration from environment variables
// const REDIS_USERNAME = 'default';  // Default Redis username
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD;  // Set this in your .env file
// const REDIS_HOST = 'redis-13635.c240.us-east-1-3.ec2.redns.redis-cloud.com';
// const REDIS_PORT = 13635;
// const USE_TLS = true; // Set to true if Redis Cloud requires TLS connection, false otherwise

// // Create Redis client using the new Redis package
// const redis = createClient({
//   username: REDIS_USERNAME,
//   password: REDIS_PASSWORD,
//   socket: {
//     host: REDIS_HOST,
//     port: REDIS_PORT,
//     tls: USE_TLS ? {} : undefined,  
//   },
// });

// redis.on('connect', () => {
//   console.log('Connected to Redis');
// });

// redis.on('error', (err) => {
//   console.log('Error connecting to Redis:', err);
// });

// redis.set('foo', 'bar')
//   .then(() => redis.get('foo'))
//   .then(value => {
//     console.log('Value from Redis:', value);  
//   })
//   .catch(err => console.error('Error:', err));

// const COINGECKO_API = "https://api.coingecko.com/api/v3/global";

// async function fetchCryptoPrices() {
//   try {
//     const response = await axios.get(COINGECKO_API, {
//       params: { x_cg_demo_api_key: process.env.COINGECKO_API_KEY }
//     });
//     const prices = response.data.data;

//     // Ensure the client is connected before setting the cache
//     if (redis.isReady) {
//       await redis.set("crypto_prices", JSON.stringify(prices), 'EX', 60);  // Cache with expiry of 60 seconds
//       console.log("Prices updated and cached");

//       // Check if alerts should be triggered
//       checkAlerts(prices);
//     } else {
//       console.log("Redis client is not connected");
//     }
//   } catch (error) {
//     console.error("Error fetching cryptocurrency data:", error);
//   }
// }

// // Check if any alert criteria are met
// async function checkAlerts(prices) {
//   db.query("SELECT * FROM alerts", (err, results) => {
//     if (err) {
//       console.error("Error fetching alerts from MySQL:", err);
//       return;
//     }

//     results.forEach((alert) => {
//       const price = prices[alert.cryptoId]?.usd;
//       if (!price) return;

//       if (alert.alertType === "above" && price > alert.targetPrice) {
//         sendAlert(alert);
//       } else if (alert.alertType === "below" && price < alert.targetPrice) {
//         sendAlert(alert);
//       }
//     });
//   });
// }

// // Send Alert to User (In a real app, use email/sms/notification systems)
// function sendAlert(alert) {
//   console.log(`Alert for User ${alert.userId}: ${alert.cryptoId} price has ${alert.alertType} ${alert.targetPrice}`);
//   // Send actual alert here (email/sms)
// }

// // Setup Interval to Fetch Prices every minute
// setInterval(fetchCryptoPrices, 60000); // Every minute

// // Fetch data on server start
// fetchCryptoPrices();

// // MySQL Database Connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// // Express Routes
// app.get("/crypto-prices", async (req, res) => {
//   try {
//     const data = await redis.get("crypto_prices");
//     if (!data) {
//       return res.status(500).send("Error fetching data from cache");
//     }
//     res.json(JSON.parse(data));
//   } catch (err) {
//     res.status(500).send("Error fetching data from cache");
//   }
// });

// // Create an alert
// app.post("/set-alert", express.json(), (req, res) => {
//   const { userId, cryptoId, targetPrice, alertType } = req.body;

//   // Validate the alert type
//   if (!['above', 'below'].includes(alertType)) {
//     return res.status(400).json({ message: "Invalid alert type. Use 'above' or 'below'." });
//   }

//   // Insert alert into MySQL
//   const query = "INSERT INTO alerts (userId, cryptoId, targetPrice, alertType) VALUES (?, ?, ?, ?)";
//   db.query(query, [userId, cryptoId, targetPrice, alertType], (err, result) => {
//     if (err) {
//       console.error("Error creating alert:", err);
//       return res.status(500).json({ message: "Error creating alert." });
//     }
//     res.status(201).json({ message: "Alert created successfully!" });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// import { createClient } from 'redis';
// import dotenv from 'dotenv';
// import express from 'express';
// import axios from 'axios';
// import mysql from 'mysql2';
// import db from './db.js';

// // Load environment variables from .env file
// dotenv.config();

// // Setup Express server
// const app = express();
// const port = process.env.PORT || 9990;

// // Redis connection setup
// const REDIS_USERNAME = 'default';  // Redis default username is 'default'
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD;  // Set this in your .env file
// const REDIS_HOST = 'redis-13635.c240.us-east-1-3.ec2.redns.redis-cloud.com';
// const REDIS_PORT = 13635;
// const USE_TLS = true;  // Set to true if Redis Cloud requires TLS connection, false otherwise

// // MySQL Database Setup
// // Create Redis client
// const client = createClient({
//   username: REDIS_USERNAME,
//   password: REDIS_PASSWORD,
//   socket: {
//     host: REDIS_HOST,
//     port: REDIS_PORT,
//     tls: USE_TLS ? {} : undefined,  // empty object enables TLS if needed
//   },
// });

// // Event listener to catch Redis connection errors
// client.on('error', (err) => {
//   console.log('Redis Client Error', err);
// });

// // Express Routes for handling requests
// app.use(express.json());  // To parse JSON bodies

// // Cryptocurrency Price Monitoring API (CoinGecko)
// const COINGECKO_API = "https://api.coingecko.com/api/v3/global";

// // Fetch and Cache Cryptocurrency Prices from CoinGecko
// async function fetchCryptoPrices() {
//   try {
//     const response = await axios.get(COINGECKO_API, {
//       params: { x_cg_demo_api_key: process.env.COINGECKO_API_KEY }
//     });
//     const prices = response.data.data;

//     // Ensure the client is connected before setting the cache
//     if (client.status === 'ready') {
//       await client.set("crypto_prices", JSON.stringify(prices), "EX", 60);  // Cache with expiry of 60 seconds
//       console.log("Prices updated and cached");

//       // Check if alerts should be triggered
//       checkAlerts(prices);
//     } else {
//       console.log("Redis client is not connected");
//     }
//   } catch (error) {
//     console.error("Error fetching cryptocurrency data:", error);
//   }
// }

// // Check if any alert criteria are met
// async function checkAlerts(prices) {
//   db.query("SELECT * FROM alerts", (err, results) => {
//     if (err) {
//       console.error("Error fetching alerts from MySQL:", err);
//       return;
//     }

//     results.forEach((alert) => {
//       const price = prices[alert.cryptoId]?.usd;
//       if (!price) return;

//       if (alert.alertType === "above" && price > alert.targetPrice) {
//         sendAlert(alert);
//       } else if (alert.alertType === "below" && price < alert.targetPrice) {
//         sendAlert(alert);
//       }
//     });
//   });
// }

// // Send Alert to User (In a real app, use email/sms/notification systems)
// function sendAlert(alert) {
//   console.log(`Alert for User ${alert.userId}: ${alert.cryptoId} price has ${alert.alertType} ${alert.targetPrice}`);
//   // Send actual alert here (email/sms)
// }

// // Create an alert route
// app.post("/set-alert", (req, res) => {
//   const { userId, cryptoId, targetPrice, alertType } = req.body;

//   // Validate the alert type
//   if (!['above', 'below'].includes(alertType)) {
//     return res.status(400).json({ message: "Invalid alert type. Use 'above' or 'below'." });
//   }

//   // Insert alert into MySQL
//   const query = "INSERT INTO alerts (userId, cryptoId, targetPrice, alertType) VALUES (?, ?, ?, ?)";
//   db.query(query, [userId, cryptoId, targetPrice, alertType], (err, result) => {
//     if (err) {
//       console.error("Error creating alert:", err);
//       return res.status(500).json({ message: "Error creating alert." });
//     }
//     res.status(201).json({ message: "Alert created successfully!" });
//   });
// });

// // Route to fetch crypto prices
// app.get("/crypto-prices", async (req, res) => {
//   try {
//     const data = await client.get("crypto_prices");
//     if (!data) {
//       return res.status(500).send("Error fetching data from cache");
//     }
//     res.json(JSON.parse(data));
//   } catch (err) {
//     res.status(500).send("Error fetching data from cache");
//   }
// });

// // Set up an interval to fetch data every minute
// setInterval(fetchCryptoPrices, 60000); // Every minute

// // Fetch data on server start
// fetchCryptoPrices();

// // Initialize Redis Client
// async function main() {
//   try {
//     // Ensure Redis client is connected
//     await client.connect();
//     console.log('Connected to Redis');

//     // Set a test key-value pair in Redis
//     await client.set('foo', 'bar');

//     // Retrieve and log the value of the test key
//     const result = await client.get('foo');
//     console.log('Redis key `foo` has value:', result);

//   } catch (err) {
//     console.error('Error during Redis operation:', err);
//   } finally {
//     // Close the connection after use
//     await client.quit();
//   }
// }

// // Execute the main function
// main().catch(console.error);

// // Start Express Server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { createClient } from 'redis';
// import dotenv from 'dotenv';
// import express from 'express';
// import axios from 'axios';
// import db from './db.js';  // Assuming you're using a default export for the database connection

// // Load environment variables from .env file
// dotenv.config();

// // Setup Express server
// const app = express();
// const port = process.env.PORT || 9990;

// // Redis connection setup
// const REDIS_USERNAME = 'default';  // Redis default username is 'default'
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD;  // Set this in your .env file
// const REDIS_HOST = 'redis-13635.c240.us-east-1-3.ec2.redns.redis-cloud.com';
// const REDIS_PORT = 13635;
// const USE_TLS = true;  // Set to true if Redis Cloud requires TLS connection, false otherwise

// // Create Redis client
// const client = createClient({
//   username: REDIS_USERNAME,
//   password: REDIS_PASSWORD,
//   socket: {
//     host: REDIS_HOST,
//     port: REDIS_PORT,
//     tls: USE_TLS ? {} : undefined,  // empty object enables TLS if needed
//   },
// });

// // Event listener to catch Redis connection errors
// client.on('error', (err) => {
//   console.log('Redis Client Error', err);
// });

// // Ensure Redis client is connected before performing operations (connect only once)
// async function ensureRedisConnected() {
//   if (client.isOpen) {
//     return; // Redis is already connected, no need to reconnect
//   }

//   try {
//     await client.connect();
//     console.log('Connected to Redis');
//   } catch (err) {
//     console.error('Error connecting to Redis:', err);
//   }
// }

// // Express Routes for handling requests
// app.use(express.json());  // To parse JSON bodies

// // Cryptocurrency Price Monitoring API (CoinGecko)
// const COINGECKO_API = "https://api.coingecko.com/api/v3/global";

// // Fetch and Cache Cryptocurrency Prices from CoinGecko
// async function fetchCryptoPrices() {
//   try {
//     const response = await axios.get(COINGECKO_API, {
//       params: { x_cg_demo_api_key: process.env.COINGECKO_API_KEY }
//     });
//     const prices = response.data.data;

//     // Ensure Redis is connected before caching
//     await ensureRedisConnected();  // Ensure Redis is connected

//     // Cache the data for 60 seconds
//     await client.set("crypto_prices", JSON.stringify(prices), "EX", 60);  
//     console.log("Prices updated and cached");

//     // Check if alerts should be triggered
//     checkAlerts(prices);
//   } catch (error) {
//     console.error("Error fetching cryptocurrency data:", error);
//   }
// }

// // Check if any alert criteria are met
// async function checkAlerts(prices) {
//   try {
//     // Get the alerts from MySQL (using promise-based queries)
//     const [results] = await db.query("SELECT * FROM alerts");
    
//     // Check if any alerts are triggered based on the current prices
//     results.forEach((alert) => {
//       const price = prices[alert.cryptoId]?.usd;
//       if (!price) return;

//       if (alert.alertType === "above" && price > alert.targetPrice) {
//         sendAlert(alert);
//       } else if (alert.alertType === "below" && price < alert.targetPrice) {
//         sendAlert(alert);
//       }
//     });
//   } catch (err) {
//     console.error("Error fetching alerts from MySQL:", err);
//   }
// }

// // Send Alert to User (In a real app, use email/sms/notification systems)
// function sendAlert(alert) {
//   console.log(`Alert for User ${alert.userId}: ${alert.cryptoId} price has ${alert.alertType} ${alert.targetPrice}`);
//   // Send actual alert here (email/sms)
// }

// // Create an alert route
// app.post("/set-alert", async (req, res) => {
//   const { userId, cryptoId, targetPrice, alertType } = req.body;

//   // Validate the alert type
//   if (!['above', 'below'].includes(alertType)) {
//     return res.status(400).json({ message: "Invalid alert type. Use 'above' or 'below'." });
//   }

//   try {
//     // Insert alert into MySQL (using promise-based queries)
//     const result = await db.query("INSERT INTO alerts (userId, cryptoId, targetPrice, alertType) VALUES (?, ?, ?, ?)", [userId, cryptoId, targetPrice, alertType]);
//     res.status(201).json({ message: "Alert created successfully!" });
//   } catch (err) {
//     console.error("Error creating alert:", err);
//     res.status(500).json({ message: "Error creating alert." });
//   }
// });

// // Route to fetch crypto prices
// app.get("/crypto-prices", async (req, res) => {
//   try {
//     // Ensure Redis is connected
//     await ensureRedisConnected();

//     // Check if data exists in Redis cache
//     const data = await client.get("crypto_prices");
//     if (!data) {
//       console.log("Cache miss: Fetching from CoinGecko API");
      
//       // Cache miss: Fetch and cache the data from the API
//       await fetchCryptoPrices(); // Fetch and store data in Redis
      
//       // Try to get the cached data again after fetching it
//       const freshData = await client.get("crypto_prices");
//       if (!freshData) {
//         return res.status(500).send("Error fetching data from API and cache.");
//       }
//       return res.json(JSON.parse(freshData));  // Return the freshly fetched and cached data
//     }
//     res.json(JSON.parse(data));  // Return the cached data if available
//   } catch (err) {
//     console.error('Error fetching data from cache', err);
//     res.status(500).send("Error fetching data from cache");
//   }
// });

// // Set up an interval to fetch data every minute
// setInterval(fetchCryptoPrices, 60000); // Every minute

// // Fetch data on server start
// fetchCryptoPrices();

// // Start Express Server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// import { createClient } from 'redis';
// import dotenv from 'dotenv';
// import express from 'express';
// import axios from 'axios';
// import db from './db.js';  // Assuming you're using a default export for the database connection
// import nodemailer from 'nodemailer';

// // Load environment variables from .env file
// dotenv.config();

// // Setup Express server
// const app = express();
// const port = process.env.PORT || 9990;

// // Redis connection setup
// const REDIS_USERNAME = 'default';  // Redis default username is 'default'
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD;  // Set this in your .env file
// const REDIS_HOST = 'redis-13635.c240.us-east-1-3.ec2.redns.redis-cloud.com';
// const REDIS_PORT = 13635;
// const USE_TLS = true;  // Set to true if Redis Cloud requires TLS connection, false otherwise

// // Create Redis client
// const client = createClient({
//   username: REDIS_USERNAME,
//   password: REDIS_PASSWORD,
//   socket: {
//     host: REDIS_HOST,
//     port: REDIS_PORT,
//     tls: USE_TLS ? {} : undefined,  // empty object enables TLS if needed
//   },
// });

// // Event listener to catch Redis connection errors
// client.on('error', (err) => {
//   console.log('Redis Client Error', err);
// });

// // Ensure Redis client is connected before performing operations (connect only once)
// async function ensureRedisConnected() {
//   if (client.isOpen) {
//     return; // Redis is already connected, no need to reconnect
//   }

//   try {
//     await client.connect();
//     console.log('Connected to Redis');
//   } catch (err) {
//     console.error('Error connecting to Redis:', err);
//   }
// }

// // Express Routes for handling requests
// app.use(express.json());  // To parse JSON bodies

// // Cryptocurrency Price Monitoring API (CoinGecko)
// const COINGECKO_API = "https://api.coingecko.com/api/v3/global";

// // Fetch and Cache Cryptocurrency Prices from CoinGecko
// async function fetchCryptoPrices() {
//   try {
//     const response = await axios.get(COINGECKO_API, {
//       params: { x_cg_demo_api_key: process.env.COINGECKO_API_KEY }
//     });
//     const prices = response.data.data;

//     // Ensure Redis is connected before caching
//     await ensureRedisConnected();  // Ensure Redis is connected

//     // Cache the data for 60 seconds
//     await client.set("crypto_prices", JSON.stringify(prices), "EX", 60);  
//     console.log("Prices updated and cached");

//     // Check if alerts should be triggered
//     checkAlerts(prices);
//   } catch (error) {
//     console.error("Error fetching cryptocurrency data:", error);
//   }
// }

// // Check if any alert criteria are met
// async function checkAlerts(prices) {
//   try {
//     // Get the alerts from MySQL (using promise-based queries)
//     const [results] = await db.query("SELECT * FROM alerts");
    
//     // Check if any alerts are triggered based on the current prices
//     results.forEach((alert) => {
//       const price = prices[alert.cryptoId]?.usd;
//       if (!price) return;

//       if (alert.alertType === "above" && price > alert.targetPrice) {
//         sendAlert(alert, price);  // Send an alert if criteria are met
//       } else if (alert.alertType === "below" && price < alert.targetPrice) {
//         sendAlert(alert, price);  // Send an alert if criteria are met
//       }
//     });
//   } catch (err) {
//     console.error("Error fetching alerts from MySQL:", err);
//   }
// }

// // Send Alert to User (using Nodemailer to send email)
// async function sendAlert(alert, currentPrice) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,  // Your Gmail address
//       pass: process.env.EMAIL_PASS,  // Your Gmail App Password
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,  // Send from your email address
//     to: alert.userEmail,  // User's email address (the one who set the alert)
//     subject: 'Crypto Price Alert',
//     text: `The price of ${alert.cryptoId} has crossed your target price of ${alert.targetPrice}.\nCurrent Price: ${currentPrice}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Alert sent to ${alert.userEmail}`);
//   } catch (error) {
//     console.error('Error sending alert:', error);
//   }
// }

// // Create an alert route
// app.post("/set-alert", async (req, res) => {
//   const { userId, cryptoId, targetPrice, alertType, userEmail } = req.body;

//   // Validate the alert type
//   if (!['above', 'below'].includes(alertType)) {
//     return res.status(400).json({ message: "Invalid alert type. Use 'above' or 'below'." });
//   }

//   try {
//     // Insert alert into MySQL (using promise-based queries)
//     const result = await db.query("INSERT INTO alerts (userId, cryptoId, targetPrice, alertType, userEmail) VALUES (?, ?, ?, ?, ?)", [userId, cryptoId, targetPrice, alertType, userEmail]);
//     res.status(201).json({ message: "Alert created successfully!" });
//   } catch (err) {
//     console.error("Error creating alert:", err);
//     res.status(500).json({ message: "Error creating alert." });
//   }
// });

// // Route to fetch crypto prices
// app.get("/crypto-prices", async (req, res) => {
//   try {
//     // Ensure Redis is connected
//     await ensureRedisConnected();

//     // Check if data exists in Redis cache
//     const data = await client.get("crypto_prices");
//     if (!data) {
//       console.log("Cache miss: Fetching from CoinGecko API");
      
//       // Cache miss: Fetch and cache the data from the API
//       await fetchCryptoPrices(); // Fetch and store data in Redis
      
//       // Try to get the cached data again after fetching it
//       const freshData = await client.get("crypto_prices");
//       if (!freshData) {
//         return res.status(500).send("Error fetching data from API and cache.");
//       }
//       return res.json(JSON.parse(freshData));  // Return the freshly fetched and cached data
//     }
//     res.json(JSON.parse(data));  // Return the cached data if available
//   } catch (err) {
//     console.error('Error fetching data from cache', err);
//     res.status(500).send("Error fetching data from cache");
//   }
// });

// // Route to manually trigger a test email alert (to test functionality)
// app.post("/send-test-alert", async (req, res) => {
//   const testAlert = {
//     cryptoId: "bitcoin",  // Use a crypto symbol to identify
//     targetPrice: 50000,    // Set a random target price for the test
//     userEmail: "gmr9265902500@gmail.com",  // Email to receive the alert
//     alertType: "above",  // Example: "above" means alert when the price goes above the target
//   };

//   // Hardcoding a price to trigger the alert directly
//   const currentPrice = 51000;  // Manually set the price to trigger the alert

//   // Check if the alert criteria are met (i.e., price > targetPrice)
//   if (testAlert.alertType === "above" && currentPrice > testAlert.targetPrice) {
//     try {
//       await sendAlert(testAlert, currentPrice);  // Send the test email
//       res.status(200).json({ message: "Test alert sent successfully!" });
//     } catch (err) {
//       res.status(500).json({ message: "Error sending test alert", error: err });
//     }
//   } else {
//     res.status(400).json({ message: "Test alert failed. Conditions not met." });
//   }
// });


// // Set up an interval to fetch data every minute
// setInterval(fetchCryptoPrices, 60000); // Every minute

// // Fetch data on server start
// fetchCryptoPrices();

// // Start Express Server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { createClient } from 'redis';
// import dotenv from 'dotenv';
// import express from 'express';
// import axios from 'axios';
// import db from './db.js';  // Assuming you're using a default export for the database connection
// import nodemailer from 'nodemailer';

// // Load environment variables from .env file
// dotenv.config();

// // Setup Express server
// const app = express();
// const port = process.env.PORT || 9990;

// // Redis connection setup
// const REDIS_USERNAME = 'default';  // Redis default username is 'default'
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD;  // Set this in your .env file
// const REDIS_HOST = 'redis-13635.c240.us-east-1-3.ec2.redns.redis-cloud.com';
// const REDIS_PORT = 13635;
// const USE_TLS = true;  // Set to true if Redis Cloud requires TLS connection, false otherwise

// // Create Redis client
// const client = createClient({
//   username: REDIS_USERNAME,
//   password: REDIS_PASSWORD,
//   socket: {
//     host: REDIS_HOST,
//     port: REDIS_PORT,
//     tls: USE_TLS ? {} : undefined,  // empty object enables TLS if needed
//   },
// });

// // Event listener to catch Redis connection errors
// client.on('error', (err) => {
//   console.log('Redis Client Error', err);
// });

// // Ensure Redis client is connected before performing operations (connect only once)
// async function ensureRedisConnected() {
//   if (client.isOpen) {
//     return; // Redis is already connected, no need to reconnect
//   }

//   try {
//     await client.connect();
//     console.log('Connected to Redis');
//   } catch (err) {
//     console.error('Error connecting to Redis:', err);
//   }
// }

// // Express Routes for handling requests
// app.use(express.json());  // To parse JSON bodies

// // Cryptocurrency Price Monitoring API (CoinGecko)
// const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets";

// const ids = 'bitcoin,ethereum,litecoin'; // example, build dynamically as needed

// const response = await axios.get(COINGECKO_API, {
//   params: {
//     vs_currency: 'usd',
//     ids: ids
//   }
// });

// // Fetch and Cache Cryptocurrency Prices from CoinGecko
// async function fetchCryptoPrices() {
//   try {
//     const response = await axios.get(COINGECKO_API, {
//       params: { x_cg_demo_api_key: process.env.COINGECKO_API_KEY }
//     });
//     const prices = response.data.data;

//     // Log the structure of the prices object to ensure it's correct
//     console.log("CoinGecko Prices Data:", prices);

//     // Ensure Redis is connected before caching
//     await ensureRedisConnected();  // Ensure Redis is connected

//     // Cache the data for 60 seconds
//     await client.set("crypto_prices", JSON.stringify(prices), "EX", 60);  
//     console.log("Prices updated and cached");

//     // Check if alerts should be triggered
//     checkAlerts(prices);
//   } catch (error) {
//     console.error("Error fetching cryptocurrency data:", error);
//   }
// }

// // Fetch the latest crypto prices from Redis or CoinGecko
// async function getLatestCryptoPrices() {
//   try {
//     // Ensure Redis is connected
//     await ensureRedisConnected();

//     // Check if data exists in Redis cache
//     const data = await client.get("crypto_prices");
//     if (!data) {
//       console.log("Cache miss: Fetching from CoinGecko API");

//       // Fetch from CoinGecko API and store it in Redis
//       await fetchCryptoPrices(); // This will fetch and cache the latest data
      
//       // Try to get the cached data again after fetching it
//       const freshData = await client.get("crypto_prices");
//       if (!freshData) {
//         throw new Error("Error fetching data from API and cache.");
//       }
//       return JSON.parse(freshData); // Return the freshly fetched and cached data
//     }

//     return JSON.parse(data); // Return cached data if available
//   } catch (err) {
//     console.error('Error fetching data:', err);
//     throw new Error('Error fetching cryptocurrency prices');
//   }
// }

// // Check if any alert criteria are met
// async function checkAlerts(prices) {
//   try {
//     console.log("Fetched Prices:", prices);  // Debugging line to inspect the prices object

//     // Get the alerts from MySQL (using promise-based queries)
//     const [results] = await db.query("SELECT * FROM alerts");

//     // Check if any alerts are triggered based on the current prices
//     results.forEach(async (alert) => {
//       console.log(`Checking alert for ${alert.cryptoId}`);
      
//       // Log the available data for the specific alert
//       console.log("Price data for cryptoId:", prices[alert.cryptoId]);

//       const price = prices[alert.cryptoId]?.usd;
//       if (!price) {
//         console.log(`No price found for ${alert.cryptoId}. Skipping alert.`);
//         return;
//       }

//       // Check the alert conditions and send an email if triggered
//       if (
//         (alert.alertType === 'above' && price > alert.targetPrice) ||
//         (alert.alertType === 'below' && price < alert.targetPrice)
//       ) {
//         console.log(`Alert condition met for ${alert.cryptoId}. Sending email...`);
//         await sendAlert(alert, price);  // Send an alert if conditions are met

//         // Remove the alert from the database after sending the email
//         await removeAlertFromDatabase(alert.id);
//       }
//     });
//   } catch (err) {
//     console.error("Error fetching alerts from MySQL:", err);
//   }
// }

// // Function to remove the alert from the database after sending email
// async function removeAlertFromDatabase(alertId) {
//   try {
//     const [result] = await db.query("DELETE FROM alerts WHERE id = ?", [alertId]);
//     console.log(`Alert with ID ${alertId} removed from database.`);
//   } catch (err) {
//     console.error("Error removing alert from database:", err);
//   }
// }

// // Send Alert to User (using Nodemailer to send email)
// async function sendAlert(alert, currentPrice) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,  // Your Gmail address
//       pass: process.env.EMAIL_PASS,  // Your Gmail App Password
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,  // Send from your email address
//     to: alert.userEmail,  // User's email address (the one who set the alert)
//     subject: 'Crypto Price Alert',
//     text: `The price of ${alert.cryptoId} has crossed your target price of ${alert.targetPrice}.\nCurrent Price: ${currentPrice}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Alert sent to ${alert.userEmail}`);
//   } catch (error) {
//     console.error('Error sending alert:', error);
//   }
// }

// // Create an alert route
// app.post("/set-alert", async (req, res) => {
//   const { userId, cryptoId, targetPrice, alertType, userEmail } = req.body;

//   // Validate the alert type
//   if (!['above', 'below'].includes(alertType)) {
//     return res.status(400).json({ message: "Invalid alert type. Use 'above' or 'below'." });
//   }

//   try {
//     // Insert alert into MySQL (using promise-based queries)
//     const result = await db.query("INSERT INTO alerts (userId, cryptoId, targetPrice, alertType, userEmail) VALUES (?, ?, ?, ?, ?)", [userId, cryptoId, targetPrice, alertType, userEmail]);
//     res.status(201).json({ message: "Alert created successfully!" });

//     // Fetch the latest prices from Redis or CoinGecko
//     const prices = await getLatestCryptoPrices(); // Fetch latest prices (either from Redis or API)

//     // Check if the new alert conditions are met with the current prices
//     const alertPrice = prices[cryptoId]?.usd;
//     console.log(`Price for ${cryptoId} is ${alertPrice}. Checking if alert condition is met.`);  // Debugging line

//     if (alertPrice) {
//       if (
//         (alertType === 'above' && alertPrice > targetPrice) ||
//         (alertType === 'below' && alertPrice < targetPrice)
//       ) {
//         console.log("Alert condition met. Sending immediate email...");  // Debugging line
//         // If alert condition is met, send an email immediately
//         await sendAlert({ userEmail, cryptoId, targetPrice, alertType }, alertPrice);

//         // Remove the alert from the database after sending the email
//         const [results] = await db.query("SELECT id FROM alerts WHERE cryptoId = ? AND userEmail = ?", [cryptoId, userEmail]);
//         if (results.length > 0) {
//           await removeAlertFromDatabase(results[0].id);
//         }
//       } else {
//         console.log("Alert condition not met, no email sent.");  // Debugging line
//       }
//     }
//   } catch (err) {
//     console.error("Error creating alert:", err);
//     res.status(500).json({ message: "Error creating alert." });
//   }
// });

// // Route to fetch crypto prices
// app.get("/crypto-prices", async (req, res) => {
//   try {
//     // Ensure Redis is connected
//     await ensureRedisConnected();

//     // Check if data exists in Redis cache
//     const data = await client.get("crypto_prices");
//     if (!data) {
//       console.log("Cache miss: Fetching from CoinGecko API");

//       // Cache miss: Fetch and cache the data from the API
//       await fetchCryptoPrices(); // Fetch and store data in Redis

//       // Try to get the cached data again after fetching it
//       const freshData = await client.get("crypto_prices");
//       if (!freshData) {
//         return res.status(500).send("Error fetching data from API and cache.");
//       }
//       return res.json(JSON.parse(freshData));  // Return the freshly fetched and cached data
//     }
//     res.json(JSON.parse(data));  // Return the cached data if available
//   } catch (err) {
//     console.error('Error fetching data from cache', err);
//     res.status(500).send("Error fetching data from cache");
//   }
// });

// // Route to manually trigger a test email alert (to test functionality)
// app.post("/send-test-alert", async (req, res) => {
//   const testAlert = {
//     cryptoId: "bitcoin",  // Use a crypto symbol to identify
//     targetPrice: 50000,    // Set a random target price for the test
//     userEmail: "gmr9265902500@gmail.com",  // Email to receive the alert
//     alertType: "above",  // Example: "above" means alert when the price goes above the target
//   };

//   // Hardcoding a price to trigger the alert directly
//   const currentPrice = 51000;  // Manually set the price to trigger the alert

//   // Check if the alert criteria are met (i.e., price > targetPrice)
//   if (testAlert.alertType === "above" && currentPrice > testAlert.targetPrice) {
//     try {
//       await sendAlert(testAlert, currentPrice);  // Send the test email
//       res.status(200).json({ message: "Test alert sent successfully!" });
//     } catch (err) {
//       res.status(500).json({ message: "Error sending test alert", error: err });
//     }
//   } else {
//     res.status(400).json({ message: "Test alert failed. Conditions not met." });
//   }
// });


// // Start Express server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


// import { createClient } from 'redis';
// import dotenv from 'dotenv';
// import express from 'express';
// import axios from 'axios';
// import db from './db.js'; // Your MySQL connection module
// import nodemailer from 'nodemailer';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 9990;

// // Redis connection setup
// const REDIS_USERNAME = 'default';
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
// const REDIS_HOST = process.env.REDIS_HOST || 'redis-13635.c240.us-east-1-3.ec2.redns.redis-cloud.com';
// const REDIS_PORT = process.env.REDIS_PORT || 13635;
// const USE_TLS = true;
// const client = createClient({
//   username: REDIS_USERNAME,
//   password: REDIS_PASSWORD,
//   socket: {
//     host: REDIS_HOST,
//     port: REDIS_PORT,
//     tls: USE_TLS ? {} : undefined,
//   },
// });

// client.on('error', (err) => {
//   console.log('Redis Client Error', err);
// });

// async function ensureRedisConnected() {
//   if (client.isOpen) return;
//   try {
//     await client.connect();
//     console.log('Connected to Redis');
//   } catch (err) {
//     console.error('Error connecting to Redis:', err);
//   }
// }

// app.use(express.json());

// // Use CoinGecko coins/markets API endpoint
// const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins/markets';

// // Fetch and cache prices for coins specified in alerts or use default list
// async function fetchCryptoPrices() {
//   try {
//     // Get distinct cryptoIds from alerts to build the ids list
//     const [alerts] = await db.query("SELECT DISTINCT cryptoId FROM alerts");
//     const ids = alerts.length > 0 ? alerts.map(a => a.cryptoId).join(',') : 'bitcoin,ethereum';

//     const response = await axios.get(COINGECKO_API, {
//       params: {
//         vs_currency: 'usd',
//         ids: ids,
//       }
//     });

//     const pricesArray = response.data;

//     // Map prices by coin id for quick access
//     const prices = {};
//     pricesArray.forEach(coin => {
//       prices[coin.id] = coin.current_price;
//     });

//     await ensureRedisConnected();
//     await client.set("crypto_prices", JSON.stringify(prices), "EX", 60);
//     console.log("Prices updated and cached");

//     // Check alerts with fresh prices
//     checkAlerts(prices);
//   } catch (error) {
//     console.error("Error fetching cryptocurrency data:", error);
//   }
// }

// // Get latest prices, fallback to API if Redis cache misses
// async function getLatestCryptoPrices() {
//   try {
//     await ensureRedisConnected();
//     const data = await client.get("crypto_prices");
//     if (!data) {
//       console.log("Cache miss: Fetching from CoinGecko API");
//       await fetchCryptoPrices();
//       const freshData = await client.get("crypto_prices");
//       if (!freshData) throw new Error("Error fetching data from API and cache.");
//       return JSON.parse(freshData);
//     }
//     return JSON.parse(data);
//   } catch (err) {
//     console.error('Error fetching data:', err);
//     throw new Error('Error fetching cryptocurrency prices');
//   }
// }

// // Check alerts and send email if conditions met
// async function checkAlerts(prices) {
//   try {
//     const [results] = await db.query("SELECT * FROM alerts");
//     for (const alert of results) {
//       const price = prices[alert.cryptoId];
//       if (price === undefined) {
//         console.log(`No price found for ${alert.cryptoId}. Skipping alert.`);
//         continue;
//       }

//       if ((alert.alertType === 'above' && price > alert.targetPrice) ||
//           (alert.alertType === 'below' && price < alert.targetPrice)) {
//         console.log(`Alert condition met for ${alert.cryptoId}, sending email to ${alert.userEmail}`);
//         await sendAlert(alert, price);
//         await removeAlertFromDatabase(alert.id);
//       }
//     }
//   } catch (err) {
//     console.error("Error fetching alerts from MySQL:", err);
//   }
// }

// async function removeAlertFromDatabase(alertId) {
//   try {
//     await db.query("DELETE FROM alerts WHERE id = ?", [alertId]);
//     console.log(`Alert with ID ${alertId} removed from database.`);
//   } catch (err) {
//     console.error("Error removing alert from database:", err);
//   }
// }

// async function sendAlert(alert, currentPrice) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: alert.userEmail,
//     subject: 'Crypto Price Alert',
//     text: `The price of ${alert.cryptoId} has ${alert.alertType} your target price of ${alert.targetPrice}.\nCurrent Price: ${currentPrice}`
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Alert sent to ${alert.userEmail}`);
//   } catch (error) {
//     console.error('Error sending alert:', error);
//   }
// }

// // Create alert route
// app.post("/set-alert", async (req, res) => {
//   const { userId, cryptoId, targetPrice, alertType, userEmail,fiatCurrency } = req.body;

//   if (!['above', 'below'].includes(alertType)) {
//     return res.status(400).json({ message: "Invalid alert type. Use 'above' or 'below'." });
//   }

//   try {
//     await db.query(
//       "INSERT INTO alerts (userId, cryptoId, targetPrice, alertType, userEmail) VALUES (?, ?, ?, ?, ?)",
//       [userId, cryptoId, targetPrice, alertType, userEmail,fiatCurrency]
//     );
//     res.status(201).json({ message: "Alert created successfully!" });

//     // Immediately check if alert condition is already met
//     const prices = await getLatestCryptoPrices();
//     const alertPrice = prices[cryptoId];
//     if (alertPrice !== undefined) {
//       if ((alertType === 'above' && alertPrice > targetPrice) || (alertType === 'below' && alertPrice < targetPrice)) {
//         await sendAlert({ userEmail, cryptoId, targetPrice, alertType }, alertPrice);
//         // Remove this alert so it doesn't trigger again
//         const [results] = await db.query("SELECT id FROM alerts WHERE cryptoId = ? AND userEmail = ?", [cryptoId, userEmail]);
//         if (results.length > 0) {
//           await removeAlertFromDatabase(results[0].id);
//         }
//       }
//     }
//   } catch (err) {
//     console.error("Error creating alert:", err);
//     res.status(500).json({ message: "Error creating alert." });
//   }
// });

// // Route to get crypto prices
// app.get("/crypto-prices", async (req, res) => {
//   try {
//     const prices = await getLatestCryptoPrices();
//     res.json(prices);
//   } catch (err) {
//     console.error('Error fetching data from cache or API:', err);
//     res.status(500).send("Error fetching crypto prices.");
//   }
// });

// // Periodically refresh prices and alerts every 60 seconds
// setInterval(fetchCryptoPrices, 60 * 1000);

// // Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// // Fetch initial prices on start
// fetchCryptoPrices();



import { createClient } from 'redis';
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import db from './db.js'; // Your MySQL connection (promise wrapper)
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
