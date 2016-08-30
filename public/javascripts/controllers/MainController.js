function IndexController($location, $scope, User) {
    var self = this;

    self.connected = false;
    $scope.$on('userChanged', function() {
        self.connected = User.isConnected();
    });

    self.logIn = function () {
        $location.path('/login');
    };
    self.logOut = function () {
        User.clear();
        $location.path('/');
    };
}

function MainController($http, $location, User) {
    var self = this;
    self.connected = User.isConnected();
    self.title = 'Main';
    self.tagToSearch = '';
    self.searchedTag = '';
    self.domains = [];

    self.company = '';
    self.project = '';

    self.getTagsListCSV = function () {
        $http.get('/tagsListCSV/' + self.company + '/' + self.project).then(
            function (data) {
                console.log('success');

                // crade ! seul moyen de créer un csv : http://stackoverflow.com/questions/20300547/download-csv-file-from-web-api-in-angular-js
                var hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:attachment/csv,' + encodeURI(data.data);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'tagsList.csv';
                hiddenElement.click();
            },
            function (err) {
                console.log(err);
            });
    };
    self.getLinksListCSV = function () {
        $http.get('/linksListCSV/' + self.company + '/' + self.project).then(
            function (data) {
                console.log('success');

                var hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:attachment/csv,' + encodeURI(data.data);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'linksList.csv';
                hiddenElement.click();
            },
            function (err) {
                console.log(err);
            });
    };
    self.getDetails = function () {
        var url = 'detail/' + self.company + '/' + self.project + '/' + self.tagToSearch;
        $location.path(url);
    };
    self.addTag = function() {
        var url = 'addTag/' + self.company + '/' + self.project + '/' + self.tagValueToAdd + '/' + self.tagCategoryToAdd;
        $http.get(url).then(
            function(res) { alert(res.data); },
            function(err) { alert('Erreur adding tag'); }
        );
    };
    self.toLowerCaseAll = function() {
        var url = '/toLowerCase/' + self.company + '/' + self.project;
        $http.get(url).then(
            function(res) { alert(res.data); },
            function(err) { alert('Erreur lowercasing all tags'); }
        );
    }
}

function DetailController($routeParams, $location, $http) {
    var self = this;

    self.title = 'Detail';
    self.tag = $routeParams.tag;
    self.company = $routeParams.company;
    self.project = $routeParams.project;
    self.domains = [];

    self.init = function () {
        var url = 'tagDetails/' + self.company + '/' + self.project + '/' + self.tag;
        $http.get(url).then(
            function (data) {
                // success
                console.log('success : tag ' + self.tag);
                self.domains = data.data.domains;
            },
            function (error) {
                // error
                console.log('error : tag ' + self.tag + ' - ' + error);
            }
        );
    };

    self.returnToTagForm = function () {
        $location.path('/');
    };
}

function MainGraphController($mdSidenav, $mdUtil, $log) {
    var self = this;
    self.collectionReady = false;
    self.display = function () {


        self.collectionReady = true;
    };
    self.toggleRight = buildToggler('right');
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function () {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }, 200);
        return debounceFn;
    }

    self.close = function () {
        $mdSidenav('right').close()
            .then(function () {
                $log.debug("close RIGHT is done");
            });
    };

}

function LoginController($location, Server, User) {
    var self = this;
    self.userName = '';
    self.password = '';

    self.login = function() {
        Server.login(self.userName, self.password).then(
            function(result) {
                User.load('', self.userName, result.data);
                $location.path('/main');
            },
            function(err) {
                console.log(err);
            }
        );
    };
}

angular.module('datapizz.controllers')
    .controller('IndexController', IndexController)
    .controller('MainController', MainController)
    .controller('LoginController', LoginController)
    .controller('DetailController', DetailController)
    .controller('MainGraphController', MainGraphController);