var DOMAIN = 'localhost';
var PORT = '3000';
var API = 'api';

var server_infos = {
    connect_api: 'http://' + DOMAIN + ':' + PORT + '/' + API
};

function server($http, SERVER_INFOS, Entities) {
    return {
        connect: connect,
        login: login
    };

    function connect() {
        return $http.get('/api').then(
            function (res) {
                return Entities.load(res.data, res.status);
            },
            function (errors) {
            }
        )
    }

    function login(userName, password) {
        return $http.post('/login', {userName: userName, password: password});
    }
}

angular.module('datapizz.services')
    .factory('Server', server)
    .constant('SERVER_INFOS', server_infos);