var collection = function() {}

collection.prototype.load = function(datas) {
    if(angular.isUndefined(datas)) throw new Error('entities is undefined');
    if(!angular.isArray(datas.links)) throw new Error('Links is not an array');
    if(!angular.isArray(datas.articles)) throw new Error('Articles is not an array');
    if(!angular.isArray(datas.tags)) throw new Error('Tags is not an array');

    this.links = datas.links;
    this.articles = datas.articles;
    this.tags = datas.tags;
};


function entities () {
    this.links = [];
    this.tags = [];
    this.articles = [];

    this.load = function(datas) {
        if(angular.isUndefined(datas)) throw new Error('entities is undefined');
        if(!angular.isArray(datas.links)) throw new Error('Links is not an array');
        if(!angular.isArray(datas.articles)) throw new Error('Articles is not an array');
        if(!angular.isArray(datas.tags)) throw new Error('Tags is not an array');

        var c = new collection();
        c.load(datas);
        console.log('collection', c);
    }
}

angular.module('datapizz.services')
    .service('Entities', entities);