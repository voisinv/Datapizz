var User = function($rootScope) {
    var name = '';
    var firstName = '';
    var connected = false;

    this.load = function(name, firstName) {
        this.name = name;
        this.firstName = firstName;
        this.connected = true;

        $rootScope.$broadcast('userChanged');

        return true;
    };
    this.clear = function() {
        this.name = '';
        this.firstName = '';
        this.connected = false;

        $rootScope.$broadcast('userChanged');
    };
    this.getName = function() {
        return this.firstName + ' ' + this.name;
    };
    this.isConnected = function() {
        return this.connected;
    };
};

angular.module('datapizz.services')
    .service('User', User);