var _ = require('lodash');
var Firebase = require('firebase');

var db = new Firebase('https://pizzaaa.firebaseio.com/');

// PRIVATE
function getIndex (value) {
  var length = this.length;
  for(var index = 0; index < length; index++) {
    if(this[index].value == value) return index;
  }
}

var getId = function(value) {
  return getIndex.call(this, value);
};

var getLink = function(tags, allTags, links) {
  var numberOfTags = tags.length;
  for(var fIt = 0; fIt < numberOfTags; fIt++) {
    for(var sIt = fIt + 1; sIt < numberOfTags; sIt++) {
      var idSource = getId.call(allTags, tags[fIt]);
      var idTarget = getId.call(allTags, tags[sIt]);
      var link = _.findWhere(links, {source: idSource, target: idTarget});
      // If link already exist
      if(link) {
        link.value += 1;
      } else {
        links.push({
          source: idSource,
          target: idTarget,
          value: 3})
      }
    }
  }
};

var createLinks = function(result) {
  var obj = {
    links: [],
    articles : _.values(result.articles),
    tags : _.values(result.tags)
  };

  obj.articles.forEach(function(article) {
    if(article.tags.length) {
      getLink(article.tags, obj.tags, obj.links);
    }
  });
  return obj
};

//PUBLIC
var dbconnection = {
    get : function(res, name) {
      db.once('value', function(s) {
        var obj = createLinks(s.val());
        res.status(200).send(obj);
      });
    }
};

var result = function (res, result) {
};

module.exports = dbconnection;