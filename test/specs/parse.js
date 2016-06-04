/* eslint-env mocha */
import parse from '../../src/parse';
import hex from '../../src/utils/hex';

describe('parse()', () => {
  it('should parse an empty SysEx message', () => {
    parse(hex `F0 F7`)
    .should.deep.equal([{type: 'sysex', data: new Buffer([])}]);
  });
  it('should ignore all data between SysEx messages', () => {
    parse(hex `F0 F7 12 F5 F0 F7`)
    .should.deep.equal([{type: 'sysex', data: new Buffer([])}, {type: 'sysex', data: new Buffer([])}]);
  });
  it('should parse DR1', () => {
    parse(hex `F0   41 10 6A  11   01 02 03 04   00 00 00 00   76  F7`)
    .should.deep.equal([{
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
    }]);
  });
  it('should parse DS1', () => {
    parse(hex `F0   41 10 6A  12   00 00 00 01   7F F7`)
    .should.deep.equal([{
      type: 'sysex',
      data: {
        vendor: 'Roland',
        deviceId: 0x10,
        modelId: 0x6A,
        command: {
          type: 'DS1',
          address: 0x000000001,
          body: new Buffer([]),
          checksum: 0x7f
        }
      }
    }]);
    parse(hex `F0   41 10 6A  12   00 00 00 01 00 00 00 01 00 00 00 01 00 00 00 01   7c F7`);
  });
  it('should throw on bad checksum', () => {
    (() => parse(hex `F0   41 10 6A  12   00 00 00 01   11 F7`)).should.throw(/checksum/i);
    (() => parse(hex `F0   41 10 6A  11   01 02 03 04   00 00 00 00   12  F7`)).should.throw(/checksum/i);
  });
});
