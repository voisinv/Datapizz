
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
    var self = this;
    self.privateCollection = new collection();
    self.minDate = moment();
    self.maxDate = moment();

    this.load = function(datas, status) {
        self.privateCollection.load(datas);
        self.setMinDate(_.first(_.sortByAll(self.privateCollection.articles, ['date'])).date);
        self.setMaxDate(_.last(_.sortByAll(self.privateCollection.articles, ['date'])).date);

        return status;
    };

    self.get = function() {
        return self.privateCollection;
    };

    self.getMinDate = function() {
        return self.minDate;
    };

    self.setMinDate = function(minDate) {
        self.minDate = minDate;
    };

    self.getMaxDate = function() {
        return self.maxDate;
    };

    self.setMaxDate = function(maxDate) {
        self.maxDate = maxDate;
    };
}

angular
    .module('datapizz.services')
    .service('Entities', entities);