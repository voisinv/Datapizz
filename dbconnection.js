var _ = require('lodash');
var Firebase = require('firebase');

var db = new Firebase('https://pizzaaa.firebaseio.com/');

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

/**
 * Create a tags object from articles
 * @param articles
 * @returns [{radius: count * 5, value: ''}, ...]
 */
function getTags(articles) {
    return _(articles)
        .chain()
        .map('tags')
        .flatten()
        .countBy()
        .map(function(count, name){
            /// TODO : la categorie ?
            return {radius: count * 5, value: name}
        })
        .value()
}

var createLinks = function (articles) {
    var obj = {
        links: [],
        articles: articles,
        tags: getTags(articles)
    };

    obj.articles.forEach(function (article) {
        if (article.tags && article.tags.length) {
            getLink(article.tags, obj.tags, obj.links);
        }
    });
    return obj;
};

//PUBLIC
var dbconnection = {
    getEntities: function (res) {
        db.once('value', function (s) {
            var obj = createLinks(_.values(s.val().articles));
            res.status(200).send(obj);
        });
    },
    getFilteredEntities: function (dates, res) {
        db.once('value', function (s) {
            var obj = createLinks(_.values(s.val().articles).filter(function(e) {
                return e.date >= dates.beginDate && e.date <= dates.endDate;
            }));
            res.status(200).send(obj);
        });
    }
};

module.exports = dbconnection;