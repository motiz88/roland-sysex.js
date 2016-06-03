import formatSize4 from './formats/size4';
import formatAddress4 from './formats/address4';
import rolandChecksum from './rolandChecksum';

function requiredSize (message) {
  if (Buffer.isBuffer(message)) return message.length;
  if (typeof message === 'number') return 1; // make it simple
  switch (message.type) {
    case 'sysex':
      return 2 + requiredSize(message.data);
    case 'DR1':
      // command byte + address + size + checksum
      return 1 + 4 + 4 + 1;
    case 'DS1':
      // command byte + address + body + checksum
      return 1 + 4 + requiredSize(message.body) + 1;
    default:
      if (message.vendor === 'Roland') {
        // vendor ID + device ID + model ID + command
        return 1 + requiredSize(message.deviceId) + requiredSize(message.modelId) + requiredSize(message.command);
      }
  }
  throw new Error('Could not determine message size');
}

/**
 * @param {MIDIMessage|Array<MIDIMessage>} message 
 * @returns {Buffer} The formatted message(s), ready for MIDI transmission. 
 */
export default function format (message) {
  if (Array.isArray(message)) {
    return Buffer.concat(message.map(format));
  }
  const size = requiredSize(message);
  const buf = Buffer.alloc(size);
  let i = 0;
  const write = data => {
    if (Buffer.isBuffer(data)) {
      i += data.copy(buf, i);
    } else {
      buf[i++] = data;
    }
  };
  switch (message.type) {
    case 'sysex':
      write(0xF0);
      if (Buffer.isBuffer(message.data)) {
        write(message.data);
      } else if (message.data.vendor === 'Roland') {
        write(0x41);
        write(message.data.deviceId);
        write(message.data.modelId);
        if (Buffer.isBuffer(message.data.command)) {
          write(message.data.command);
        } else {
          switch (message.data.command.type) {
            case 'DR1':
              write(0x11);
              write(formatAddress4(message.data.command.address));
              write(formatSize4(message.data.command.size));
              write(rolandChecksum(buf.slice(i - 8, i)));
              break;
            case 'DS1':
              write(0x12);
              write(formatAddress4(message.data.command.address));
              write(message.data.command.body);
              write(rolandChecksum(buf.slice(i - (4 + message.data.command.body.length), i)));
              break;
            default:
              throw new Error('Could not format command');
          }
        }
      }
      write(0xF7);
      break;
  }
  return buf;
}
