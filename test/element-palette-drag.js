// Load in dependencies
var expect = require('chai').expect;
var simulant = require('simulant');
var appUtils = require('./utils/application');
var Rectangle = require('../lib/js/elements/rectangle');

// Start our tests
describe('A drag in the element palette', function () {
  // TODO: Consider abstracting element bounds resolving
  //  `appUtils.findEl('svgEl', '[data-element=Rectangle] > svg');` // Saves `this.svgEl`
  //  `appUtils.saveBounds('svgStartBounds', 'svgEl');` // Saves bounds for `this.svgEl` under `svgStartBounds`
  //  `appUtils.saveBoundsBySelector('svgStartBounds', '[data-element=Rectangle] > svg');`
  //     I don't like this so much, doesn't feel reusable. Maybe a function like:
  //  `appUtils.saveBoundsBySelector('svgStartBounds',
  //     function () { return document.querySelector('[data-element=Rectangle] > svg'); });`
  // TODO: Consider abstracting element clicking
  //  `appUtils.click('svgEl', {x: 100, y: 200})` clicks at said location
  //  `appUtils.click('svgEl', {x: 100, y: 200, offsetByBounds: 'svgStartBounds'})`
  //     This also feels magical, maybe we should stick to `before's` for these one-offs...
  /*

  */
  appUtils.init();
  before(function saveRectanglePosition () {
    this.svgEl = this.container.querySelector('[data-element=Rectangle] > svg');
    this.svgStartBounds = this.svgEl.getBoundingClientRect();
  });
  before(function dragRectangleElement (done) {
    // Start dragging our element
    var svgLeft = this.svgStartBounds.left;
    var svgTop = this.svgStartBounds.top;
    simulant.fire(this.svgEl, 'mousedown', {button: 0, clientX: svgLeft + 5, clientY: svgTop + 5});

    // Then drag and release our element
    setTimeout(function dragEl () {
      simulant.fire(this.svgEl, 'mousemove', {clientX: svgLeft + 305, clientY: svgTop + 205});
    }, 20);
    setTimeout(function dragReleaseEl () {
      simulant.fire(this.svgEl, 'mouseup', {clientX: svgLeft + 305, clientY: svgTop + 205});
      done();
    }, 40);
  });
  appUtils.capturePage('element-palette-drag.png');
  after(function cleanup () {
    delete this.svgEl;
    delete this.svgStartBounds;
  });

  it('adds an element to the app', function () {
    expect(this.app.layers).to.have.length(1);
    var el = this.app.layers[0];
    expect(el).to.be.instanceof(Rectangle);
  });

  it('positions an element at our expected position', function () {
    // DEV: We don't use `this.svgEl` since we could create a new rectangle on drop
    var svgEl = this.container.querySelector('#workspace').childNodes[0];
    var rectEndBounds = svgEl.getBoundingClientRect();
    expect(rectEndBounds.left - this.svgStartBounds.left).to.equal(300);
    expect(rectEndBounds.top - this.svgStartBounds.top).to.equal(200);
  });
});
