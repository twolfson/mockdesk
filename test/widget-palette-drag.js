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
  appUtils.findEl('svgEl', '[data-element=Rectangle] > svg');`
  appUtils.saveBounds('svgStartBounds', 'svgEl');
  before(function dragRectangleElement () {
    // Dislike how both `click` and `findEl` look like they share the same syntax
    appUtils.click(this.svgEl, {x: 100, y: 200, offsetByBounds: this.svgStartBounds});
  });
  */
  // Maybe we define a `.memo()` syntax for saving to this? to make it more obvious
  /*
  appUtils.memo('svgEl').saveEl('[data-element=Rectangle] > svg');`
  // This string is still annoying
  appUtils.memo(''svgStartBounds').saveBounds(appUtils.memo('svgEl'));
  */
  // Save element and its bounds
  // appUtils.saveEl('[data-element=Rectangle] > svg');`
  //   Save `this.el` and `this.elBounds`
  // appUtils.saveEl('[data-element=Rectangle] > svg', {key: 'svgEl'});`
  //   Save `this.svgEl` and `this.svgElBounds`
  /*
  before(function dragRectangleElement () {
    var svgStartBounds = this.svgElBounds;
    appUtils.click(this.svgEl, {x: 100, y: 200, offsetByBounds: svgStartBounds});
  });
  */

  // TODO: For dragging...
  /*
  before(function dragRectangleElement (done) {
    var svgStartBounds = this.svgElBounds;
    appUtils.drag(this.svgEl, {
      start: {x: 5, y: 5},
      end: {x: 205, 205}
      offsetByBounds: svgStartBounds,
      delay: 40 // ms
    }, done);
  });
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
    var svgEl = this.svgEl;
    simulant.fire(svgEl, 'mousedown', {button: 0, clientX: svgLeft + 5, clientY: svgTop + 5});

    // Then drag and release our element
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
    delete this.svgEl;
    delete this.svgStartBounds;
  });

  it('adds an element to the app', function () {
    expect(this.app.layers).to.have.length(1);
    var component = this.app.layers[0];
    expect(component).to.be.instanceof(Rectangle);
  });

  it('positions an element at our expected position', function () {
    // DEV: We don't use `this.svgEl` since we could create a new rectangle on drop
    var svgEl = this.container.querySelector('#workspace').childNodes[0];
    var rectEndBounds = svgEl.getBoundingClientRect();
    expect(rectEndBounds.left - this.svgStartBounds.left).to.equal(300);
    expect(rectEndBounds.top - this.svgStartBounds.top).to.equal(200);
  });
});
