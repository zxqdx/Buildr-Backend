var assert = require('assert');
describe('User Controller', function() {
  describe('Get ingredients', function() {
    it('is able to get ingredients', function (done) {
      var mockReq = {
        cookies: {
          email: 'kongw@rose-hulman.edu'
        }
      };
      var mockRes = {
        json: require('a').mock()
      };
      mockRes.json.ignore().whenCalled(function(args) {
        assert.equal(args.success, true);
        assert.notEqual(args.content, null);
        assert.notEqual(args.content, undefined);
        done();
      });
      sails.controllers.user.getIngredients(mockReq, mockRes);
    });

    it('prompts failure if user does not exist', function (done) {
      var mockReq = {
        cookies: {
          email: 'dne'
        }
      };
      var mockRes = {
        json: require('a').mock()
      };
      mockRes.json.ignore().whenCalled(function(args) {
        assert.equal(args.success, false);
        assert.equal(args.content, 'Internal error.');
        done();
      });
      sails.controllers.user.getIngredients(mockReq, mockRes);
    });
  });
  describe('Set ingredients', function() {
    it('sets correct ingredient and returns', function (done) {
      var mockIngredients = ["egg", "rice"];
      var mockReq = {
        cookies: {
          email: 'kongw@rose-hulman.edu'
        },
        body: {
          ingredients: JSON.stringify(mockIngredients)
        }
      };
      var mockRes = {
        json: require('a').mock()
      };
      mockRes.json.ignore().whenCalled(function(args) {
        assert.equal(args.success, true);
        assert.notEqual(args.content, mockIngredients);
        done();
      });
      sails.controllers.user.setIngredients(mockReq, mockRes);
    });
    it('prompts failure if ingredients are not specified', function (done) {
      var mockReq = {
        cookies: {
          email: 'kongw@rose-hulman.edu'
        },
        body: {}
      };
      var mockRes = {
        json: require('a').mock()
      };
      mockRes.json.ignore().whenCalled(function(args) {
        assert.equal(args.success, false);
        assert.equal(args.content, "Please specify ingredients");
        done();
      });
      sails.controllers.user.setIngredients(mockReq, mockRes);
    });
  });
});