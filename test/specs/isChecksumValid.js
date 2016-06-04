/* eslint-env mocha */
import isChecksumValid from '../../src/isChecksumValid';
import {expect} from 'chai';

const goodSysexRQ1 = {
  type: 'sysex',
  data: {
    vendor: 'Roland',
    deviceId: 0x10,
    modelId: 0x6A,
    command: {
      type: 'RQ1',
      address: 0x01020304,
      size: 0,
      checksum: 0x76
    }
  }
};

const badSysexRQ1 = {
  type: 'sysex',
  data: {
    vendor: 'Roland',
    deviceId: 0x10,
    modelId: 0x6A,
    command: {
      type: 'RQ1',
      address: 0x01020304,
      size: 0,
      checksum: 0x11
    }
  }
};

const goodSysexDT1 = {
  type: 'sysex',
  data: {
    vendor: 'Roland',
    deviceId: 0x10,
    modelId: 0x6A,
    command: {
      type: 'DT1',
      address: 0x00000001,
      body: new Buffer([]),
      checksum: 0x7f
    }
  }
};

const badSysexDT1 = {
  type: 'sysex',
  data: {
    vendor: 'Roland',
    deviceId: 0x10,
    modelId: 0x6A,
    command: {
      type: 'DT1',
      address: 0x00000001,
      body: new Buffer([]),
      checksum: 0x75
    }
  }
};

describe('isChecksumValid', () => {
  it('should exist', () => {
    expect(isChecksumValid).to.be.a('function');
  });
  describe('on sysex message', () => {
    it('should be correct when positive', () => {
      isChecksumValid(goodSysexRQ1).should.be.true;
      isChecksumValid(goodSysexDT1).should.be.true;
    });
    it('should be correct when negative', () => {
      isChecksumValid(badSysexRQ1).should.be.false;
      isChecksumValid(badSysexDT1).should.be.false;
    });
  });
  describe('on sysex.data', () => {
    it('should be correct when positive', () => {
      isChecksumValid(goodSysexRQ1.data).should.be.true;
      isChecksumValid(goodSysexDT1.data).should.be.true;
    });
    it('should be correct when negative', () => {
      isChecksumValid(badSysexRQ1.data).should.be.false;
      isChecksumValid(badSysexDT1.data).should.be.false;
    });
  });
  describe('on sysex.data.command', () => {
    it('should be correct when positive', () => {
      isChecksumValid(goodSysexRQ1.data.command).should.be.true;
      isChecksumValid(goodSysexDT1.data.command).should.be.true;
    });
    it('should be correct when negative', () => {
      isChecksumValid(badSysexRQ1.data.command).should.be.false;
      isChecksumValid(badSysexDT1.data.command).should.be.false;
    });
  });
});
