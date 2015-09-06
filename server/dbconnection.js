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
  return getIndex(ref).apply(this);
};

var getId = function(index) {
  return getIdFromValue(getValueFromIndex(index).apply(this)).apply(this);
}

var getLink = function(allTags, links) {
  var numberOfTags = this.length;
  var fIt = 0;
  var sIt = fIt + 1;
  var getIdSource = getId.bind(allTags, fIt);
  var getIdTarget = getId.bind(allTags, sIt);

  for(fIt = 0; fIt < numberOfTags - 1; fIt++) {
    for(sIt = fIt + 1; sIt < numberOfTags; sIt++) {
      /*
      var idSource = getIdFromValue(getValueFromIndex(fIt).apply(allTags)).apply(allTags);

      var idTarget = getIdFromValue(getValueFromIndex(sIt).apply(allTags)).apply(allTags);
      */
      var idSource = getIdSource();
      var idTarget = getIdTarget();
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

var getFullObject = function(result) {
  var obj = {
    links: [],
    articles : result.articles,
    tags : result.tags
  };
  /*
  var i = 0, length;
  result.articles.forEach(function(article, i) {
    if(article.tags.length > 1){
      createLinksBetweenArticleTags(result.tags, obj.links).apply(article.tags);
    }
  });*/

  result.articles.forEach(function(article) {
    if(article.tags.length) {
      getLink.apply(result.tags, article);
    }
  })

  return obj
}

//PUBLIC
var dbconnection = {
    get : function(res, name) {
      db.once('value', function(s) {;
        var obj = getFullObject(s.val())

        /*
        for(i, length = datas.articles.length; i < length; i++) {
          var tagsOfElement = datas.articles[i].tags;
          if(tagsOfElement.length > 1){
            createLinksBetweenArticleTags(tagsOfElement, datas.tags, obj.links);
          }
        }*/
        res.status(200).send(obj);
      });

    }

};

var result = function (res, result) {

};

module.exports = dbconnection;