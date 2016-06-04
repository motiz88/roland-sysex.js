import rolandHexParser from './peg/roland';
import assert from 'assert';

/**
 * @param {Buffer} buf  A buffer containing MIDI messages.
 * @returns {Array<MIDIMessage>} - Contains SysEx messages parsed from the buffer.
 */
export default function parse (buf) {
  assert(Buffer.isBuffer(buf), 'Argument should be a Buffer');
  return rolandHexParser.parse(buf.toString('hex'));
}
