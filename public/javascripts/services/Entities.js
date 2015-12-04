
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

    this.filterCollection = function(minDate, maxDate) {
        // minDate et maxDate sous format ...
        minDate = moment(minDate);
        maxDate = moment(maxDate);

        filteredCollection.tags = _.slice(filteredCollection.tags, 10);

        /*var idArticle = 5;
        for(var i=0; i<filteredCollection.articles[5].tags.length; i++) {
            var tag = _.find(users, function(chr) {
                return chr.age < 40;
            });
        }


        /*
        5: Object
        date: 1448908906955
        tags: Array[3]
        0: "prothese"
        1: "3D"
        2: "marketing"
        length: 3
        __proto__: Array[0]
        title: "Des prothèses 3D"*/
    }.bind(this);

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