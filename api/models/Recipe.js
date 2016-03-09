/**
* Recipe.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    recipe: {
      type: 'string',
      primaryKey: true,
      required: true
    },
  
    ingredients: {
      type: 'array'
    },
  
    ingredientUnit: {
      type: 'array' // array of string
    },
  
    nutrition: {
      type: 'array' // same type as ingredients
    },

    nutritionUnit: {
      type: 'array'
    },
 
    prepTime: {
      type: 'integer'
    },
 
    prepTimeUnit: {
      type: 'string',
      enum: ["seconds", "hours", "minutes"]
    },
 
    cookTime: {
      type: 'integer'
    },
 
    cookTimeUnit: {
      type: 'string',
      enum: ["seconds", "hours", "minutes"]
    },
 
    basisCalorieDiet: {
      type: 'integer'
    },
 
    step: {
      type: 'array' // array of strings
    }
  }
};

