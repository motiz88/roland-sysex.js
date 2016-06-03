import rolandChecksum from './rolandChecksum';
import formatSize4 from './formats/size4';
import formatAddress4 from './formats/address4';

export default function isChecksumValid (msg) {
  if (!msg || typeof msg !== 'object') return null;
  switch (msg.type) {
    case 'sysex':
      return isChecksumValid(msg.data);
    case 'DS1':
      return rolandChecksum(Buffer.concat([formatAddress4(msg.address), msg.body])) === msg.checksum;
    case 'DR1':
      return rolandChecksum(Buffer.concat([formatAddress4(msg.address), formatSize4(msg.size)])) === msg.checksum;
    default:
      if (msg.vendor === 'Roland') return isChecksumValid(msg.command);
  }
  return null;
}
