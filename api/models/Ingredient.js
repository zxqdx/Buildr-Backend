/**
* Ingredient.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    ingredient: {
      type: 'string',
      primaryKey: true,
      required: true
    },
  
    serving: {
      type: 'float',
    },
  
    calorie: {
      type: 'float',
    },
  
    popularity: {
      type: 'integer',
    },

    unit: {
      type: 'string',
    }
  }
};

