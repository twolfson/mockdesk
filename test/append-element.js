// Load in dependencies
var expect = require('chai').expect;
var Application = require('../');
var Rectangle = require('../lib/elements/rectangle');

// Start our tests
describe('An application appending an element', function () {
  // TODO: Make this a utility
  before(function createApplication () {
    this.app = new Application();
  });
  before(function appendElement () {
    this.el = new Rectangle({x: 0, y: 0, w: 10, h: 10});
    this.app.appendElement(this.el);
  });
  after(function cleanup () {
    delete this.app;
  });
  after(function cleanup () {
    delete this.el;
  });

  it('adds the element to the last layer', function () {
    expect(this.app.layers).to.have.length(1);
    expect(this.app.layers[0]).to.equal(this.el);
  });
});
