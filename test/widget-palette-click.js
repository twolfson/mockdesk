// Load in dependencies
var expect = require('chai').expect;
var simulant = require('simulant');
var appUtils = require('./utils/application');
var htmlUtils = require('./utils/html');
var Rectangle = require('../lib/js/widgets/rectangle');

// Start our tests
describe('A click in the widget palette', function () {
  appUtils.init();
  htmlUtils.saveEl('[data-widget=Rectangle] > svg', {key: 'svgEl'});
  before(function clickRectangleWidget () {
    // DEV: We don't use click due to draggabilly listening to mousedown/mouseup
    // DEV: We should note that this click could be on the heading as well
    var svgLeft = this.svgElBounds.left;
    var svgTop = this.svgElBounds.top;
    simulant.fire(this.svgEl, 'mousedown', {button: 0, clientX: svgLeft + 5, clientY: svgTop + 5});
    simulant.fire(this.svgEl, 'mouseup', {button: 0, clientX: svgLeft + 5, clientY: svgTop + 5});
  });
  appUtils.capturePage('widget-palette-click.png');

  it('adds an widget to the page', function () {
    expect(this.app.layers).to.have.length(1);
    var widget = this.app.layers[0];
    expect(widget).to.be.instanceof(Rectangle);
  });

  it('positions the widget at our expected position', function () {
    // DEV: We don't use `this.el` since we generate a new widget on click
    var rectEl = this.container.querySelector('#workspace').childNodes[0];
    expect(rectEl.style.top).to.equal('100px');
    expect(rectEl.style.left).to.equal('100px');
  });
});
