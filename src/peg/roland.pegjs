{
  const isChecksumValid = require('../isChecksumValid').default;
  
  function hex(str) {
    if (typeof str === 'string') {
      return new Buffer(str, 'hex');
    }
    return str;
  }
  function scalar(buf) {
    if (typeof buf === 'number')
      return buf;
    if (typeof buf === 'string') {
      if (buf.length !== 2)
        error();
      return parseInt(buf, 16);
    }
    if (Buffer.isBuffer(buf) || Array.isArray(buf)) {      
      if (buf.length !== 1)
        error();
      return buf[0];
    }
    error();
  }
}

sysexStream = (NON_SYSEX* s:sysex NON_SYSEX* {return s;})*;

sysex "SysEx Message" =
SYSEX_START data:(rolandSysex / DATA_BYTES) SYSEX_END {return {type: 'sysex', data}};

rolandSysex "Roland SysEx" = "41"i
deviceId: extensibleId
modelId: extensibleId
command:(rolandDR1 / rolandDS1 / DATA_BYTE*)
{return {vendor: "Roland", deviceId, modelId, command};}
;

rolandDR1 "Data Receive 1" = "11"i
address:ADDRESS4
size:SIZE4
checksum:DATA_BYTE
{
  const message = {type: "DR1", address, size, checksum: scalar(checksum)};
  if (!isChecksumValid(message))
    error('DR1 message failed checksum validation');
  return message;
}
;

rolandDS1 "Data Set 1" = "12"i
address:ADDRESS4
body: DATA_BYTES
{
  const message = {type: "DS1", address, body: body.slice(0, -1), checksum: scalar(body[body.length-1])};
  if (!isChecksumValid(message))
    error('DS1 message failed checksum validation');
  return message;
}
;

extensibleId = data:("00"i DATA_BYTE DATA_BYTE) {return hex(data.join('')); }
/ data:DATA_BYTE {return scalar(data)}; 

DATA_BYTE = $([0-7][0-9A-F]i);
SYSEX_START "SysEx Start" = "F0"i;
SYSEX_END "SysEx End" = "F7"i;
ADDRESS4 = data:FOUR_DATA_BYTES {return data.readUInt32BE(0);};
SIZE4 = bytes:FOUR_DATA_BYTES {return bytes.reduce((a, b) => a + b, 0);};
FOUR_DATA_BYTES = data:(DATA_BYTE DATA_BYTE DATA_BYTE DATA_BYTE) {return hex(data.join('')); };
DATA_BYTES = data:(DATA_BYTE*) {return hex(data.join('')); };
NON_SYSEX "non-SysEx byte" = !"F0"i ANY_BYTE;
ANY_BYTE "any byte" = data:$([0-9A-F]i [0-9A-F]i) {return scalar(data);}
