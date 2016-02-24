// Load in dependencies
var expect = require('chai').expect;
var Application = require('../');

// Start our tests
describe('An application', function () {
  it('has layers', function () {
    var app = new Application();
    expect(app.layers).to.deep.equal([]);
  });
});
