
function newChip($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'template/newChip.html',
        scope: {
            ngModel: '='
        },
        link: function (scope, elem, attrs) {
            //var str = this.ngModel;
            //if(str === '') {} else {}
            var isOpened = false;
            $(function () {
                $('#demo-input').autoGrowInput({
                    minWidth: 10,
                    maxWidth: function () {
                        return $('#demo-input-container').width() - 40;
                    },
                    comfortZone: 0
                });
            });
            $('#demo-input-container').click(function () {
                if (isOpened) {
                    // send tag to remove
                    $rootScope.$broadcast('removeChip', $('#demo-input').val());
                    // remove text
                    $('#demo-input').val('');
                    // close it
                    $('#demo-input').autoGrowInput({
                        minWidth: 0,
                        maxWidth: function () {
                            return $('#demo-input-container').width() - 40;
                        },
                        comfortZone: 0
                    });
                    $('#demo-input').animate(
                        {
                            'border-top-right-radius': '30px',
                            'border-bottom-right-radius': '30px'
                        },
                        100
                    );
                    $('#new-tag-component').removeClass('rotate');
                    $('#new-tag-component').addClass('unrotate');
                    isOpened = !isOpened;
                } else {
                    // open it
                    $('#demo-input').autoGrowInput({
                        minWidth: 10,
                        maxWidth: function () {
                            return $('#demo-input-container').width() - 40;
                        },
                        comfortZone: 0
                    });
                    $('#demo-input').animate(
                        {
                            'border-top-right-radius': 0,
                            'border-bottom-right-radius': 0
                        },
                        100,
                        function () {
                            $(this).focus();
                        }
                    );
                    $('#new-tag-component').removeClass('unrotate');
                    $('#new-tag-component').addClass('rotate');
                    isOpened = !isOpened;
                }
            });
            $(window).resize(function () {
                $('#demo-input').trigger('autogrow');
            });

            $(document).keypress(function (e) {
                if (e.which == 13) {
                    $rootScope.$broadcast('addNewChip', $('#demo-input').val());
                    //$('body').append('<div id="demo-input-container"><input id="demo-input" autofocus type="text" name="q" class="input-style"><span id="new-tag-component" class="new-tag-component"><span id="vertical" class="vertical"></span><span id="horizontal" class="horizontal"></span></span></div>');
                }
            });
        }
    };
}

angular.module('datapizz.directives')
    .directive('newChip', newChip);
