function MainController(Server) {
    var self = this;

    self.connect = function() {
        Server.connect();

    };
}

angular.module('datapizz.controllers')
    .controller('MainController', MainController);