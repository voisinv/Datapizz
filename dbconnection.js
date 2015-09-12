var _ = require('lodash');
var Firebase = require('firebase');

var mockedDatas = require('./pizzaaa-export.json');

var db = new Firebase('https://test-datapizz.firebaseio.com/');

// PRIVATE
function getIndex (value) {
  var length = this.length;
  for(var index = 0; index < length; index++) {
    if(this[index].value == value) return index;
  }
}

//TODO test indexOf
var getValueFromIndex = function(index) {
  return this[index].value;
};

var getIdFromValue = function(ref) {
  return getIndex.call(this, ref);
};

var getId = function(index) {
  return getIdFromValue.call(this, getValueFromIndex.call(this, index));
};

var getLink = function(allTags, links) {
  var numberOfTags = this.length;
  for(var fIt = 0; fIt < numberOfTags; fIt++) {
    for(var sIt = fIt + 1; sIt < numberOfTags; sIt++) {
      var idSource = getId.call(allTags, fIt);
      var idTarget = getId.call(allTags, sIt);
      console.log(numberOfTags, idSource, idTarget);
      var link = _.findWhere(links, {source: idSource, target: idTarget});
      // If link already exist
      if(link) {
        link.value += 1;
      } else {
        console.log('link added');
        links.push({
          source: idSource,
          target: idTarget,
          value: 3})
      }
    }
  }
};

var getFullObject = function(result) {
  var obj = {
    links: [],
    articles : result.articles,
    tags : result.tags
  };

  result.articles.forEach(function(article) {
    if(article.tags.length) {
      getLink.call(article.tags, result.tags, obj.links);
    }
  });

  return obj
};

//PUBLIC
var dbconnection = {
    get : function(res, name) {
      db.once('value', function(s) {
        var obj = getFullObject(s.val());
        res.status(200).send(obj);
      });

    }

};

var result = function (res, result) {

}
module.exports = dbconnection;