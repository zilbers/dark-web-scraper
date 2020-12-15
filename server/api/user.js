const { ObjectId } = require('mongodb');
const { Router } = require('express');
//MongoDB models:
const User = require('../models/user');

const router = Router();

// Gets seen bins
router.get('/_alerts', async (req, res) => {
  try {
    const { id: _id } = req.query;
    const { alerts: hiding } = await User.findOne({ _id });

    res.json({ hiding });
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Get all users
router.get('/_all', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Updates seen bins
router.put('/_alerts', async (req, res) => {
  try {
    const { body: alerts } = req;
    const { id } = req.query;

    User.update({ _id: ObjectId(id) }, { $set: { alerts } })
      .then(() => res.status(201).json('Updated alerts!'))
      .catch((e) => res.status(404).json(e));
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Get current config
router.get('/_config', async (req, res) => {
  try {
    const { id: _id } = req.query;
    const { config } = await User.findOne({ _id });
    res.json(config);
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Updates config
router.put('/_config', async (req, res) => {
  try {
    const { body: config } = req;
    const { id } = req.query;

    User.update({ _id: ObjectId(id) }, { $set: { config } })
      .then(() => res.status(201).json('Updated config!'))
      .catch((e) => res.status(404).json(e));
  } catch ({ message }) {
    res.status(500).send(message);
  }
});

// Register new user
router.post('/_new', (req, res) => {
  try {
    const { body: rawUserData } = req;

    const user = new User({
      ...rawUserData,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    user
      .save(user)
      .then(() => res.status(201).json('Created user!'))
      .catch(() => res.status(404).json('The email is already in use!'));
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
