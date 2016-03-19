// Load in dependencies
var expect = require('chai').expect;
var simulant = require('simulant');
var appUtils = require('./utils/application');
var Rectangle = require('../lib/js/elements/rectangle');

// Start our tests
describe('A drag in the element palette', function () {
  appUtils.init();
  before(function saveRectanglePosition () {
    var rectEl = this.container.querySelector('[data-element=Rectangle]');
    this.rectStartBounds = rectEl.getBoundingClientRect();
  });
  before(function dragRectangleElement (done) {
    // Find and drag the rectangle element in the palette
    // TODO: Get accurate starting points
    var svgEl = this.container.querySelector('[data-element=Rectangle] > svg');
    simulant.fire(svgEl, 'mousedown', {button: 0, clientX: 100, clientY: 100});
    setTimeout(function dragEl () {
      simulant.fire(svgEl, 'mousemove', {clientX: 110, clientY: 115});
    }, 20);
    setTimeout(function dragReleaseEl () {
      simulant.fire(svgEl, 'mouseup', {clientX: 120, clientY: 130});
      done();
    }, 40);
  });
  appUtils.capturePage('element-palette-drag.png');
  after(function cleanup () {
    delete this.rectStartBounds;
  });

  it('adds an element to the app', function () {
    expect(this.app.layers).to.have.length(1);
    var el = this.app.layers[0];
    expect(el).to.be.instanceof(Rectangle);
  });

  it.only('positions the element at our expected position', function () {
    var rectEl = this.container.querySelector('#workspace').childNodes[0];
    var rectEndBounds = rectEl.getBoundingClientRect();
    console.log(this.rectStartBounds);
    console.log(rectEndBounds);
    expect(rectEndBounds.left - this.rectStartBounds.left).to.equal(20);
    expect(rectEndBounds.top - this.rectStartBounds.top).to.equal(30);
  });
});
