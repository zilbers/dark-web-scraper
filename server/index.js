const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
module.exports = app;
let requestID = 0;

function logger(req, res, next) {
  console.log(
    `Request #${requestID}\nRequest fired: ${req.url}\nMethod: ${req.method}`
  );
  requestID += 1;
  next();
}

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/', express.static('./build/'));
app.use('/api/', require('./api'));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDB!');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

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
