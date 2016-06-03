/* istanbul ignore next */
if (process.env.USE_PEGJS_REQUIRE) {
  module.exports = require('./dynamicRequire')('./roland.pegjs');
} else {
  module.exports = require('./roland.pegjs.js');
}
