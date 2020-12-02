const { Router } = require('express');
const router = Router();

let hiding = [];

// Gets seen bins
router.get('/_alerts', async (req, res) => {
  try {
    res.json({ hiding });
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Posts seen bins
router.post('/_alerts', async (req, res) => {
  try {
    const { body } = req;
    hiding = body;
    res.json({ message: 'updated' });
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

module.exports = router;
