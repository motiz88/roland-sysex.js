/* eslint-env mocha */
import rolandChecksum from '../../src/rolandChecksum';
import {expect} from 'chai';

describe('rolandChecksum', () => {
  it('should exist', () => {
    expect(rolandChecksum).to.be.a('function');
  });
  it('should be correct', () => {
    rolandChecksum(new Buffer([0x00, 0x00, 0x00, 0x04, 0x0C, 0x08]))
      .should.equal(0x68);
    rolandChecksum(new Buffer([0x80]))
      .should.equal(0x00);
  });
});
