const { Router } = require('express');
const { Client } = require('@elastic/elasticsearch');
const Sentiment = require('sentiment');

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

const KEYWORDS = [
  { DDOS: -3 },
  { exploits: -4 },
  { attack: -3 },
  { money: -2 },
  { bitcoin: -2 },
  { passwords: -5 },
  { information: -2 },
  { explosives: -5 },
  { weapons: -5 },
  { hacked: -4 },
  { password: -5 },
  { ransomware: -4 },
  { stolen: -5 },
  { username: -5 },
  { account: -3 },
  { leaked: -5 },
  { fullz: -3 },
  { 'dump data': -3 },
  { 'credit cards': -5 },
];

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
        q: `*${q}*`,
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

// Analyze bin
router.post('/_sentiment', async (req, res) => {
  try {
    // const { q: id } = req.query;
    // const { body: queryResult } = await client.search(
    //   {
    //     index: 'data',
    //     body: {
    //       query: {
    //         terms: {
    //           _id: [id],
    //         },
    //       },
    //     },
    //   },
    //   {
    //     ignore: [404],
    //     maxRetries: 3,
    //   }
    // );

    // const sourceArr = queryResult.hits.hits.map((item) => item._source);
    let result = { score: 0, comparative: 0, words: [] };
    const { body } = req;

    if (body) {
      const object = body;
      const sentiment = new Sentiment();
      for (const property in object) {
        const analyzedItem = sentiment.analyze(object[property], {
          extras: KEYWORDS,
        });
        if (Number.isInteger(analyzedItem.score)) {
          result.score += analyzedItem.score;
          result.comparative += analyzedItem.comparative;
        }
        if (analyzedItem.words[0]) {
          result.words.push(...analyzedItem.words);
        }
      }
    }
    res.json(result);
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

module.exports = router;
