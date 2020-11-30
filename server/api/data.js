const { Router } = require('express');
const { spawn } = require('child_process');
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

// router.get('/check', async (req, res) => {
//   try {
//     let dataToSend;
//     // spawn new child process to call the python script
//     await new Promise((resolve, reject) => {
//       const python = spawn('python', ['../scraper/webscraper.py']);
//       // collect data from script
//       python.stdout.on('data', function (data) {
//         console.log('Pipe data from python script ...');
//         dataToSend = data.toString();
//         resolve();
//       });
//       // in close event we are sure that stream from child process is closed
//       python.on('close', (code) => {
//         console.log(`child process close all stdio with code ${code}`);
//       });
//       python.stderr.on('data', (data) => {
//         reject(data);
//       });
//     });
//     // send data to browser
//     res.send(dataToSend);
//   } catch ({ message }) {
//     res.status(500).send(message);
//   }
// });

module.exports = router;
