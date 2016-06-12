import SafeBuffer from 'safe-buffer';

/**
 * @private
 * Ensure that {@link buf} is a @{link Buffer}
 * @param {Buffer|TypedArray|ArrayBuffer} buf  A buffer or typed array.
 * @returns {Buffer}
 */
export default function asBuffer (buf) {
  if (Buffer.isBuffer(buf)) return buf;
  if (buf.buffer instanceof ArrayBuffer) {
    return SafeBuffer.Buffer.from(buf.buffer);
  }
  return SafeBuffer.Buffer.from(buf);
}
