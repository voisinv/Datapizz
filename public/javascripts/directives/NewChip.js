
function newChip($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'template/newChip.html',
        scope: {
            val: '@?'
        },
        link: function (scope, elem, attrs) {
            var newChipElement = elem.children('.demo-input-container');
            if(newChipElement) {
                var str = attrs.val;
                var isOpened = false;
                if(str && str !== '') {
                    // open it
                    newChipElement.children('.input-style').autoGrowInput({
                        minWidth: 10,
                        maxWidth: function () {
                            return newChipElement.width() - 40;
                        },
                        comfortZone: 0
                    });
                    newChipElement.children('.input-style').animate(
                        {
                            'border-top-right-radius': 0,
                            'border-bottom-right-radius': 0
                        },
                        100,
                        function () {
                            $(this).blur();
                            $(this).val(str);
                            $(this).trigger('autogrow');
                        }
                    );
                    newChipElement.children('.new-tag-component').addClass('rotate');
                    isOpened = true;
                }

                $(function () {
                    newChipElement.children('.input-style').autoGrowInput({
                        minWidth: 10,
                        maxWidth: function () {
                            return newChipElement.width() - 40;
                        },
                        comfortZone: 0
                    });
                });
                newChipElement.children('.new-tag-component').click(function () {
                    if (isOpened) {
                        // send tag to remove
                        $rootScope.$broadcast('removeChip', newChipElement.children('.input-style').val());
                        // remove text
                        newChipElement.children('.input-style').val('');
                        // close it
                        newChipElement.children('.input-style').autoGrowInput({
                            minWidth: 0,
                            maxWidth: function () {
                                return newChipElement.width() - 40;
                            },
                            comfortZone: 0
                        });
                        newChipElement.children('.input-style').animate(
                            {
                                'border-top-right-radius': '30px',
                                'border-bottom-right-radius': '30px'
                            },
                            100
                        );
                        newChipElement.children('.new-tag-component').removeClass('rotate');
                        newChipElement.children('.new-tag-component').addClass('unrotate');
                        isOpened = !isOpened;
                        $rootScope.$broadcast('removeChip', newChipElement.children('.input-style').val());
                    } else {
                        // open it
                        newChipElement.children('.input-style').autoGrowInput({
                            minWidth: 10,
                            maxWidth: function () {
                                return newChipElement.width() - 40;
                            },
                            comfortZone: 0
                        });
                        newChipElement.children('.input-style').animate(
                            {
                                'border-top-right-radius': 0,
                                'border-bottom-right-radius': 0
                            },
                            100,
                            function () {
                                $(this).focus();
                            }
                        );
                        newChipElement.children('.new-tag-component').removeClass('unrotate');
                        newChipElement.children('.new-tag-component').addClass('rotate');
                        isOpened = !isOpened;

                        $(document).keypress(function (e) {
                            // TODO envoyer seulement le tag en cours
                            if (e.which == 13) {
                                $rootScope.$broadcast('addNewChip', newChipElement.children('.input-style').val());
                            }
                        });
                    }
                });
                $(window).resize(function () {
                    newChipElement.children('.input-style').trigger('autogrow');
                });

            }
        }
    };
}

angular.module('datapizz.directives')
    .directive('newChip', newChip);
