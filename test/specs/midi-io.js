import { makeMidiEnhancer, SEND_MIDI_MESSAGE, RECEIVE_MIDI_MESSAGE, SET_LISTENING_DEVICES } from '../../src';
import MidiApi from 'web-midi-test-api';
import createMockStore from '../utils/mockStore';
import unique from 'lodash.uniq';
import sinon from 'sinon';

describe('MIDI I/O', () => {
    let store, api;
    beforeEach(() => {
        api = new MidiApi();
        store = createMockStore(undefined, makeMidiEnhancer({
            requestMIDIAccess: api.requestMIDIAccess
        }));
        return new Promise(resolve => setImmediate(resolve));        
    });
    it('should see no devices to begin with', () => {
        store.getState()
            .should.have.deep.property('midi.devices')
            .which.deep.equals([]);
    });
    it('should listen to no devices to begin with', () => {
        store.getState()
            .should.have.deep.property('midi.listeningDevices')
            .which.deep.equals([]);
    });
    describe('with mock I/O devices', () => {
        let device;
        beforeEach(() => {
            device = api.createMIDIDevice({ numberOfInputs: 1, numberOfOutputs: 1, name: 'Mock MIDI device', manufacturer: 'motiz88', version: '1.1.1' });
        });
        it('should see devices', () => {
            store.getState()
                .should.have.deep.property('midi.devices')
                .which.is.an('array');
            const devices = store.getState().midi.devices;
            for (let device of devices) {
                device.should.deep.match({manufacturer: 'motiz88', version: '1.1.1', state: 'connected', connection: 'closed'});
                device.should.have.property('name')
                    .which.is.a('string')
                    .with.match(/^Mock MIDI device/);
            }
            const types = devices.map(device => device.type);
            types.should.include('output');
            types.should.include('input');
            unique(devices.map(device => device.id))
                .should.have.length(2);
        });
        it('should see devices added later', () => {
            device = api.createMIDIDevice({ numberOfInputs: 1, numberOfOutputs: 1, name: 'Other mock MIDI device', manufacturer: 'motiz88', version: '1.1.1' });
            
            store.getState()
                .should.have.deep.property('midi.devices')
                .which.is.an('array');
            const devices = store.getState().midi.devices;
            for (let device of devices) {
                device.should.deep.match({manufacturer: 'motiz88', version: '1.1.1', state: 'connected', connection: 'closed'});
            }
            const names = devices.map(device => device.name);
            names.should.include.something.to.match(/^Mock MIDI device/);
            names.should.include.something.to.match(/^Other mock MIDI device/);
            
            const types = devices.map(device => device.type);
            types.filter(t => t === 'output')
                .should.have.length(2);
            types.filter(t => t === 'input')
                .should.have.length(2);
                
            unique(devices.map(device => device.id))
                .should.have.length(4);
        });
        it('should receive message when listening on device', () => {
           const devices = store.getState().midi.devices;
           const inputs = devices.filter(device => device.type === 'input');
           const inputIds = inputs.map(device => device.id);
           store.dispatch({ type: SET_LISTENING_DEVICES, payload: inputs.map(device => device.id) });
           store.clearActions();
           device.outputs[0].send([0x80, 0x7f, 0x7f], 1234);
           store.getActions().should.deep.equal([{ type: RECEIVE_MIDI_MESSAGE, payload: {data: new Uint8Array([0x80, 0x7f, 0x7f]), timestamp: 1234, device: inputIds[0]} }]);
        });
        it('should not receive message when not listening', () => {
           const devices = store.getState().midi.devices;
           const inputs = devices.filter(device => device.type === 'input');
           const inputIds = inputs.map(device => device.id);
           store.dispatch({ type: SET_LISTENING_DEVICES, payload: [] });
           store.clearActions();
           device.outputs[0].send([0x80, 0x7f, 0x7f]);
           store.getActions().should.be.empty;
        });
        it('should send message to a valid device', () => {
           const devices = store.getState().midi.devices;
           const outputs = devices.filter(device => device.type === 'output');
           const outputIds = outputs.map(device => device.id);
           device.inputs[0].onmidimessage = sinon.spy();
           store.dispatch({ type: SEND_MIDI_MESSAGE, payload: {data: [0x80, 0x7f, 0x7f], timestamp: 1234, device: outputIds[0]} });
           device.inputs[0].onmidimessage.should.have.been.calledWith({data: new Uint8Array([0x80, 0x7f, 0x7f]), receivedTime: 1234});
        });        
    });
});