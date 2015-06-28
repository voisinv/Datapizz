var server_infos = {
    "DOMAIN": 'localhost',
    "PORT": '3000',
    "ADRESS": 'http://' + this.DOMAIN + ':' +  this.PORT
};

function server($q, SERVER_INFOS) {

    var connect = function() {
        var defered = $q.defer();

        $q.get(SERVER_INFOS.ADRESS).then(
            function(datas) {
                $q.resolve();
            },
            function(errors) {
                $q.reject();
            }
        )

        return $q.promise;
    }
    var methods = {
        connect: connect
    }

    return methods;

}

angular.module('datapizz.services')
    .factory('Server', server)
    .constant('SERVER_INFOS', server_infos)