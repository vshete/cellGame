var express = require('express');
var index = require('../controllers/index');
var router = express.Router();

/* GET home page. */
router.get('/', index.index);

module.exports = router;
