function MainController($scope, Server, $http) {
  var self = this;
  self.connected = false;

  self.displaySearchedTag = false;
  self.tagToSearch = '';
  self.searchedTag = '';
  self.domains = [];

  self.connect = function() {
    Server.connect().then(function(){self.connected = true;})
  };
  self.getTagsListCSV = function() {
    $http.get('/tagsListCSV').then(
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
    $http.get('/tagsLinksCSV').then(
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
  self.tagDetails = function() {
    self.displaySearchedTag = false;
    var url = '/tagUrls/' + self.tagToSearch;
    $http.get(url).then(
        function(data) {
          // success
          console.log('tag ' + self.tagToSearch + ' - success');
          self.displaySearchedTag = true;
          self.searchedTag = data.data.tag;
          self.domains = data.data.domains;
        },
        function() {
          // error
          console.log('tag ' + self.tagToSearch + ' - error');
        }
    );
  };
  self.returnToTagForm = function() {
    self.displaySearchedTag = false;
    self.tagToSearch = '';
    self.searchedTag = '';
    self.domains = [];
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
    .controller('MainGraphController', MainGraphController)