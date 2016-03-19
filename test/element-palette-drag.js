// Load in dependencies
var expect = require('chai').expect;
var simulant = require('simulant');
var appUtils = require('./utils/application');
var Rectangle = require('../lib/js/elements/rectangle');

// Start our tests
describe('A drag in the element palette', function () {
  appUtils.init();
  before(function dragRectangleElement (done) {
    // Find and drag the rectangle element in the palette
    // TODO: Get accurate starting points
    var rectEl = this.container.querySelector('[data-element=Rectangle] > svg');
    simulant.fire(rectEl, 'mousedown', {button: 0, clientX: 100, clientY: 100});
    setTimeout(function dragEl () {
      simulant.fire(rectEl, 'mousemove', {clientX: 110, clientY: 110});
    }, 20);
    setTimeout(function dragReleaseEl () {
      simulant.fire(rectEl, 'mouseup', {clientX: 120, clientY: 120});
      done();
    }, 40);
  });
  appUtils.capturePage('element-palette-drag.png');

  it('adds an element to the app', function () {
    expect(this.app.layers).to.have.length(1);
    var el = this.app.layers[0];
    expect(el).to.be.instanceof(Rectangle);
  });

  it.only('positions the element at our expected position', function () {
    var rectEl = this.container.querySelector('#workspace').childNodes[0];
    expect(rectEl.style.top).to.equal('100px');
    expect(rectEl.style.left).to.equal('100px');
  });
});
