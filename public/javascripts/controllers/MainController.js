function MainController(Server) {
    var self = this;
    self.connected = false;

    self.connect = function() {
        Server.getEntities().then(function() {
            self.connected = true;
        });
    };
}

function MainGraphController(Server, Entities, $rootScope) {
    var self = this;

    self.minDate = moment(Entities.getMinDate()).subtract(1, 'days').format('DD/MM/YYYY');
    self.maxDate = moment(Entities.getMaxDate()).add(1, 'days').format('DD/MM/YYYY');

    self.beginDate = self.minDate;
    self.endDate = self.maxDate;

    self.collectionReady = false;

    self.display = function() {
        self.collectionReady = true;
    };
    self.dateChanged = function() {
        Server.getFilteredEntities({
            beginDate: moment(self.beginDate, 'DD/MM/YYYY').valueOf(),
            endDate: moment(self.endDate, 'DD/MM/YYYY').valueOf()
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