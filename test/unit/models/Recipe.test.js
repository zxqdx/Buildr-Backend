var assert = require('assert');
describe('RecipeModel', function() {
  describe('Data Stub', function() {
    it('should have created the data stub', function (done) {
      Recipe.find()
        .then(function(results) {
          // some tests
          assert.notEqual(results, 0);
          done();
        })
        .catch(done);
    });
  });
});