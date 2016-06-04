import rolandChecksum from './rolandChecksum';

export default function isChecksumValid (msg) {
  if (!msg || typeof msg !== 'object') return null;
  switch (msg.type) {
    case 'sysex':
      return isChecksumValid(msg.data);
    case 'DT1':
    /* falls through */
    case 'DS1':
      return rolandChecksum(Buffer.concat([getUInt32BE(msg.address), msg.body])) === msg.checksum;
    case 'RQ1':
    /* falls through */
    case 'DR1':
      return rolandChecksum(Buffer.concat([getUInt32BE(msg.address), getUInt32BE(msg.size)])) === msg.checksum;
    default:
      if (msg.vendor === 'Roland') return isChecksumValid(msg.command);
  }
  return null;
}

function getUInt32BE (number) {
  const buf = new Buffer(4);
  buf.writeUInt32BE(number);
  return buf;
}
