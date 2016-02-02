var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');

var entities = require('./dbconnection');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
// error handlers

// development error handler
// will print stacktrace

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

app.get('/partials/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});
app.use('/api', function(req, res) {
  entities.get(res);
});
app.get('/tagsListCSV', function(req, res) {
  entities.getTagsListCSV(res);
});
app.get('/tagsLinksCSV', function(req, res) {
  entities.getTagsLinksCSV(res);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
