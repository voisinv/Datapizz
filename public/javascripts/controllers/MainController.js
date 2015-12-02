function MainController(Server) {
    var self = this;
    self.connected = false;

    self.connect = function() {
        Server.connect().then(function() {
            self.connected = true;
        });
    };
}

function MainGraphController($mdSidenav, $mdUtil, $log) {
    var self = this;
    self.collectionReady = false;
    self.display = function() {
        self.collectionReady = true;
    };
    self.toggleRight = buildToggler('right');

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
        return $mdUtil.debounce(function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }, 200);
    }

    self.close = function () {
        $mdSidenav('right')
            .close()
            .then(function () {
                $log.debug("close RIGHT is done");
            });
    };
}

angular.module('datapizz.controllers')
    .controller('MainController', MainController)
    .controller('MainGraphController', MainGraphController);