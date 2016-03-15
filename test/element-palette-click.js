// Load in dependencies
var fs = require('fs');
var remote = require('electron').remote;
var expect = require('chai').expect;
var simulant = require('simulant');
var appUtils = require('./utils/application');
var Rectangle = require('../lib/js/elements/rectangle');

// Start our tests
describe('A click in the element palette', function () {
  appUtils.init();
  before(function clickRectangleElement () {
    // Find and click the rectangle element in the palette
    var rectEl = this.container.querySelector('[data-element=Rectangle]');
    simulant.fire(rectEl, 'click');
  });
  before(function visualTest (done) {
    setTimeout(function handleSetTimeout () {
      remote.getCurrentWindow().capturePage(function handleCapturePage (img) {
        fs.writeFile('tmp.png', img.toPng(), done);
      });
    }, 1000);
  });

  it('adds an element to the page', function () {
    expect(this.app.layers).to.have.length(1);
    var el = this.app.layers[0];
    expect(el).to.be.instanceof(Rectangle);
  });

  it('positions the element at our expected position', function () {
    var rectEl = this.container.querySelector('#workspace').childNodes[0];
    expect(rectEl.style.top).to.equal('100px');
    expect(rectEl.style.left).to.equal('100px');
  });
});
