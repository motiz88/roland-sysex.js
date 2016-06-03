/* eslint-env mocha */
import isChecksumValid from '../../src/isChecksumValid';
import {expect} from 'chai';

const goodSysexDr1 = {
  type: 'sysex',
  data: {
    vendor: 'Roland',
    deviceId: 0x10,
    modelId: 0x6A,
    command: {
      type: 'DR1',
      address: 0x01020304,
      size: 0,
      checksum: 0x76
    }
  }
};

const badSysexDr1 = {
  type: 'sysex',
  data: {
    vendor: 'Roland',
    deviceId: 0x10,
    modelId: 0x6A,
    command: {
      type: 'DR1',
      address: 0x01020304,
      size: 0,
      checksum: 0x11
    }
  }
};

const goodSysexDs1 = {
  type: 'sysex',
  data: {
    vendor: 'Roland',
    deviceId: 0x10,
    modelId: 0x6A,
    command: {
      type: 'DS1',
      address: 0x00000001,
      body: new Buffer([]),
      checksum: 0x7f
    }
  }
};

const badSysexDs1 = {
  type: 'sysex',
  data: {
    vendor: 'Roland',
    deviceId: 0x10,
    modelId: 0x6A,
    command: {
      type: 'DS1',
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
      isChecksumValid(goodSysexDr1).should.be.true;
      isChecksumValid(goodSysexDs1).should.be.true;
    });
    it('should be correct when negative', () => {
      isChecksumValid(badSysexDr1).should.be.false;
      isChecksumValid(badSysexDs1).should.be.false;
    });
  });
  describe('on sysex.data', () => {
    it('should be correct when positive', () => {
      isChecksumValid(goodSysexDr1.data).should.be.true;
      isChecksumValid(goodSysexDs1.data).should.be.true;
    });
    it('should be correct when negative', () => {
      isChecksumValid(badSysexDr1.data).should.be.false;
      isChecksumValid(badSysexDs1.data).should.be.false;
    });
  });
  describe('on sysex.data.command', () => {
    it('should be correct when positive', () => {
      isChecksumValid(goodSysexDr1.data.command).should.be.true;
      isChecksumValid(goodSysexDs1.data.command).should.be.true;
    });
    it('should be correct when negative', () => {
      isChecksumValid(badSysexDr1.data.command).should.be.false;
      isChecksumValid(badSysexDs1.data.command).should.be.false;
    });
  });
});
