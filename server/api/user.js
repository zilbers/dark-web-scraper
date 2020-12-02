const { Router } = require('express');
const router = Router();

// Posts seen bins
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

module.exports = router;
