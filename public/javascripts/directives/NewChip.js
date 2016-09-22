
var autoGrow = function(minWidth, newChipElement) {
    newChipElement.children('.input-style').autoGrowInput({
        minWidth: minWidth,
        maxWidth: function () {
            return newChipElement.width() - 40;
        },
        comfortZone: 0
    });
};

var getInputValue = function(newChipElement) {
    return newChipElement.children('.input-style').val();
};

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
                var isOpened = false;
                var chipValue = attrs.val;
                if(chipValue && chipValue !== '') {
                    // open it
                    autoGrow(10, newChipElement);
                    newChipElement.children('.input-style').animate(
                        {
                            'border-top-right-radius': 0,
                            'border-bottom-right-radius': 0
                        },
                        100,
                        function () {
                            $(this).blur();
                            $(this).val(chipValue);
                            $(this).trigger('autogrow');
                        }
                    );
                    newChipElement.children('.new-tag-component').addClass('rotate');
                    isOpened = true;
                }

                autoGrow(10, newChipElement);

                newChipElement.children('.new-tag-component').click(function () {
                    if (isOpened) {
                        var chip = getInputValue(newChipElement);
                        // remove text
                        newChipElement.children('.input-style').val('');
                        // close it
                        autoGrow(0, newChipElement);
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
                        // send tag to remove
                        $rootScope.$broadcast('removeChip', chip);
                        scope.$apply();
                    } else {
                        // open it
                        autoGrow(10, newChipElement);
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

                        newChipElement.keypress(function (e) {
                            if (e.which == 13 && getInputValue(newChipElement) !== '') {
                                $rootScope.$broadcast('addNewChip', getInputValue(newChipElement));
                                scope.$apply();
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
