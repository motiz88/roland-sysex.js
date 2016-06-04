/* istanbul ignore next */
/* eslint eqeqeq: 0 */
if (process.env.USE_PEGJS_REQUIRE == 1) {
  module.exports = require('./dynamicRequire')('./roland.pegjs');
} else {
  module.exports = require('./roland.pegjs.js');
}
