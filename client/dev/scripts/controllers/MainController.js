function MainController(Server) {
    var self = this;

    self.connect = function() {
        Server.connect().then(function() {});
    }

}

angular.module('datapizz.controllers')
    .controller('MainController', MainController);