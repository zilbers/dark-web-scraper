const express = require('express');
require('dotenv').config();

const app = express();
module.exports = app;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/', require('./api'));

app.get('/ping', (req, res) => {
  try {
    res.status(200).send('pong');
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

app.listen(
  process.env.PORT,
  console.log(
    `Dark-Web-Scraper is running at http://localhost:${process.env.PORT}`
  )
);
