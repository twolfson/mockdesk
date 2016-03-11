// Load in dependencies
var expect = require('chai').expect;
var appUtils = require('./utils/application');
var Rectangle = require('../lib/js/elements/rectangle');

// Start our tests
describe('An application appending an element', function () {
  appUtils.init();
  before(function appendElement () {
    this.el = new Rectangle({x: 0, y: 0, width: 10, height: 10});
    this.app.appendElement(this.el);
  });
  after(function cleanup () {
    delete this.el;
  });

  it('adds the element to the last layer', function () {
    expect(this.app.layers).to.have.length(1);
    expect(this.app.layers[0]).to.equal(this.el);
  });
});
