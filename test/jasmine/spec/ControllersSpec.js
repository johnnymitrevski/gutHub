describe('Controllers', function() {
    var $scope, ctrl;

    beforeEach(module('guthub'));

    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected){
                return angular.equals((this.actual, expected));
            }
        });
    });

    describe('ListCtrl', function(){
        var mockBackend, recipe;

        beforeEach(inject(function($rootScope,$controller,$httpBackend,Recipe){
            recipe = Recipe;
            mockBackend = $httpBackend;
            $scope = $rootScope.$new();
            ctrl = $controller('ListCtrl',{$scope: $scope, recipes:[1,2,3]});
        }));

        it('should have a list of recipes', function() {
            expect($scope.recipes).toEqual([1,2,3]);
        });
    });

    describe('MultiRecipeLoader', function(){
        var mockBackend, recipe, loader;

        beforeEach(inject(function($httpBackend, Recipe, MultiRecipeLoader) {
            recipe = Recipe;
            mockBackend = $httpBackend;
            loader = MultiRecipeLoader;
        }));

        it('should load a list of recipes', function(){
            mockBackend.expectGET('/recipes').respond([{id:1},{id:2}]);

            var recipes;

            var promise = loader();

            promise.then(function(rec) {
                recipes = rec;
            });

            expect(recipes).toBeUndefined();

            mockBackend.flush();

            expect(angular.equals(recipes,([{id:1},{id:2}])));
        });
    });

    describe('EditController', function() {
        var mockBackend, location;

        beforeEach(inject(function($rootScope, $controller, $httpBackend, $location, Recipe){
            mockBackend = $httpBackend;
            location = $location;

            $scope = $rootScope.$new();

            ctrl = $controller('EditCtrl', {
                $scope: $scope,
                $location: $location,
                recipe: new Recipe({id:1, title:'Recipe'})
            });
        }));

        it('should save the recipe', function(){
            mockBackend.expectPOST('/recipes/1', {id:1, title:'Recipe'}).respond({id:2});

            //Set it to something else to ensure it is changed during the test
            location.path('oldtest');

            $scope.save();

            expect(angular.equals(location.path(),'/view/2'));
        });

        it('should remove the recipe', function() {
            expect($scope.recipe).toBeTruthy();

            location.path('test');

            $scope.remove();

            expect($scope.recipe).toBeUndefined();

            expect(location.path()).toEqual('/');
        })
    });
});