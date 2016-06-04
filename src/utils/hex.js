export default function hexTemplateTag (strings, ...values) {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += values[i];
    }
  }

  return new Buffer(result.replace(/[^0-9a-f]/gi, ''), 'hex');
}
