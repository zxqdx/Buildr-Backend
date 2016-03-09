/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  console.log("HIT");

  var uuid = require('uuid');

  sails.globals = sails.globals || {};

  sails.globals.cookieStore = {};

  sails.globals.generateCookie = function() {
    return uuid.v1();
  };

  var findPrimaryKeyOrCreate = function(Table, primaryKey, record, callback) {
    console.log(primaryKey, record[primaryKey]);
    var findObj = {};
    findObj[primaryKey] = record[primaryKey];
    Table.findOrCreate(findObj, record, function(err, created) {
      if (err) {
        return console.error(err);
      }
      callback(null, created);
    });
  };

  var taskList = [];
  var ingredientList = [{
    "ingredient": "whole milk",
    "serving": 1,
    "calorie": 144,
    "popularity": 0,
    "unit": "cup"
  }, {
    "ingredient": "chicken",
    "serving": 1,
    "calorie": 35,
    "popularity": 0,
    "unit": "ounces"
  }, {
    "ingredient": "orange",
    "serving": 1,
    "calorie": 62,
    "popularity": 0,
    "unit": "each"
  }, {
    "ingredient": "red tomato",
    "serving": 1,
    "calorie": 16,
    "popularity": 0,
    "unit": "each"
  }];
  for (var i = 0; i < ingredientList.length; i++) {
    taskList.push(function(eachIngredient) {
      return function(callback) {
        findPrimaryKeyOrCreate(Ingredient, "ingredient", eachIngredient, callback);
      };
    }(ingredientList[i]));
  }

  var recipeList = [{
    "recipe": "Maple Glazed Ribs",
    "ingredients": [
      ["pork spareribs", 48],
      ["pure maple syrup", 1],
      ["frozen orange juice concentrate", 3],
      ["ketchup", 3],
      ["soy sauce", 2],
      ["Dijon mustard", 1],
      ["Worcestershire sauce", 1],
      ["curry powder", 1],
      ["garlic, minced", 1],
      ["green onions, minced", 2],
      ["seasame seeds", 1]
    ],
    "ingredientUnit": ["ounces", "cup", "tbsp", "tbsp", "tbsp", "tbsp", "tbsp", "tsp", "clove", "each", "tbsp"],
    "nutrition": [
      ["Calories", 806],
      ["Fat", 54],
      ["Carbs", 43.1],
      ["Protein", 36.2],
      ["Cholesterol", 181],
      ["Sodium", 664]
    ],
    "nutritionUnit": ["kcal", "g", "g", "g", "mg", "mg"],
    "prepTime": 20,
    // "prepTimeUnit": "minutes",
    "cookTime": 2,
    // "cookTimeUnit": "hours",
    "basisCalorieDiet": 2000,
    "step": ["Preheat oven to 350 degrees F (175 degrees C)", "Place ribs meat side up on a rack in a 9x13 inch roasting pan. Cover pan tightly with foil.", "Bake for 1 1/4 hours", "In a saucepan over medium heat, combine maple syrup, orange juice concentrate, ketchup, soy sauce and Worcestershire sauce", "Stir in curry powder, garlic and green onions. Simmer for 15 minutes, stirring occasionally", "Remove ribs from roasting pan, remove rack, and drain excess fat and drippings.", "Return ribs to pan, cover with sauce, and bake uncovered for 35 minutes, basting occasionally.", "Sprinkle with seasame seeds just before serving"]
  }];
  for (var i = 0; i < recipeList.length; i++) {
    taskList.push(function(eachRecipe) {
      return function(callback) {
        findPrimaryKeyOrCreate(Recipe, "recipe", eachRecipe, callback);
      };
    }(recipeList[i]));
  }

  var userList = [{
    email: "kongw@rose-hulman.edu",
    password: "1234"
  }];
  for (var i = 0; i < userList.length; i++) {
    taskList.push(function(eachUser) {
      return function(callback) {
        findPrimaryKeyOrCreate(User, 'email', eachUser, callback);
      };
    }(userList[i]));
  };

  async.series(taskList, function() {
    cb();
  });
};