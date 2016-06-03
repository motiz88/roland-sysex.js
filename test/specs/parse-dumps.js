/* eslint-env mocha */
import parse from '../../src/parse';
import format from '../../src/format';
import fs from 'mz/fs';
import path from 'path';
import glob from 'glob';

describe('Parsing and reformatting real SysEx dump', () => {
  const files = glob.sync(path.resolve(__dirname, '..', 'data', '*.syx'));

  for (let file of files) {
    it(path.basename(file), async () => {
      const syx = await fs.readFile(file);
      const messages = parse(syx);
      messages.should.not.be.empty;
      format(messages).should.deep.equal(syx);
    });
  }
});
