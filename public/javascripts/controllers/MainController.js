function MainController(Server) {
    var self = this;
    self.connected = false;

    self.connect = function() {
        Server.connect().then(function() {
            self.connected = true;
        });
    };
}

function MainGraphController(Entities) {
    var self = this;

    self.beginDate = moment(Entities.getMinDate()).toDate();
    self.minDate = moment(self.beginDate).subtract(1, 'days').toDate();
    self.endDate = moment(Entities.getMaxDate()).toDate();
    self.collectionReady = false;

    self.display = function() {
        self.collectionReady = true;
    };

    self.dateChanged = function() {
        // maj entities list
        Entities.filterCollection();
        // reload graph

    };
}

angular.module('datapizz.controllers')
    .controller('MainController', MainController)
    .controller('MainGraphController', MainGraphController);