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
command:(rolandRQ1 / rolandDT1 / DATA_BYTE*)
{return {vendor: "Roland", deviceId, modelId, command};}
;

rolandRQ1 "Data Receive 1" = "11"i
address:ADDRESS4
size:SIZE4
checksum:DATA_BYTE
{
  const message = {type: "RQ1", address, size, checksum: scalar(checksum)};
  if (!isChecksumValid(message))
    error('RQ1 message failed checksum validation');
  return message;
}
;

rolandDT1 "Data Set 1" = "12"i
address:ADDRESS4
body: DATA_BYTES
{
  const message = {type: "DT1", address, body: body.slice(0, -1), checksum: scalar(body[body.length-1])};
  if (!isChecksumValid(message))
    error('DT1 message failed checksum validation');
  return message;
}
;

extensibleId = data:(first:"00"i middle:"00"i* last:DATA_BYTE {return hex([first].concat(middle, [last]).join(''));})
/ data:DATA_BYTE {return scalar(data)}; 

DATA_BYTE = $([0-7][0-9A-F]i);
SYSEX_START "SysEx Start" = "F0"i;
SYSEX_END "SysEx End" = "F7"i;
ADDRESS4 = UINT32BE;
SIZE4 = UINT32BE;
UINT32BE = data:FOUR_DATA_BYTES {return data.readUInt32BE(0);};
FOUR_DATA_BYTES = data:(DATA_BYTE DATA_BYTE DATA_BYTE DATA_BYTE) {return hex(data.join('')); };
DATA_BYTES = data:(DATA_BYTE*) {return hex(data.join('')); };
NON_SYSEX "non-SysEx byte" = !"F0"i ANY_BYTE;
ANY_BYTE "any byte" = data:$([0-9A-F]i [0-9A-F]i) {return scalar(data);}
