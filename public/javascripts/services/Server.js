var DOMAIN = 'localhost';
var PORT = '3000';
var API = '/api';
var ENTITIES = '/entities';

var server_infos = {
  connect_api: 'http://' + DOMAIN + ':' + PORT + API,
  get_entities: 'http://' + DOMAIN + ':' + PORT + ENTITIES
};

function server($http, Entities) {
  return  {
    connect: connect,
    getEntities: getEntities
  };

  function connect() {
    return $http.get(API).then(
      function(res) {
        return Entities.load(res.data, res.status);
      },
      function(errors) {
      }
    )
  }

  function getEntities(dates) {
    return $http.post(ENTITIES, dates).then(
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
  .constant('SERVER_INFOS', server_infos);