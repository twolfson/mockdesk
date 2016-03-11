// Load in dependencies
var expect = require('chai').expect;
var appUtils = require('./utils/application');

// Start our tests
describe('An application', function () {
  appUtils.init();

  it('has layers', function () {
    expect(this.app).to.have.property('layers');
    expect(this.app.layers).to.deep.equal([]);
  });
});
