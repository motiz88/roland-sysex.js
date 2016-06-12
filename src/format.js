import rolandChecksum from './rolandChecksum';
import isBufferEquivalent from './utils/isBufferEquivalent';
import asBuffer from './utils/asBuffer';

function requiredSize (message) {
  if (isBufferEquivalent(message)) return message.byteLength || message.length;
  if (typeof message === 'number') return 1; // make it simple
  if (!message) return 0;
  switch (message.type) {
    case 'sysex':
      return 2 + requiredSize(message.data);
    case 'RQ1':
    /* falls through */
    case 'DR1':
      // command byte + address + size + checksum
      return 1 + 4 + 4 + 1;
    case 'DT1':
    /* falls through */
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
 * Encodes MIDI data into a {@link Buffer}. For supported Roland messages, checksum calculation is done automatically.
 * @param {MIDIMessage|Array<MIDIMessage>} message
 * @returns {Buffer} The formatted message(s), ready for MIDI transmission.
 */
export default function format (message) {
  if (Array.isArray(message)) {
    return Buffer.concat(message.map(format));
  }
  if (isBufferEquivalent(message)) return asBuffer(message);
  if (!message || typeof message !== 'object') throw new Error('Message must be an Object or a Buffer');
  const size = requiredSize(message);
  const buf = new Buffer(size);
  buf.fill(0);
  let i = 0;
  const write = data => {
    if (isBufferEquivalent(data)) {
      if (data.byteLength || data.length) i += asBuffer(data).copy(buf, i);
    } else {
      buf[i++] = data;
    }
  };
  switch (message.type) {
    case 'sysex':
      write(0xF0);
      if (message.data) {
        if (isBufferEquivalent(message.data)) {
          write(message.data);
        } else if (message.data.vendor === 'Roland') {
          write(0x41);
          write(message.data.deviceId);
          write(message.data.modelId);
          if (isBufferEquivalent(message.data.command)) {
            write(message.data.command);
          } else {
            switch (message.data.command.type) {
              case 'RQ1':
              /* falls through */
              case 'DR1':
                write(0x11);
                i = buf.writeUInt32BE(message.data.command.address, i);
                i = buf.writeUInt32BE(message.data.command.size, i);
                write(rolandChecksum(buf.slice(i - 8, i)));
                break;
              case 'DT1':
              /* falls through */
              case 'DS1':
                write(0x12);
                i = buf.writeUInt32BE(message.data.command.address, i);
                write(message.data.command.body);
                write(rolandChecksum(buf.slice(i - (4 + message.data.command.body.length), i)));
                break;
              default:
                throw new Error(`Unknown ${message.data.vendor} SysEx command ${message.data.command.type}`);
            }
          }
        } else {
          throw new Error(`Unknown SysEx vendor ${message.data.vendor}`);
        }
      }
      write(0xF7);
      break;
    default:
      throw new Error(`Unsupported message type ${message.type}`);
  }
  return buf;
}
