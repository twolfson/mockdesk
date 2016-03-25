// Load in dependencies
var expect = require('chai').expect;
var simulant = require('simulant');
var appUtils = require('./utils/application');
var Rectangle = require('../lib/js/elements/rectangle');

// Start our tests
describe('A click in the widget palette', function () {
  appUtils.init();
  before(function clickRectangleWidget () {
    // Find and click the rectangle's HTML element in the palette
    var rectEl = this.container.querySelector('[data-widget=Rectangle]');
    simulant.fire(rectEl, 'click');
  });
  appUtils.capturePage('widget-palette-click.png');

  it('adds an widget to the page', function () {
    expect(this.app.layers).to.have.length(1);
    var widget = this.app.layers[0];
    expect(widget).to.be.instanceof(Rectangle);
  });

  it('positions the widget at our expected position', function () {
    var rectEl = this.container.querySelector('#workspace').childNodes[0];
    expect(rectEl.style.top).to.equal('100px');
    expect(rectEl.style.left).to.equal('100px');
  });
});
