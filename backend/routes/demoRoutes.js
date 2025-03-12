const express = require('express');
const router = express.Router();
const { bookDemo } = require('../controllers/demoController');

router.post('/book-demo', bookDemo);

module.exports = router;
