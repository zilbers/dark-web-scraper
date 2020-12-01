const { Router } = require('express');
const csv = require('csv-parser');
const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

// Helpers
async function indices(client, index, properties) {
  client.indices.exists(
    {
      index,
    },
    (err, res, status) => {
      if (res.body) {
        console.log('Index exists!');
      } else {
        client.indices.create(
          {
            index,
            body: {
              mappings: {
                properties: {
                  ...properties,
                },
              },
            },
          },
          (err, res, status) => {
            console.log(err, res, status);
          }
        );
      }
    }
  );
}

const client = new Client({
  node: process.env.HOST || 'http://localhost:9200',
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
});

const dataProps = {
  header: {
    type: 'text',
  },
  content: {
    type: 'text',
  },
  author: {
    type: 'text',
  },
  date: {
    type: 'text',
  },
};

const router = Router();

// ENTRYPOINTS
// Get data
router.get('/', async (req, res) => {
  try {
    const { body: result } = await client.search(
      {
        index: 'data',
        body: {
          query: {
            match_all: {},
          },
        },
        size: 1000,
      },
      {
        ignore: [404],
        maxRetries: 3,
      }
    );

    const sourceArr = result.hits.hits.map((item) => item._source);
    res.json(sourceArr);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Search in data
router.get('/_search', async (req, res) => {
  try {
    const { q } = req.query;
    const { body: result } = await client.search(
      {
        index: 'data',
        q,
        size: 1000,
      },
      {
        ignore: [404],
        maxRetries: 3,
      }
    );

    const sourceArr = result.hits.hits.map((item) => item._source);
    res.json(sourceArr);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Post new data
router.post('/', async (req, res) => {
  try {
    const index = 'data';

    await indices(client, 'data', dataProps);

    const { body: data } = req;
    const body = data.flatMap((doc) => {
      const _id = doc._id.slice();
      delete doc._id;
      return [{ index: { _index: index, _type: 'data', _id } }, doc];
    });

    const bulkResponse = await client.bulk({ refresh: true, body });
    res.json(bulkResponse);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Get data
// router.get('/', async (req, res) => {
//   try {
//     const results = [];

//     await new Promise((resolve, reject) => {
//       fs.createReadStream('../scraper/data/ForumScrape.csv')
//         .pipe(csv())
//         .on('data', (data) => results.push(data))
//         .on('end', () => {
//           resolve();
//         });
//     });

//     res.json(results);
//   } catch ({ message }) {
//     res.status(500).send(message);
//   }
// });

// // Get links
// router.get('/links', async (req, res) => {
//   try {
//     const results = [];

//     await new Promise((resolve, reject) => {
//       fs.createReadStream('../scraper/data/Links.csv')
//         .pipe(csv())
//         .on('data', (data) => results.push(data))
//         .on('end', () => {
//           resolve();
//         });
//     });

//     res.json(results);
//   } catch ({ message }) {
//     res.status(500).send(message);
//   }
// });

// // Get new scraped data
// router.post('/', async (req, res) => {
//   try {
//     const { body: data } = req;
//     fs.writeFile('test', JSON.stringify(data), 'utf-8');
//     res.json('Saved data');
//   } catch ({ message }) {
//     res.status(500).send(message);
//   }
// });

module.exports = router;
