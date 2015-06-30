var server_infos = {
    "DOMAIN": 'localhost',
    "PORT": '3000',
    "ADRESS": 'http://'+ 'localhost' + ':' + '3000'
};

function server($http, SERVER_INFOS, Entities) {

    var connect = function() {
        console.log(SERVER_INFOS.ADRESS);
        $http.get(SERVER_INFOS.ADRESS + '/api').then(
            function(datas) {
                console.info(datas)
                Entities.load(datas.data);
            },
            function(errors) {
            }
        )

     }
    var methods = {
        connect: connect
    }

    return methods;

}

angular.module('datapizz.services')
    .factory('Server', server)
    .constant('SERVER_INFOS', server_infos)