// Define a common noop function
function noop() {
}

// Wrap console.log with timestamps
function addTimestamp(key) {
  if (window.console) {
    return function addTimestampFn () {
      var args = [].slice.call(arguments);
      // [2015-11-18T02:12:00.000Z] Starting application...
      args.unshift('[' + (new Date()).toISOString() + ']');
      console[key].apply(console, args);
    };
  }
  return noop;
}
function identityOrNoop(key) {
  if (window.console) {
    return function identityOrNoopFn () {
      var args = [].slice.call(arguments);
      console[key].apply(console, args);
    };
  }
  return noop;
}

// exports.assert // Use `require('assert')` instead
// exports.clear // Use `console.clear()` in dev, never in app
exports.count = identityOrNoop('count');
exports.debug = addTimestamp('debug');
exports.dir = identityOrNoop('dir');
exports.dir = identityOrNoop('dir');
exports.error = addTimestamp('error');
// exports.exception // Alias for error (use error)
exports.group = identityOrNoop('group');
exports.groupCollapsed = identityOrNoop('groupCollapsed');
exports.groupEnd = identityOrNoop('groupEnd');
exports.info = addTimestamp('info');
exports.log = addTimestamp('log');
exports.profile = identityOrNoop('profile');
exports.profileEnd = identityOrNoop('profileEnd');
exports.table = identityOrNoop('table');
exports.time = identityOrNoop('time');
exports.timeEnd = identityOrNoop('timeEnd');
exports.timeStamp = identityOrNoop('timeStamp');
exports.trace = addTimestamp('trace');
exports.warn = addTimestamp('warn');
