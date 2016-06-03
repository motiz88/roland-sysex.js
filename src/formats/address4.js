import assert from 'assert';

export default function formatAddress4 (address) {
  assert(typeof address === 'number', 'Address is not a number');
  const buf = Buffer.alloc(4);
  buf.writeUInt32BE(address, 0);
  return buf;
}
