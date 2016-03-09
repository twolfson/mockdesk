// Load in dependencies
var expect = require('chai').expect;
var Application = require('../lib/js/application');

// Start our tests
describe('An application', function () {
  it('has layers', function () {
    // Create our app
    var container = document.createElement('div');
    document.body.appendChild(container);
    var app = new Application(container);

    // Assert our app
    expect(app).to.have.property('layers');
    expect(app.layers).to.deep.equal([]);

    // Teardown app/container
    document.body.removeChild(container);
  });
});
