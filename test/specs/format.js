/* eslint-env mocha */
import format from '../../src/format';
import hex from '../../src/utils/hex';

describe('format()', () => {
  it('should format RQ1', () => {
    format({
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
    }).should.deep.equal(hex `F0   41 10 6A  11   01 02 03 04   00 00 00 00   76  F7`);
  });
  it('should format DT1', () => {
    format({
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
    }).should.deep.equal(hex `F0   41 10 6A  12   00 00 00 01   7F F7`);
  });
  it('should accept DR1 as a synonym of RQ1', () => {
    format({
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
    }).should.deep.equal(hex `F0   41 10 6A  11   01 02 03 04   00 00 00 00   76  F7`);
  });
  it('should format DS1 as a synonym of DT1', () => {
    format({
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
    }).should.deep.equal(hex `F0   41 10 6A  12   00 00 00 01   7F F7`);
  });
  it('should always calculate a fresh checksum', () => {
    format({
      type: 'sysex',
      data: {
        vendor: 'Roland',
        deviceId: 0x10,
        modelId: 0x6A,
        command: {
          type: 'DT1',
          address: 0x00000001,
          body: new Buffer([]),
          checksum: 0x11
        }
      }
    }).should.deep.equal(hex `F0   41 10 6A  12   00 00 00 01   7F F7`);
    format({
      type: 'sysex',
      data: {
        vendor: 'Roland',
        deviceId: 0x10,
        modelId: 0x6A,
        command: {
          type: 'DT1',
          address: 0x00000001,
          body: new Buffer([])
        }
      }
    }).should.deep.equal(hex `F0   41 10 6A  12   00 00 00 01   7F F7`);
  });
});
