import rolandHexParser from './peg/roland';
import assert from 'assert';
import isBufferEquivalent from './utils/isBufferEquivalent';
import asBuffer from './utils/asBuffer';

/**
 * @param {Buffer|Uint8Array} buf  A buffer containing MIDI messages.
 * @returns {Array<MIDIMessage>} - Contains SysEx messages parsed from the buffer.
 */
export default function parse (buf) {
  assert(isBufferEquivalent(buf), 'buf must be a Buffer or Uint8Array');
  return rolandHexParser.parse(asBuffer(buf).toString('hex'));
}
