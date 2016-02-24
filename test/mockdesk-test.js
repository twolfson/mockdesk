// Load in dependencies
var assert = require('assert');
var mockdesk = require('../');

// Start our tests
describe('mockdesk', function () {
  it('returns awesome', function () {
    assert.strictEqual(mockdesk(), 'awesome');
  });
});
