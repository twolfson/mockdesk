// Load in our dependencies
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// Define our store
// DEV: This is a hybrid of Flux's stores and Backbone's models
//   We don't currently need the abstractions of actions/dispatchers
//   as a result, we skip over their unnecessary tax in exchange for direct methods
// DEV: We use the name `store` over `model` since it's more like an object than an ORM
function ApplicationStore() {
  // Inherit from EventEmitter
  EventEmitter.call(this);
}
util.inherits(ApplicationStore, EventEmitter);
_.extend(ApplicationStore.prototype, {
  getWidgetMap: function () {
    // TODO: Implement me...
  },
  addWidget: function (widgetName, options) {
    // TODO: Handle location via options?
  }
});
