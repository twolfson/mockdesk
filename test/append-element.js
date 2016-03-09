// Load in dependencies
var expect = require('chai').expect;
var Application = require('../lib/js/application');
var Rectangle = require('../lib/js/elements/rectangle');

// Start our tests
describe('An application appending an element', function () {
  // TODO: Make this a utility
  before(function createApplication () {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.app = new Application(this.container);
  });
  before(function appendElement () {
    // TODO: Add an actual HTML element and update `appendElement` to inject said element into the DOM
    this.el = new Rectangle({x: 0, y: 0, width: 10, height: 10});
    this.app.appendElement(this.el);
  });
  after(function cleanup () {
    document.body.removeChild(this.container);
    delete this.container;
    // TODO: Define a teardown method for `this.app` so it can cleanup bindings
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
