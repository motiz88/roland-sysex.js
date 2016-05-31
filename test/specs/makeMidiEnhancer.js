/* eslint-env mocha */

import { makeMidiEnhancer } from '../../src';

describe('makeMidiEnhancer', () => {
  it('should be a function', () => {
    makeMidiEnhancer.should.be.a('function');
  });
  it('should be callable with no arguments', () => {
    (() => makeMidiEnhancer()).should.not.throw;
  });
});
