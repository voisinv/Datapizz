'use strict';

angular.module('datapizz.controllers', []);
angular.module('datapizz.services', []);
angular.module('datapizz.directives', []);
angular.module('datapizz.filters', []);

var modules = [
    'ngMaterial',
    'ngRoute',
    'datapizz.controllers',
    'datapizz.services',
    'datapizz.directives',
    'datapizz.filters'
];

angular.module('datapizz', modules)
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .backgroundPalette('grey')
            .warnPalette('red')
            .accentPalette('pink');
    })
    .config(function($routeProvider) {
        $routeProvider
            // TODO : Ne trouve pas les templates ??
            .when('/', {
                templateUrl: '../template/main.html',
                controller: 'MainController as main'
            })
            .when('/detail/:company/:project/:tag', {
                templateUrl: '../template/detail.html',
                controller: 'DetailController as detail'
            })
            .otherwise('/main');
    });