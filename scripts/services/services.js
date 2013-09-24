var services = angular.module('guthub.services',['ngResource']);

/**
 * Recipe service.
 *
 * Uses $resource, which is is a RESTful handle that encapsulates lower level $http service.
 *
 * Recipe can now be used an argument injected into our controllers. The following methods are built in:
 * Recipe.get();
 * Recipe.save();
 * Recipe.delete();
 * Recipe.remove();
 * Recipe.delete();
 *
 * Useage: if we pass in an object with an id field, then the value of that field will be
 * added to the end of the URL.
 * Calling Recipe.get({id:15}) will make a call to /recipes/15
 *
 * For example:
 * var recipe = new Recipe(existingRecipeObj);
 * recipe.$save(); - this calls a POST request
 */
services.factory('Recipe',['$resource', function($resource){
    return $resource('/recipes/:id',{id: '@id'});
}]);

/**
 * Load all recipes.
 */
services.factory('MultiRecipeLoader', ['Recipe', '$q', function(Recipe,$q){
    return function() {
        var delay = $q.defer();

        Recipe.query(function(recipesData) {
            delay.resolve(recipesData);
        }, function() {
            //delay.reject('Unable to fetch recipes');
            delay.resolve([{id:1, title:"cookies"}, {id:2, title:"farts"}]);
        });

        return delay.promise;
    };
}]);

/**
 * Load a single recipe.
 */
services.factory('RecipeLoader', ['Recipe','$route', '$q', function(Recipe, $route, $q){
    return function() {
        var delay = $q.defer();
        Recipe.get({id: $route.current.params.recipeId}, function(recipeData) {
            delay.resolve(recipeData);
        }, function() {
            //delay.reject('Unable to fetch recipe ' + $route.current.params.recipeId);
            delay.resolve({ id:1, title:"cookies", description: "Delicious, crisp on the outside, chewy" + " on the outside, oozing with chocolatey goodness " + "cookies. The best kind", ingredients: [ { amount: "1", amountUnits: "packet", ingredientName: "Chips Ahoy" } ], instructions: "1. Go buy a packet of Chips Ahoy\ n" + "2. Heat it up in an oven\ n" + "3. Enjoy warm cookies\ n" + "4. Learn how to bake cookies from somewhere else" });
        });

        return delay.promise;
    }
}]);