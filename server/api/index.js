const { Router } = require('express');

const router = Router();

router.use('/data', require('./data'));

module.exports = router;
