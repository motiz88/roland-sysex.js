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
  command: RolandSysexCommandDR1 | RolandSysexCommandDS1 | Buffer
};

/**
 * Describes a Roland "Data Request 1" command.
 */
type RolandSysexCommandDR1 = {
  type: 'DR1',
  address: number,
  size: number,
  checksum?: number
};

/**
 * Describes a Roland "Data Set 1" command.
 */
type RolandSysexCommandDS1 = {
  type: 'DS1',
  address: number,
  body: Buffer,
  checksum?: number
};

export type {MIDIMessage, SysexMessage, RolandSysexVendorData, RolandSysexCommandDR1, RolandSysexCommandDS1};
