var _ = require('lodash');
var Firebase = require('firebase');

var db = new Firebase('https://pizzaaa.firebaseio.com/');

var articles = [];
var tags = [];
var links = [];

// PRIVATE
function getIndex(value) {
    var length = this.length;
    for (var index = 0; index < length; index++) {
        if (this[index].value == value) return index;
    }
}

var getId = function (value) {
    return getIndex.call(this, value);
};

var getLink = function (tags, allTags, links) {
    var numberOfTags = tags.length;
    for (var fIt = 0; fIt < numberOfTags; fIt++) {
        for (var sIt = fIt + 1; sIt < numberOfTags; sIt++) {
            var idSource = getId.call(allTags, tags[fIt]);
            var idTarget = getId.call(allTags, tags[sIt]);
            var link = _.findWhere(links, {source: idSource, target: idTarget});
            // If link already exist
            if (link) {
                link.value += 1;
            } else {
                links.push({
                    source: idSource,
                    target: idTarget,
                    value: 3
                })
            }
        }
    }
};

var createLinks = function (result, dates) {
    tags = _.values(result.tags);
    var articles = [];
    if (dates) {
        var tempArticles = _.values(result.articles);
        for(var i=0; i< tempArticles.length; i++) {
            if(tempArticles[i].date >= dates.beginDate && tempArticles[i].date < dates.endDate) {
                articles.push(tempArticles[i]);
            } else {
                updateTags(tempArticles[i]);
            }
        }
    } else {
        articles = _.values(result.articles);
    }

    var obj = {
        links: [],
        articles: articles,
        tags: tags
    };

    obj.articles.forEach(function (article) {
        if (article.tags && article.tags.length) {
            getLink(article.tags, obj.tags, obj.links);
        }
    });
    return obj;
};

var updateTags = function(deletedArticle) {
    for(var i=0; i<deletedArticle.tags.length; i++) {
        var tagIndex = _.indexOf(tags, deletedArticle.tags[i]);
        if (tagIndex >= 0) {
            if (tags[tagIndex].radius < 5) {
                //_.slice(tags, tagIndex, 1);
            }
            //tags[tagIndex].radius =  ? 0 : tag[tagIndex].radius - 5;
        }
    }
};


//PUBLIC
var dbconnection = {
    get: function (res, name) {
        db.once('value', function (s) {
            var obj = createLinks(s.val());
            res.status(200).send(obj);
        });
    },
    getNewEntities: function (dates, res) {
        db.once('value', function (s) {
            var obj = createLinks(s.val(), dates);
            res.status(200).send(obj);
        });
    }
};

module.exports = dbconnection;