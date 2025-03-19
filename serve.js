'use strict';

const path = require('path');
const express = require('express');
require('dotenv').config(); 

const HOST = process.env.HOST || '0.0.0.0'; 
const PORT = process.env.PORT || '7001';
const DIST = path.join(process.env.PWD, (process.env.NODE_ENV === 'test') ? 'test' : 'dist');

const app = express();

const cors = require("cors");
app.use(cors({ origin: '*' }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.static(DIST));

app.get('/*', (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`ENV: ${process.env.NODE_ENV}`);
  console.log(`Server running at http://${HOST}:${PORT}`);
});
