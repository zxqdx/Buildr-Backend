/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

bcrypt = require('bcrypt');
module.exports = {

  attributes: {
  	id: {
  		type: 'integer',
  		primaryKey: true,
  		unique: true,
  		autoIncrement: true,
  	},

  	email: {
  		type: 'string',
  		required: true,
  		unique: true
  	},

  	password: {
  		type: 'string',
  		required: true
  	},
    
    ingredients: {
      type: 'array'
    }
  },
  
  beforeCreate: function(values, cb) {
  	bcrypt.genSalt(10, function(err,salt) {
  		bcrypt.hash(values.password, salt, function(err, hash) {
  			if (err) return cb(err);
  			values.password = hash;
  			cb();
  		});
  	});
  }
};

