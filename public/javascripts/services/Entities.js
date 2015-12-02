
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

    this.load = function(datas, status) {
        privateCollection = new collection();
        privateCollection.load(datas);
        return status;
    };

    this.get = function() {
        console.log('collec');
        console.log(privateCollection);
        return privateCollection;
    }.bind(this);

    this.getMinAndMaxDates = function() {
        var articlesSortedByDate = _.sortByAll(privateCollection.articles, ['date']);
        return {minDate: articlesSortedByDate[0].date, maxDate: articlesSortedByDate[articlesSortedByDate.length-1].date}
    }.bind(this);
}

angular.module('datapizz.services')
    .service('Entities', entities);