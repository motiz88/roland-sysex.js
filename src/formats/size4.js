import assert from 'assert';

export default function formatSize4 (size) {
  assert(typeof size === 'number', 'Size is not a number');
  const result = Buffer.alloc(4, 0);
  for (let i = 0; i < 3; ++i) {
    if (size > 0) {
      result[i] = size % 128;
      size -= size % 128;
    } else {
      break;
    }
  }
  if (size > 0) throw new Error('Size too large for size4 field');
  return result;
}
