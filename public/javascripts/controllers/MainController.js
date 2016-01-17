function MainController(Server) {
    var self = this;
    self.connected = false;

    self.connect = function() {
        Server.connect().then(function() {
            self.connected = true;
        });
    };
}

function MainGraphController(Server, Entities, $rootScope) {
    var self = this;

    self.minDate = moment(Entities.getMinDate()).subtract(1, 'days').toDate();
    self.maxDate = moment(Entities.getMaxDate()).toDate();

    self.beginDate = self.minDate;
    self.endDate = self.maxDate;

    self.collectionReady = false;

    self.display = function() {
        self.collectionReady = true;
    };
    self.dateChanged = function() {
        Server.getEntities({
            beginDate: moment(self.beginDate).valueOf(),
            endDate: moment(self.endDate).valueOf()
        }).then(
            function() {
                $rootScope.$broadcast('datesChanged');
            },
            function() {
                console.error("erreur recompilation avec filtre date");
            }
        );
    };
}

angular
    .module('datapizz.controllers')
    .controller('MainController', MainController)
    .controller('MainGraphController', MainGraphController);