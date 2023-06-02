var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send(`<h1>Welcome To Express<h1/>`)
});

module.exports = router;
