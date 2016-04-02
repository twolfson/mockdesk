// Load in our dependencies
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('underscore');

// Define our store
// DEV: This is a hybrid of Flux's stores and Backbone's models
//   We don't currently need the abstractions of actions/dispatchers
//   as a result, we skip over their unnecessary tax in exchange for direct methods
// DEV: We use the name `store` over `model` since it's more like an object than an ORM
function ApplicationStore() {
  // Inherit from EventEmitter
  EventEmitter.call(this);

  // Create a store for widgets
  this._widgets = {};
}
util.inherits(ApplicationStore, EventEmitter);
_.extend(ApplicationStore.prototype, {
  addWidget: function (widgetName, options) {
    // TODO: Handle location via options?
  },
  getWidgetMap: function () {
    // TODO: Implement me...
  },
  registerWidget: function (WidgetClass) {
    assert(WidgetClass.name, '`registerWidget` expected `WidgetClass` to have a `name` but it didn\'t');
    this._widgets[WidgetClass.name] = WidgetClass;
  }
});

// Initialize our store with all known widgets
var appStore = new ApplicationStore();
appStore.registerWidget(require('../widgets/rectangle'));

// Export our store
module.exports = appStore;
