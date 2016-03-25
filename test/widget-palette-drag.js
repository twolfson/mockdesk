// Load in dependencies
var expect = require('chai').expect;
var simulant = require('simulant');
var appUtils = require('./utils/application');
var Rectangle = require('../lib/js/widgets/rectangle');

// Start our tests
describe('A drag in the widget palette', function () {
  /*
  before(function dragRectangleWidget () {
    var svgStartBounds = this.svgElBounds;
    appUtils.click(this.svgEl, {x: 100, y: 200, offsetByBounds: svgStartBounds});
  });
  */

  // TODO: For dragging...
  /*
  before(function dragRectangleWidget (done) {
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
  appUtils.saveEl('[data-widget=Rectangle] > svg', {key: 'svgEl'});
  before(function dragRectangleWidget (done) {
    // Start dragging our HTML element
    var svgLeft = this.svgElBounds.left;
    var svgTop = this.svgElBounds.top;
    var svgEl = this.svgEl;
    simulant.fire(svgEl, 'mousedown', {button: 0, clientX: svgLeft + 5, clientY: svgTop + 5});

    // Then drag and release our HTML element
    setTimeout(function dragMoveWidget () {
      simulant.fire(svgEl, 'mousemove', {clientX: svgLeft + 305, clientY: svgTop + 205});
    }, 20);
    setTimeout(function dragEndWidget () {
      simulant.fire(svgEl, 'mouseup', {clientX: svgLeft + 305, clientY: svgTop + 205});
      done();
    }, 40);
  });
  appUtils.capturePage('widget-palette-drag.png');

  it('adds an widget to the app', function () {
    expect(this.app.layers).to.have.length(1);
    var widget = this.app.layers[0];
    expect(widget).to.be.instanceof(Rectangle);
  });

  it('positions an widget at our expected position', function () {
    // DEV: We don't use `this.svgEl` since we could create a new widget on drop
    var _svgEl = this.container.querySelector('#workspace').childNodes[0];
    var svgStartBounds = this.svgElBounds;
    var svgEndBounds = _svgEl.getBoundingClientRect();
    expect(svgEndBounds.left - svgStartBounds.left).to.equal(300);
    expect(svgEndBounds.top - svgStartBounds.top).to.equal(200);
  });
});
