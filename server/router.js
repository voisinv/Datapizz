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

router.get('/tagsListCSV/:company/:project', function(req, res) {
  var company = 'dev'; // prod : req.params.company
  var project = 'projet1'; // prod : req.params.project
  entities.getTagsListCSV(res, company, project);
});
router.get('/linksListCSV/:company/:project', function(req, res) {
  var company = 'dev'; // prod : req.params.company
  var project = 'projet1'; // prod : req.params.project
  entities.getLinksListCSV(res, company, project);
});
router.get('/tagUrls/:tag', function(req, res) {
  entities.getUlsFromTag(res, req.params.tag);
});

module.exports = router;
