const express = require('express');
require('dotenv').config();

const app = express();
module.exports = app;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/ping', (req, res) => {
  try {
    res.status(200).send('pong');
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

app.listen(
  8080,
  console.log(`Dark-Web-Scraper is running at http://localhost:8080`)
);
