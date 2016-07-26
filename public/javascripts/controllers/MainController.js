function MainController(Server, $http, $location) {
  var self = this;
  self.connected = false;
  self.title = 'Main';
  self.tagToSearch = '';
  self.searchedTag = '';
  self.domains = [];

  self.company = '';
  self.project = '';

  self.connect = function() {
    Server.connect().then(function(){self.connected = true;})
  };
  self.getTagsListCSV = function() {
    $http.get('/tagsListCSV/' + self.company + '/' + self.project).then(
      function(data) {
        console.log('success');

        // crade ! seul moyen de créer un csv : http://stackoverflow.com/questions/20300547/download-csv-file-from-web-api-in-angular-js
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/csv,' + encodeURI(data.data);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'tagsList.csv';
        hiddenElement.click();
      },
      function(err) {
        console.log(err);
      });
  };
  self.getTagsLinksCSV = function() {
    $http.get('/tagsLinksCSV/' + self.company + '/' + self.project).then(
      function(data) {
        console.log('success');

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/csv,' + encodeURI(data.data);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'tagsLinks.csv';
        hiddenElement.click();
      },
      function(err) {
        console.log(err);
      });
  };
  self.getDetails = function() {
    var url = 'detail/' + self.tagToSearch;
    $location.path(url);
  };
}

function DetailController($routeParams, $location, $http) {
  var self = this;

  self.title = 'Detail';
  self.tag = $routeParams.tag;
  self.domains = [];

  self.init = function() {
    var url = 'tagUrls/' + self.tag;
    $http.get(url).then(
      function(data) {
        // success
        console.log('tag ' + self.tag + ' - success');
        self.domains = data.data.domains;
      },
      function() {
        // error
        console.log('tag ' + self.tag + ' - error');
      }
    );
  };

  self.returnToTagForm = function() {
    $location.path('/');
  };
}

function MainGraphController(Entities, $mdSidenav, $mdUtil, $log) {
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
    var debounceFn =  $mdUtil.debounce(function(){
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    },200);
    return debounceFn;
  }
  self.close = function () {
    $mdSidenav('right').close()
      .then(function () {
        $log.debug("close RIGHT is done");
      });
  };

}


angular.module('datapizz.controllers')
    .controller('MainController', MainController)
    .controller('DetailController', DetailController)
    .controller('MainGraphController', MainGraphController);