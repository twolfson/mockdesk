// Load in dependencies
var expect = require('chai').expect;
var appUtils = require('./utils/application');
var htmlUtils = require('./utils/html');
var Rectangle = require('../lib/js/widgets/rectangle');

// Start our tests
describe('A drag in the widget palette', function () {
  appUtils.init();
  htmlUtils.saveEl('[data-widget=Rectangle] > svg', {key: 'svgEl'});
  before(function dragRectangleWidget (done) {
    htmlUtils.dragEl(this.svgEl, {
      start: {x: this.svgElBounds.left + 5, y: this.svgElBounds.top + 5},
      end: {x: this.svgElBounds.left + 305, y: this.svgElBounds.top + 205}
    }, done);
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

describe('A drag on a scrolled workspace', function () {
  appUtils.init();
  htmlUtils.saveEl('[data-widget=Rectangle] > svg', {key: 'svgEl'});
  htmlUtils.saveEl('#workspace', {key: 'workspaceEl'});
  // Drag a rectangle to the outskirts of our workspace
  before(function dragRectangleWidget (done) {
    htmlUtils.dragEl(this.svgEl, {
      start: {x: this.svgElBounds.left + 5, y: this.svgElBounds.top + 5},
      end: {
        x: this.workspaceEl.right - this.svgElBounds.width + 5,
        y: this.workspaceEl.bottom - this.svgElBounds.height + 5
      }
    }, done);
  });
  appUtils.capturePage('widget-palette-drag-scrolled.png');

  it('positions an widget at our expected position', function (done) {
    this.timeout(600000);
    // DEV: We don't use `this.svgEl` since we could create a new widget on drop
    var _svgEl = this.container.querySelector('#workspace').childNodes[0];
    var svgStartBounds = this.svgElBounds;
    var svgEndBounds = _svgEl.getBoundingClientRect();
    // expect(svgEndBounds.left - svgStartBounds.left).to.equal(300);
    // expect(svgEndBounds.top - svgStartBounds.top).to.equal(200);
  });
});
