export default function rolandChecksum (buf) {
  return (128 - buf.reduce((a, b) => (a + b) % 128, 0)) % 128;
}
