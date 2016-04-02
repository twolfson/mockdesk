// Load in dependencies
var _ = require('underscore');
var expect = require('chai').expect;
var appUtils = require('./utils/application');
var htmlUtils = require('./utils/html');
var Rectangle = require('../lib/js/widgets/rectangle');

// Start our tests
// TODO: Take screenshot mid-drag to verify we have dashed placeholder
//   and its name/label
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
  before(function dragRectangleWidget (done) {
    // Save scroll info so we can verify we moved to the workspace edge
    this.startScrollBounds = {
      width: this.workspaceEl.scrollWidth,
      height: this.workspaceEl.scrollHeight
    };
    expect(this.startScrollBounds.width).to.not.equal(0);
    expect(this.startScrollBounds.height).to.not.equal(0);

    // Drag a rectangle to the outskirts of our workspace
    htmlUtils.dragEl(this.svgEl, {
      start: {x: this.svgElBounds.left + 5, y: this.svgElBounds.top + 5},
      end: {
        x: this.workspaceElBounds.right - this.svgElBounds.width + 5,
        y: this.workspaceElBounds.bottom - this.svgElBounds.height + 5
      }
    }, done);
  });
  before(function scrollWorkspace () {
    // Verify the scroll bounds changed
    expect(this.workspaceEl.scrollWidth).to.not.equal(this.startScrollBounds.width);
    expect(this.workspaceEl.scrollHeight).to.not.equal(this.startScrollBounds.height);
    expect(this.workspaceEl.scrollTop).to.equal(0);
    expect(this.workspaceEl.scrollLeft).to.equal(0);

    // Scroll our workspace
    // DEV: We have asserts since if there's no room to scroll, then they won't change
    this.workspaceEl.scrollTop = 10;
    this.workspaceEl.scrollLeft = 10;
    expect(this.workspaceEl.scrollTop).to.not.equal(0);
    expect(this.workspaceEl.scrollLeft).to.not.equal(0);
  });
  before(function dragRectangleWidget (done) {
    // Drag a new rectangle widget to our outer bounds
    this.outOfBoundsEl = this.container.querySelector('#workspace').childNodes[0];
    htmlUtils.dragEl(this.svgEl, {
      start: {x: this.svgElBounds.left + 5, y: this.svgElBounds.top + 5},
      end: {x: this.svgElBounds.left + 305, y: this.svgElBounds.top + 205}
    }, done);
  });
  appUtils.capturePage('widget-palette-drag-scrolled.png');
  after(function cleanup () {
    delete this.startScrollBounds;
    delete this.outOfBoundsEl;
  });

  it('positions an widget at our expected position (despite workspace being scrolled)', function () {
    // DEV: We don't use `this.svgEl` since we create a new widget on drop
    var outOfBoundsEl = this.outOfBoundsEl;
    var _svgEl = _.find(this.container.querySelector('#workspace').childNodes, function isNewEl (el) {
      return el !== outOfBoundsEl;
    });
    var svgStartBounds = this.svgElBounds;
    var svgEndBounds = _svgEl.getBoundingClientRect();
    expect(svgEndBounds.left - svgStartBounds.left).to.equal(300);
    expect(svgEndBounds.top - svgStartBounds.top).to.equal(200);
  });
});
