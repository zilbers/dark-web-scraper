const { Router } = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const router = Router();

// Get data
router.get('/', async (req, res) => {
  try {
    const results = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream('../scraper/data/ForumScrape.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve();
        });
    });

    res.json(results);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Get links
router.get('/links', async (req, res) => {
  try {
    const results = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream('../scraper/data/Links.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve();
        });
    });

    res.json(results);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Get new scraped data
router.post('/', async (req, res) => {
  try {
    const { body: data } = req;
    fs.writeFile('test', JSON.stringify(data), 'utf-8');
    res.json('Saved data');
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
