var express = require('express');
var router = express.Router();
var entities = require('./entities');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('here');
  res.render('index', { title: 'Express' });
});

/* Get one page
router.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});*/

router.get('/api', function(req, res) {
  entities.get(res);
});
router.get('/tagsListCSV', function(req, res) {
  entities.getTagsListCSV(res);
});
router.get('/tagsLinksCSV', function(req, res) {
  entities.getTagsLinksCSV(res);
});
router.get('/tagUrls/:tag', function(req, res) {
  entities.getUlsFromTag(res, req.params.tag);
});

module.exports = router;
