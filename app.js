var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');
var entities = require('./dbconnection');


var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('port', (process.env.PORT || 5000));

app.use('/api', function(req, res) {
    entities.get(res);
    //res.status(200).send(ent);
});


// This will change in production since we'll be using the dist folder
app.use(express.static(path.join(__dirname, 'client/app')));

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
});


app.listen(app.get('port'), function() {
  console.log('App is running, server is listening on port ', app.get('port'));
});


module.exports = app;
