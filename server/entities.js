var _ = require('lodash');
var Firebase = require('firebase');
var json2csv = require('json2csv');

// PRIVATE
function getDataBase(company, project) {
    return new Firebase('https://bdd-' + company + '.firebaseio.com/' + project);
}

function getIndex (value) {
    var length = this.length;
    for(var index = 0; index < length; index++) {
        if(this[index].value == value) return index;
    }
}

function getId(value) {
    return getIndex.call(this, value);
}

function getLinkWithWeight(tags, allTags, links) {
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
}

function getLinksList(result) {
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
}
function getLinkWithoutWeightForCSV(article, allTags, links) {
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
}

function getTagsList(result) {
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
}

function createLinks(result) {
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
}

function getUlsFromTag(result, tag) {
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
}

function toLowerCaseInTags(result, company, project) {
    var keyList = [];
    _.mapKeys(result.tags, function (value, key) {
        keyList.push({'key': key, 'tag': value});
    });

    keyList.forEach(function(key) {
        var dbByTags = new Firebase('https://bdd-' + company + '.firebaseio.com/' + project + '/tags');
        dbByTags.child(key.key).set({
            category: key.tag.category.toLowerCase(),
            value: key.tag.value.toLowerCase()
        });
    });
}
function toLowerCaseInArticles(result, company, project) {
    var keyList = [];
    _.mapKeys(result.articles, function (value, key) {
        keyList.push({'key': key, 'value': value});
    });

    keyList.forEach(function(key) {
        var dbByArticles = new Firebase('https://bdd-' + company + '.firebaseio.com/' + project + '/articles');
        var lowerCaseTags = _.flatMap(key.value.tags, function(tag) {
            return tag.toLowerCase();
        });
        dbByArticles.child(key.key).set({
            'date': key.value.date ? key.value.date : '',
            'mediaTypes': key.value.mediaTypes ? key.value.mediaTypes : null,
            'tags': lowerCaseTags,
            'title': key.value.title ? key.value.title : '',
            'url': key.value.url ? key.value.url : ''
        });
    });
}

//PUBLIC
var entities = {
    get : function(res) {
        var db = getDataBase(company, project);
        db.once('value', function(s) {
            var obj = createLinks(s.val());
            res.status(200).send(obj);
        });
    },
    getTagsListCSV : function(res, company, project) {
        var db = getDataBase(company, project);
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
    getLinksListCSV : function(res, company, project) {
        var db = getDataBase(company, project);
        db.once('value', function(s) {
            var tagsLinks = getLinksList(s.val());
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
    getUlsFromTag : function(res, company, project, tag) {
        var db = getDataBase(company, project);
        db.once('value', function(s) {
            var obj = getUlsFromTag(s.val(), tag);
            res.status(200).send(obj);
        });
    },
    toLowerCase : function(res, company, project) {
        var db = getDataBase(company, project);
        db.once('value', function(s) {
            toLowerCaseInTags(s.val(), company, project);
            toLowerCaseInArticles(s.val(), company, project);
            res.status(200).send('Lowercase all tags ok.');
        });
    },
    addTag : function(res, company, project, tagValue, tagCategory) {
        var db = getDataBase(company, project);
        db.child('tags').push({
            value: tagValue,
            category: tagCategory
        });
        res.status(200).send('Tag ' + tagValue + ' added successfully.');
    },
    login : function(res, userParams) {
        if(userParams.userName === 'aflex' && userParams.password === 'lapu') {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    }
};

module.exports = entities;