const { Router } = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const { resolve } = require('path');

const router = Router();

// Get albums
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

module.exports = router;
