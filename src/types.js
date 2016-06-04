/**
 * Describes a MIDI message.
 * This is either a {@link SysexMessage} or a {@link Buffer}.
 */
type MIDIMessage = SysexMessage | Buffer;

/**
 * Describes a SysEx message.
 */
type SysexMessage = {
  type: 'sysex',
  data: Buffer | RolandSysexVendorData;
};

/**
 * Describes the Roland-specific parts of a SysEx message that are common to various commands.
 */
type RolandSysexVendorData = {
  vendor: 'Roland',
  deviceId: number | Buffer,
  modelId: number | Buffer,
  command: RolandSysexCommandRQ1 | RolandSysexCommandDT1 | Buffer
};

/**
 * Describes a Roland "Data Request 1" command.
 */
type RolandSysexCommandRQ1 = {
  type: 'RQ1' | 'DR1',
  address: number,
  size: number,
  checksum?: number
};

/**
 * Describes a Roland "Data Set 1" command.
 */
type RolandSysexCommandDT1 = {
  type: 'DT1' | 'DS1',
  address: number,
  body: Buffer,
  checksum?: number
};

export type {MIDIMessage, SysexMessage, RolandSysexVendorData, RolandSysexCommandRQ1, RolandSysexCommandDT1};
