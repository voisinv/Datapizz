var _ = require('lodash');
var Firebase = require('firebase');
var json2csv = require('json2csv');
var moment = require('moment');

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

var getLinkWithWeight = function(tags, allTags, links) {
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

var getTagsLinks = function(result) {
    var obj = {
        links: [],
        articles : _.values(result.articles),
        tags : _.values(result.tags)
    };

    obj.articles.forEach(function(article) {
        if(article.tags && article.tags.length) {
            getLinkWithoutWeightForCSV(article.tags, obj.tags, obj.links, article.date);
        }
    });
    return obj
};
var getLinkWithoutWeightForCSV = function(tags, allTags, links, dateMillis) {
  var numberOfTags = tags.length;
  var date = moment(dateMillis).format('DD/MM/YYYY');
  for(var fIt = 0; fIt < numberOfTags; fIt++) {
    for(var sIt = fIt + 1; sIt < numberOfTags; sIt++) {
      links.push({
        source: tags[fIt],
        target: tags[sIt],
        date: date
      });
    }
  }
};

var getTagsList = function(result) {
  var tagsList = [];
  var articles = _.values(result.articles);

  articles.forEach(function(article) {
    if(article.tags && article.tags.length > 0) {
      article.tags.forEach(function (tag) {
        var tempTag = _.findWhere(tagsList, {value: tag});
        if (tempTag) {
          tempTag.weight++;
        } else {
          tagsList.push({value: tag, weight: 1});
        }
      });
    }
  });

  return tagsList;
};

var createLinks = function(result) {
  var obj = {
    links: [],
    articles : _.values(result.articles),
    tags : _.values(result.tags)
  };

  obj.articles.forEach(function(article) {
    if(article.tags && article.tags.length) {
      getLinkWithWeight(article.tags, obj.tags, obj.links);
    }
  });
  return obj
};

//PUBLIC
var dbconnection = {
  get : function(res) {
    db.once('value', function(s) {
      var obj = createLinks(s.val());
      res.status(200).send(obj);
    });
  },
  getTagsListCSV : function(res) {
    db.once('value', function(s) {
      var tagsList = getTagsList(s.val());
      var fields = ['tag', 'idTag', 'weight'];
      var myData = [];
      var result;

      tagsList.forEach(function(tag, i) {
        myData.push({'tag': tag.value, 'idTag': i, 'weight': tag.weight});
      });

      json2csv({ data: myData, fields: fields }, function(err, csv) {
        if (err) console.log(err);
        result = csv;
      });

      res.status(200).send(result);
    });
  },
  getTagsLinksCSV : function(res) {
    db.once('value', function(s) {
      var tagsLinks = getTagsLinks(s.val());
      var fields = ['source', 'target', 'date'];
      var myData = [];
      var result;

      tagsLinks.links.forEach(function(link) {
        myData.push({'source': link.source, 'target': link.target, 'date': link.date});
      });

      json2csv({ data: myData, fields: fields }, function(err, csv) {
        if (err) console.log(err);
        result = csv;
      });

      res.status(200).send(result);
    });
  }
};

module.exports = dbconnection;