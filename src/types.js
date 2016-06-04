/** 
 * Describes a MIDI message.
 * This is either a SysexMessage or a Buffer;
 */
export type MIDIMessage = SysexMessage | Buffer;

/**
 * Describes a SysEx message.
 */
export type SysexMessage = {
  type: 'sysex',
  data: Buffer | RolandSysexVendorData;
};

/**
 * Describes the Roland-specific parts of a SysEx message that are common to various commands.
 */
export type RolandSysexVendorData = {
  vendor: 'Roland',
  deviceId: number | Buffer,
  modelId: number | Buffer,
  command: RolandSysexCommandDR1 | RolandSysexCommandDS1 | Buffer
};

/**
 * Describes a Roland "Data Request 1" command.
 */
export type RolandSysexCommandDR1 = {
  type: 'DR1',
  address: number,
  size: number,
  checksum?: number
};

/**
 * Describes a Roland "Data Set 1" command.
 */
export type RolandSysexCommandDS1 = {
  type: 'DS1',
  address: number,
  body: Buffer,
  checksum?: number
};
