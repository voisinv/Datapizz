var _ = require('lodash');
var Firebase = require('firebase');
var json2csv = require('json2csv');

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
        articles: [],
        tags: []
    };

  if(result.articles && result.tags) {
    obj.articles = _.values(result.articles);
    obj.tags = _.values(result.tags);

    obj.articles.forEach(function (article) {
      if (article.tags && article.tags.length) {
        getLinkWithoutWeightForCSV(article, obj.tags, obj.links);
      }
    });
  }

    return obj
};
var getLinkWithoutWeightForCSV = function(article, allTags, links) {
  const tags = article.tags;
  var numberOfTags = tags.length;
  for(var fIt = 0; fIt < numberOfTags; fIt++) {
    for(var sIt = fIt + 1; sIt < numberOfTags; sIt++) {
      links.push({
        source: tags[fIt],
        target: tags[sIt],
        url: article.url,
        title: article.title
      });
    }
  }
};

var getTagsList = function(result) {
  var tagsList = [];
  if(result.articles) {
    var articles = _.values(result.articles);

    articles.forEach(function (article) {
      if (article.tags && article.tags.length > 0) {
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
  }

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

var getUlsFromTag = function(result, tag) {
  var obj = {
    domains: [],
    tag : tag
  };
  var articles = _.values(result.articles);

  articles.forEach(function(article) {
    if(article.tags && article.tags.length && _.indexOf(article.tags, tag) !== -1) {
      obj.domains.push({url: article.url, title: article.title});
    }
  });
  return obj
};

//PUBLIC
var entities = {
  get : function(res) {
    db.once('value', function(s) {
      var obj = createLinks(s.val());
      res.status(200).send(obj);
    });
  },
  getTagsListCSV : function(res, company, project) {
    var db = new Firebase('https://bdd-' + company + '.firebaseio.com/' + project);
    db.once('value', function(s) {
      var tagsList = getTagsList(s.val());
      var fields = ['id', 'label', 'weight'];
      var myData = [];

      tagsList.forEach(function(tag) {
        myData.push({'id': tag.value, 'label': tag.value, 'weight': tag.weight});
      });

      json2csv({ data: myData, fields: fields }, function(err, csv) {
        if (err) console.log(err);
        res.status(200).send(csv);
      });
    });
  },
  getTagsLinksCSV : function(res, company, project) {
    var db = new Firebase('https://bdd-' + company + '.firebaseio.com/' + project);
    db.once('value', function(s) {
      var tagsLinks = getTagsLinks(s.val());
      var fields = ['source', 'target', 'url', 'title'];
      var myData = [];
      var result;

      tagsLinks.links.forEach(function(link) {
        myData.push({'source': link.source, 'target': link.target, 'url': link.url, 'title': link.title});
      });

      json2csv({ data: myData, fields: fields }, function(err, csv) {
        if (err) console.log(err);
        res.status(200).send(csv);
      });
    });
  },
  getUlsFromTag : function(res, tag) {
    db.once('value', function(s) {
      var obj = getUlsFromTag(s.val(), tag);
      res.status(200).send(obj);
    });
  }
};

module.exports = entities;