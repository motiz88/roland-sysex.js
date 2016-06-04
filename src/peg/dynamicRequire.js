import pegjs from 'pegjs';
import fs from 'fs';

module.exports = function dynamicRequire (path) {
  const pegSource = fs.readFileSync(require.resolve(path), 'utf8');
  const parserCode = pegjs.buildParser(pegSource, {output: 'source'});
  /* eslint no-eval: 0 */
  return eval(parserCode);
};
