// Load in dependencies
var expect = require('chai').expect;
var simulant = require('simulant');
var appUtils = require('./utils/application');
var Rectangle = require('../lib/js/elements/rectangle');

// Start our tests
describe('A drag in the element palette', function () {
  appUtils.init();
  before(function saveRectanglePosition () {
    var svg = this.container.querySelector('[data-element=Rectangle] > svg');
    this.svgStartBounds = svg.getBoundingClientRect();
  });
  before(function dragRectangleElement (done) {
    // Find and drag the rectangle element in the palette
    // TODO: Get accurate starting points
    var svgEl = this.container.querySelector('[data-element=Rectangle] > svg');
    var svgLeft = this.svgStartBounds.left;
    var svgTop = this.svgStartBounds.top;
    simulant.fire(svgEl, 'mousedown', {button: 0, clientX: svgLeft + 5, clientY: svgTop + 5});
    setTimeout(function dragEl () {
      simulant.fire(svgEl, 'mousemove', {clientX: svgLeft + 305, clientY: svgTop + 205});
    }, 20);
    setTimeout(function dragReleaseEl () {
      simulant.fire(svgEl, 'mouseup', {clientX: svgLeft + 305, clientY: svgTop + 205});
      done();
    }, 40);
  });
  appUtils.capturePage('element-palette-drag.png');
  after(function cleanup () {
    delete this.svgStartBounds;
  });

  it('adds an element to the app', function () {
    expect(this.app.layers).to.have.length(1);
    var el = this.app.layers[0];
    expect(el).to.be.instanceof(Rectangle);
  });

  it.only('positions the element at our expected position', function () {
    var svg = this.container.querySelector('#workspace').childNodes[0];
    var rectEndBounds = svg.getBoundingClientRect();
    console.log(this.svgStartBounds.top, this.svgStartBounds.left);
    console.log(rectEndBounds.top, rectEndBounds.left);
    expect(rectEndBounds.left - this.svgStartBounds.left).to.equal(300);
    expect(rectEndBounds.top - this.svgStartBounds.top).to.equal(200);
  });
});
