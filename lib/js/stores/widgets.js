// Load in our dependencies
var assert = require('assert');
var Immutable = require('immutable');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('underscore');

// Define our store
function WidgetStore() {
  // Inherit from EventEmitter
  EventEmitter.call(this);

  // Create a store for widgets
  this._widgets = new Immutable.Map();
}
util.inherits(WidgetStore, EventEmitter);
_.extend(WidgetStore.prototype, {
  getMap: function () {
    return this._widgets.toObject();
  },
  register: function (WidgetClass) {
    assert(WidgetClass.name, '`WidgetStore.register` expected `WidgetClass` to have a `name` but it didn\'t');
    this._widgets = this._widgets.set(WidgetClass.name, WidgetClass);
  }
});

// Initialize our store with all known widgets
var widgetStore = new WidgetStore();
widgetStore.register(require('../widgets/rectangle'));

// Export our store
module.exports = widgetStore;
