var express = require('express');
var router = express.Router();
var entities = require('./entities');

var env = process.env.NODE_ENV || 'dev';

/* GET home page. */
router.get('/', function(req, res, next) {
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
    if (env === 'dev') {
        entities.getTagsListCSV(res, 'dev', 'projet1');
    } else {
        entities.getTagsListCSV(res, req.params.company.toLowerCase(), req.params.project.toLowerCase());
    }
});
router.get('/linksListCSV/:company/:project', function(req, res) {
    if (env === 'dev') {
        entities.getLinksListCSV(res, 'dev', 'projet1');
    } else {
        entities.getLinksListCSV(res, req.params.company.toLowerCase(), req.params.project.toLowerCase());
    }
});
router.get('/tagDetails/:company/:project/:tag', function(req, res) {
    if (env === 'dev') {
        entities.getUlsFromTag(res, 'dev', 'projet1', req.params.tag);
    } else {
        entities.getUlsFromTag(res, req.params.company.toLowerCase(), req.params.project.toLowerCase(), req.params.tag.toLowerCase());
    }
});

module.exports = router;
