var DOMAIN = 'localhost';
var PORT = '3000';
var API = 'api';

var server_infos = {
  connect_api: 'http://' + DOMAIN + ':' + PORT + '/' + API
};

function server($http, SERVER_INFOS, Entities) {
  return  {
    connect: connect
  };

  function connect() {

    return $http.get('/api').then(
      function(res) {
        return Entities.load(res.data, res.status);
      },
      function(errors) {
      }
    )
  }
}

angular.module('datapizz.services')
  .factory('Server', server)
  .constant('SERVER_INFOS', server_infos)