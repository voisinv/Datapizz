var ENTITIES = '/entities';
var FILTERED_ENTITIES = '/filteredEntities';

function server($http, Entities) {
  return  {
    getEntities: getEntities,
    getFilteredEntities: getFilteredEntities
  };

  function getEntities() {
    return $http.get(ENTITIES).then(
      function(res) {
        return Entities.load(res.data, res.status);
      },
      function(errors) {
        console.log('getEntities foireux: ' + errors);
      }
    )
  }

  function getFilteredEntities(dates) {
    return $http.post(FILTERED_ENTITIES, dates).then(
      function(res) {
        return Entities.load(res.data, res.status);
      },
      function(errors) {
        console.log('getFilteredEntities foireux: ' + errors);
      }
    )
  }
}

angular.module('datapizz.services')
  .factory('Server', server);