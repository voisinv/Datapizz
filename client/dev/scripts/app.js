'use strict';

angular.module('datapizz.controllers', []);
angular.module('datapizz.services', []);
angular.module('datapizz.directives', []);
angular.module('datapizz.filters', []);

var modules = [
    'ngMaterial',
    'ui.router',
    'datapizz.controllers',
    'datapizz.services',
    'datapizz.directives',
    'datapizz.filters',
]

angular.module('datapizz', modules)
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .backgroundPalette('grey')
            .warnPalette('red')
            .accentPalette('pink');
    });