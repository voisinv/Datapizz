function MainController(Server) {
    var self = this;

    self.connect = function() {
        Server.connect();

    };
}

function MainGraphController(Entities) {
  var self = this;
  self.collectionReady = false;
  self.display = function() {
    self.entities = Entities.get();
    self.collectionReady = true;
  }
}


angular.module('datapizz.controllers')
    .controller('MainController', MainController)
    .controller('MainGraphController', MainGraphController)