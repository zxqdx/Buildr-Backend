/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

is = require('is_js');
bcrypt = require('bcrypt');

module.exports = {
	create: function(req, res) {
		var isValidPassword = true;
		var isValidEmail = true;
		if (!req.body.email || !is.email(req.body.email)) {
			console.log("Not an email: " + req.body.email);
			isValidEmail = false;
		};
		if (!req.body.password) {
			isValidPassword = false;
		};
		if (!isValidEmail) {
			return res.json({
				success: false,
				content: "The email is invalid!"
			});
		}
		if (!isValidPassword) {
			return res.json({
				success: false,
				content: "Missing password inputs."
			});
		}
		var email = req.body.email;
		var password = req.body.password;
		User.create({
			email: email,
			password: password
		}, function(err, user) {
			if (err) {
				return res.json({
					success: false,
					content: "Unable to create user"
				});
			}
			var cookie = sails.globals.generateCookie();
			res.cookie('cookie', cookie);
			res.cookie('email', email);
			sails.globals.cookieStore[cookie] = user.id;
			return res.json({
				success: true,
				id: user.id
			});
		});
	},

	login: function(req, res) {
		var isValidEmail = true;
		var isValidPassword = true;
		if (!req.body.email || !is.email(req.body.email)) {
			console.log("Not an email: " + req.body.email);
			isValidEmail = false;
		};
		if (!req.body.password) {
			isValidPassword = false;
		};

		if (!isValidEmail) {
			return res.json({
				success: false,
				content: "The email is invalid!"
			});
		}
		if (!isValidPassword) {
			return res.json({
				success: false,
				content: "Missing password inputs"
			});
		}

		User.find({
			email: req.body.email
		}).exec(function findCB(err, found) {
			if (err) {
				return res.json({
					success: false,
					content: "Unable to login user"
				});
			}
			if (found.length) {
				bcrypt.compare(req.body.password, found[0].password, function(err, rslt) {
					if (rslt) {
						// session may be used here
						var cookie = sails.globals.generateCookie();
						res.cookie('cookie', cookie);
						res.cookie('email', found[0].email);
						sails.globals.cookieStore[cookie] = found[0].id;
						return res.json({
							success: true,
							content: 'Logged In!'
						});
					} else {
						return res.json({
							success: false,
							content: "incorrect password"
						});
					}
				});
			} else {
				return res.json({
					success: false,
					content: "no such user!"
				});
			}
		});
	},

	setIngredients: function(req, res) {
		if (!req.body.ingredients) {
			return res.json({
				success: false,
				content: "Please specify ingredients"
			});
		}
		var email = req.cookies['email'];
		User.find({
			email: email
		}).exec(function(err, found) {
			if (err || found.length == 0) {
				return res.json({
					success: false,
					content: "Internal error."
				});
			}
			var user = found[0];
			var ingredients = JSON.parse(req.body.ingredients);
			sails.log(ingredients);
			User.update({
				email: email
			}, {
				ingredients: ingredients
			}).exec(function(err, updated) {
				if (err) {
					return res.json({
						success: false,
						content: "Internal error. Updated failed."
					});
				}
				return res.json({
					success: true,
					content: ingredients
				});
			});
		});
	},

	getIngredients: function(req, res) {
		var email = req.cookies['email'];
		User.find({
			email: email
		}).exec(function(err, found) {
			if (err || found.length == 0) {
				return res.json({
					success: false,
					content: "Internal error."
				});
			}
			var user = found[0];
			var ingredients = user.ingredients ? user.ingredients : [];
			return res.json({
				success: true,
				content: ingredients
			});
		});
	},

	search: function(req, res) {
		var lowerCaseMap = function(listOfStrings) {
			if (!Array.isArray(listOfStrings)) {
				sails.log("NOT A LIST!");
				return;
			};
			var res = [];
			listOfStrings.forEach(function(eachStr) {
				res.push(eachStr.toLowerCase());
			});
			return res;
		}

		if (!req.body.ingredients) {
			return res.json({
				success: false,
				content: "Please specify ingredients to search"
			});
		}
		var email = req.cookies['email'];
		User.find({
			email: email
		}).exec(function(err, found) {
			if (err || found.length == 0) {
				return res.json({
					success: false,
					content: "Internal error."
				});
			}
			var user = found[0];
			var ingredients = lowerCaseMap(JSON.parse(req.body.ingredients));
			Recipe.find({

			}).exec(function(err, found) {
				if (err || found.length == 0) {
					return res.json({
						success: false,
						content: "Internal error."
					});
				}

				var vaildrecip = [];

				found.forEach(function(eachRecipe){
					var rawRecipes = [];
					eachRecipe.ingredients.forEach(function(eachIng){
						rawRecipes.push(eachIng[0].toLowerCase());
					});
					var intersect = _.intersection(rawRecipes, ingredients);
					if (_.isEqual(intersect, ingredients)){
						vaildrecip.push(eachRecipe);
					}
				});

				if (vaildrecip.length > 0){
					return res.json({
						success: true,
						content: vaildrecip
					});
				}
				else{
					return res.json({
						success: false,
						content: "No match!"
					});
				}
			}); 
		});
	}
};