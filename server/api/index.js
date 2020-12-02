const { Router } = require('express');

const router = Router();

router.use('/data', require('./data'));
router.use('/user', require('./user'));

module.exports = router;
