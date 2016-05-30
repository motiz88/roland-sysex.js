import {reducer, RECEIVE_DEVICE_LIST, SET_LISTENING_DEVICES, SEND_MIDI_MESSAGE, RECEIVE_MIDI_MESSAGE} from '../../src';
import guardReducer from '../utils/guardReducer';
import describeSetterAction from '../utils/describeSetterAction';
import describeNoOpAction from '../utils/describeNoOpAction';

describe('reducer', () => {
    let reducerChecked;
    before(() => {
        reducerChecked = guardReducer(reducer);
    });
    
    it('should be a function', () => {
       reducer.should.be.a('function'); 
    });
    
    it('should initialize state correctly', () => {
       reducer(undefined, {}).should.deep.equal({devices: [], listeningDevices: []}); 
    });
    
    describeSetterAction({ reducer, type: RECEIVE_DEVICE_LIST, payloads: [
        [], [''], ['Hua Xing'], ['Yamaha USB-MIDI', 'Hua Xing']
    ], key: 'devices' });
    
    describeSetterAction({ reducer, type: SET_LISTENING_DEVICES, payloads: [
        [], [''], ['Hua Xing'], ['Yamaha USB-MIDI', 'Hua Xing']
    ], key: 'listeningDevices' });
    
    describeNoOpAction({ reducer, type: SEND_MIDI_MESSAGE });
    
    describeNoOpAction({ reducer, type: RECEIVE_MIDI_MESSAGE });
});
