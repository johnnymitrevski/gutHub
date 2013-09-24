//Setup the GutHub angular module
var app = angular.module('guthub', ['guthub.directives', 'guthub.services']);

//Update the baseUrl to match the directory the app is deployed on the web server. Leave blank if '/'.
var baseUrl = "";

/**
 * Specify the various routes we have in our application. For each route we specify:
 * 1) The controller that backs it up.
 * 2) The template to load.
 * 3) The resolve object (Optional). This tells angular JS that each of the resolve keys need to be meet
 * before the route can be displayed to  the user. For us, we want to load all the recipe data before we
 * display the page. If the resolve function returns a $q (promise) then AngularJs is smart enough to wait
 * for the promise to get resolved before it proceeds. That means wait till the server responds.
 */
app.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/', {
        controller: 'ListCtrl',

        resolve: {
            recipes: function(MultiRecipeLoader) {
                return MultiRecipeLoader();
            }
        },
        templateUrl: baseUrl + '/views/list.html'
    }).when('/edit/:recipeId', {
            controller: 'EditCtrl',
            resolve: {
                recipe: function(RecipeLoader) {
                    return RecipeLoader();
                }
            },
            templateUrl: baseUrl + '/views/recipeForm.html'
        }).when('/view/:recipeId', {
            controller: 'ViewCtrl',
            resolve: {
                recipe: function(RecipeLoader) {
                    return RecipeLoader();
                }
            },
            templateUrl: baseUrl + '/views/viewRecipe.html'
        }).when('/new', {
            controller: 'NewCtrl',
            templateUrl:baseUrl + '/views/recipeForm.html'
        }).otherwise({redirectTo: '/'});
}]);

/**
 * List the recipes
 */
app.controller('ListCtrl',['$scope','recipes',function($scope, recipes) {
    $scope.recipes = recipes;
}]);

/**
 * View a recipe
 */
app.controller('ViewCtrl', ['$scope','$location','recipe', function($scope, $location, recipe) {
    $scope.recipe = recipe;

    $scope.edit = function() {
        $location.path('/edit/' + recipe.id);
    };
}]);

/**
 * Exposes save() and remove() functions to scope.
 *
 * save() will save the current recipe and then redirect to the view screen
 * of the same recipe.
 *
 * remove() removes the recipe from the scope and redirects the uses to the
 * main landing page.
 */
app.controller('EditCtrl', ['$scope','$location','recipe', function($scope, $location, recipe) {

    $scope.recipe = recipe;

    $scope.save = function() {
        $scope.recipe.$save(function(recipe){
            $location.path(baseUrl + '/view/' + recipe.id);
        });
    };

    $scope.remove = function() {
        delete $scope.recipe;   //Doesn't remove it from the server. Only from $scope.

        $location.path(baseUrl + '/');
    };
}]);

/**
 * Create a new recipe.
 */
app.controller('NewCtrl',['$scope', '$location', 'Recipe', function($scope, $location, Recipe){
    $scope.recipe = new Recipe({
        ingredients: [{}]
    });

    $scope.save = function() {
        $scope.recipe.$save(function(recipe) {
            $location.path(baseUrl + '/view/' + recipe.id);
        });
    };
}]);

/**
 * Edit the ingredients. It inherits $scope from the parent controller.
 */
app.controller('IngredientsCtrl', ['$scope', function($scope) {

    $scope.addIngredient = function() {
        var ingredients = $scope.recipe.ingredients;
        ingredients[ingredients.length] = {};
    };

    $scope.removeIngredient = function(index) {
        $scope.recipe.ingredients.splice(index, 1);
    };
}]);

