angular.module('datapizz', ['ngMaterial'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .backgroundPalette('grey')
            .warnPalette('red')
            .accentPalette('pink');
    });