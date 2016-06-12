/**
 * @private
 * Check that {@link buf} is a {@link Buffer} equivalent (e.g. a typed array)
 * @param buf
 * @returns {boolean}
 */
export default function isBufferEquivalent (buf) {
  return Buffer.isBuffer(buf) || (buf.buffer instanceof ArrayBuffer) || (buf instanceof ArrayBuffer);
}
