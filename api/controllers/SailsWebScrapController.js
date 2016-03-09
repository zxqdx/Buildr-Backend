/**
 * Sails-web-scrapController
 *
 * @description :: Server-side logic for managing sails-web-scraps
 * @help		:: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
// express = require('express');
request = require('request');
cheerio = require('cheerio');

module.exports = {
    scrap: function(req, res) {
        var ingredient = req.body.ingredient;
        var baseURL = "http://www.calorieking.com/foods/search.php?keywords=";
        ingredient = ingredient.replace(/ /g, "+");
        var primaryURL = baseURL.concat(ingredient);
        var weburl;
        Ingredient.find({
            ingredient: req.body.ingredient
        }).exec(function(err, found) {
            if (err){
                return res.json({success: false, content: "Error occured."});
            }
            if (found.length == 0) {
                request(primaryURL, function(error, response, html) {
                    if (!error) {
                        var $ = cheerio.load(html);
                        var urls = [];
                        var tempurl = "";
                        $('.food-search-result.left-vertical-border-green').first().filter(function() {
                            var data = $(this);
                            data.find('a').each(function(i, link) {
                                var href = $(link).attr('href');
                                urls.push(href);
                            });
                            weburl = urls[0];
                            request(weburl, function(error, response, html) {
                                if (!error) {
                                    var $ = cheerio.load(html);

                                    var title, calorie, serving, unit;
                                    var json = {
                                        title: "",
                                        calorie: 0,
                                        serving: "",
                                        unit: ""
                                    };
                                    async.waterfall([
                                        function(callback){
                                            callback(null, json);
                                        },
                                        function(result, callback) {
                                            $('#heading-food-cat-desc').filter(function() {
                                                var data = $(this);
                                                title = data.text();
                                                title = title.replace(/\n/g, "");
                                                title = title.replace(/\t/g, "");

                                                json.title = title.trim();
                                                callback(null, json);
                                            })
                                        },
                                        function(result, callback) {
                                            $('#mCalorie .calorie-display').filter(function() {
                                                var data = $(this);
                                                calorie = data.text();

                                                json.calorie = parseFloat(calorie);
                                                callback(null, json);
                                            })
                                        },

                                        function(result, callback) {
                                            $('#amount').filter(function() {
                                                var data = $(this);
                                                var value = data.attr("value");

                                                json.serving = parseFloat(value);
                                                callback(null, json);
                                            })
                                        },
                                        function(result, callback) {
                                            $('#units option:selected').filter(function() {
                                                var data = $(this);
                                                var units = data.text();

                                                json.unit = units;
                                                callback(null, json);
                                            })
                                        }
                                    ], function(err, result) {
                                        if (err) return res.json({
                                            success: false,
                                            content: "error happened"
                                        });
                                        Ingredient.create({
                                            ingredient: req.body.ingredient,
                                            serving: json.serving,
                                            calorie: json.calorie,
                                            popularity: 1,
                                            unit: json.unit
                                        }, function(err, user) {
                                            if (err) {
                                                return res.json({
                                                    success: false,
                                                    content: "Unable to create ingredient"
                                                });
                                            }
                                            return res.json({
                                                success: true,
                                                content: json
                                            });
                                        });
                                    });
                                } else {
                                    return res.json({
                                        success: false,
                                        content: "ingredient not found."
                                    });
                                }
                            });
                        });
                    } else {
                        return res.json({
                            success: false,
                            content: "unknown ingredient."
                        });
                    }
                });
            }
            if (found.length > 0) {
                return res.json({
                    success: true,
                    content: found
                });
            }
        });
    }
};