var directives = angular.module('guthub.directives',[]);

directives.directive('butterbar',['$rootScope', function($rootScope){
    return {
        link: function(scope, element, attrs) {

            element.addClass('hide'); //Hide the element upfront

            //Watch the $routeChangeStart and remove the hide css, therefore show
            $rootScope.$on('$routeChangeStart', function() {
                element.removeClass('hide');
            });

            //Watch the $routeChangeSuccess and remove add the hide css, therefore hide
            $rootScope.$on('$routeChangeSuccess', function() {
                element.addClass('hide');
            });
        }
    };
}]);

/**
 * Calls the focus() method on the current element.
 *
 * Call it by adding the focus attribute on any input element.
 * i.e. <input type="text" focus></input>
 * Therefore when the page loads, that element immediately gets the focus.
 */
directives.directive('focus', function() {
    return {
        link: function(scope, element, attrs) {
            element[0].focus();
        }
    };
});