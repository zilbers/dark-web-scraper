const { Router } = require('express');
const { Client } = require('@elastic/elasticsearch');
const Sentiment = require('sentiment');
const crypto = require('crypto');
// MongoDB models:
const User = require('../models/user');

// Helpers
async function indices(client, index, properties) {
  await client.indices.exists(
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
                _doc: {
                  properties: {
                    ...properties,
                  },
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
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  content: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  author: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  date: {
    type: 'date',
    format: 'yyyy-MM-dd HH:mm:ss',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
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

let status = {};

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

    const sourceArr = result.hits.hits.map((item) => ({
      ...item._source,
      id: item._id,
    }));

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
        // q,
        size: 1000,
      },
      {
        ignore: [404],
        maxRetries: 3,
      }
    );
    const sourceArr = result.hits.hits.map((item) => ({
      ...item._source,
      id: item._id,
    }));

    res.json(sourceArr);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Find by word
router.get('/_label', async (req, res) => {
  try {
    const { q } = req.query;
    const { body: result } = await client.search(
      {
        index: 'data',
        q: `*${q}*`,
        // q,
        size: 1000,
      },
      {
        ignore: [404],
        maxRetries: 3,
      }
    );

    res.json({ label: q, value: result.hits.hits.length });
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Get scraper status
router.get('/_status', async (req, res) => {
  try {
    res.json(status);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Get scraper status
router.get('/_check', async (req, res) => {
  try {
    status.checked = true;
    res.json(status);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Get by page
router.get('/_bins/:page', async (req, res) => {
  try {
    const page = Number(req.params.page);
    const { q, id: _id } = req.query;
    // const { alerts: hiding } = await User.findOne({ _id });
    const body = q
      ? {
          from: page * 10,
          size: 10,
          sort: 'date',
          index: 'data',
          q: `*${q}*`,
          // q,
        }
      : {
          from: page * 10,
          size: 10,
          sort: 'date',
          index: 'data',
          body: {
            query: {
              match_all: {},
            },
          },
        };
    const { body: result } = await client.search(body, {
      ignore: [404],
      maxRetries: 3,
    });

    const sourceArr = result.hits.hits.map((item) => ({
      ...item._source,
      id: item._id,
    }));
    // .filter(({ id }) => !hiding.includes(id));

    res.send(sourceArr);
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

// Analyze bins
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

    let result = [];
    const { body } = req;

    if (body) {
      const sentiment = new Sentiment();

      for (const item of body) {
        let current = { score: 0, comparative: 0, words: [] };

        for (const property in item) {
          const analyzedItem = sentiment.analyze(item[property], {
            extras: KEYWORDS,
          });
          if (Number.isInteger(analyzedItem.score)) {
            current.score += analyzedItem.score;
            current.comparative += analyzedItem.comparative;
          }
          if (analyzedItem.words[0]) {
            current.words.push(...analyzedItem.words);
          }
        }
        result.push(current);
      }
    }
    res.json(result);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Set scraper status
router.post('/_status', async (req, res) => {
  try {
    const { body } = req;
    status = body;
    res.json({ message: 'COOL, COOL, COOL' });
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Post new data
router.post('/', async (req, res) => {
  try {
    const index = 'data';
    indices(client, index, dataProps);

    const { body: data } = req;
    const body = data.flatMap((doc) => {
      const _id = crypto
        .createHash('md5')
        .update(doc.date + doc.header)
        .digest('hex');
      return [{ index: { _index: index, _type: '_doc', _id } }, doc];
    });

    const bulkResponse = await client.bulk({ refresh: true, body });
    res.json(bulkResponse);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
