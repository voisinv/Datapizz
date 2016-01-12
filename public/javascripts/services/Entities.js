
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

collection.prototype.clear = function() {
    this.articles = [];
    this.links = [];
    this.tags = [];
};


function entities () {
    var privateCollection = new collection();
    var filteredCollection = new collection();

    this.load = function(datas, status) {
        privateCollection.load(datas);
        filteredCollection = angular.copy(privateCollection);

        return status;
    };

    this.loadNewEntities = function(datas, status) {
        filteredCollection.clear();
        filteredCollection.load(datas);

        return status;
    };

    this.get = function() {
        return filteredCollection;
    }.bind(this);

    this.getMinDate = function() {
        return _.first(_.sortByAll(privateCollection.articles, ['date'])).date;
    }.bind(this);

    this.getMaxDate = function() {
        return _.last(_.sortByAll(privateCollection.articles, ['date'])).date;
    }.bind(this);
}

angular.module('datapizz.services')
    .service('Entities', entities);