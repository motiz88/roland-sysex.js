import {RECEIVE_DEVICE_LIST, SET_LISTENING_DEVICES, SEND_MIDI_MESSAGE, RECEIVE_MIDI_MESSAGE,
    receiveDeviceList, setListeningDevices, sendMidiMessage, receiveMidiMessage
} from '../../src';
import describeActionCreator from '../utils/describeActionCreator';

describe('action creators', () => {
    describeActionCreator('receiveDeviceList', receiveDeviceList, {type: RECEIVE_DEVICE_LIST, payloads: [
        [], [''], ['Hua Xing'], ['Yamaha USB-MIDI', 'Hua Xing']
    ]});
    
    describeActionCreator('setListeningDevices', setListeningDevices, {type: SET_LISTENING_DEVICES, payloads: [
        [], [''], ['Hua Xing'], ['Yamaha USB-MIDI', 'Hua Xing']
    ]});
    
    describeActionCreator('sendMidiMessage', sendMidiMessage, {type: SEND_MIDI_MESSAGE, payloads: [
        {device: 'Hua Xing', data: [0xF0, 0xF7]},
        {device: 'Roland GR-55', timestamp: 0, data: [0xF0, 0xF7]},
        {device: 'Roland GR-55', timestamp: 0, data: new Uint8Array([0xF0, 0xF7])}
    ]});
    
    describeActionCreator('receiveMidiMessage', receiveMidiMessage, {type: RECEIVE_MIDI_MESSAGE, payloads: [
        {device: 'Hua Xing', data: [0xF0, 0xF7]},
        {device: 'Roland GR-55', timestamp: 0, data: [0xF0, 0xF7]},
        {device: 'Roland GR-55', timestamp: 0, data: new Uint8Array([0xF0, 0xF7])}
    ]});
});
