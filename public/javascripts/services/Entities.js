
var collection = function() {};

collection.prototype.load = function(datas) {
    if(angular.isUndefined(datas)) throw new Error('entities is undefined');
    if(!angular.isArray(datas.links)) throw new Error('Links is not an array');
    if(!angular.isArray(datas.articles)) throw new Error('Articles is not an array');
    if(!angular.isArray(datas.tags)) throw new Error('Tags is not an array');

    this.links = datas.links;
    this.articles = datas.articles;
    this.tags = datas.tags;
};

collection.prototype.get = function() {
    return this;
};


function entities () {
    var privateCollection;
    var filteredCollection;

    this.load = function(datas, status) {
        privateCollection = new collection();
        privateCollection.load(datas);
        filteredCollection = privateCollection;
        console.log(filteredCollection);
        return status;
    };

    this.filterCollection = function() {
        filteredCollection;

        return filteredCollection;
    }.bind(this);

    this.get = function() {
        return filteredCollection;
    }.bind(this);

    this.getMinDate = function() {
        var articlesSortedByDate = _.sortByAll(privateCollection.articles, ['date']);
        return articlesSortedByDate[0].date;
    }.bind(this);

    this.getMaxDate = function() {
        var articlesSortedByDate = _.sortByAll(privateCollection.articles, ['date']);
        return articlesSortedByDate[articlesSortedByDate.length-1].date;
    }.bind(this);
}

angular.module('datapizz.services')
    .service('Entities', entities);