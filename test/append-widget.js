// Load in dependencies
var expect = require('chai').expect;
var appUtils = require('./utils/application');
var Rectangle = require('../lib/js/widgets/rectangle');

// Start our tests
describe.only('An application appending a widget', function () {
  appUtils.init();
  before(function appendWidget () {
    this.widget = new Rectangle({width: 10, height: 10});
    this.app.appendWidget(this.widget);
  });
  after(function cleanup () {
    delete this.widget;
  });

  it('adds the widget to the last layer', function () {
    expect(this.app.layers).to.have.length(1);
    expect(this.app.layers[0]).to.equal(this.widget);
  });

  it('adds the widget to the workspace', function () {
    expect(this.container.querySelector('#workspace').childNodes).to.have.length(1);
  });
});
