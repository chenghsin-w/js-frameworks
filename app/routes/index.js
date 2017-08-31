const express = require('express');
const path = require('path');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'JS Frameworks' });
});

router.get('/framework/:name', function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'public', 'javascripts', req.params.name, 'index.html'));
});

module.exports = router;
