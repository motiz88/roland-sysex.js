import { createDuck } from 'redux-duck';

const myDuck = createDuck('midi', 'redux-midi');

export const RECEIVE_DEVICE_LIST = myDuck.defineType('RECEIVE_DEVICE_LIST');
export const SET_LISTENING_DEVICES = myDuck.defineType('SET_LISTENING_DEVICES');
export const RECEIVE_MIDI_MESSAGE = myDuck.defineType('RECEIVE_MIDI_MESSAGE');
export const SEND_MIDI_MESSAGE = myDuck.defineType('SEND_MIDI_MESSAGE');

export const receiveDeviceList = myDuck.createAction(RECEIVE_DEVICE_LIST);
export const setListeningDevices = myDuck.createAction(SET_LISTENING_DEVICES);
export const receiveMidiMessage = myDuck.createAction(RECEIVE_MIDI_MESSAGE);
export const sendMidiMessage = myDuck.createAction(SEND_MIDI_MESSAGE);

const initialState = {
  devices: [],
  listeningDevices: []
};

const reducer = myDuck.createReducer({
  [RECEIVE_DEVICE_LIST]: (state, action) => ({
    ...state,
    devices: action.payload
  }),
  [SET_LISTENING_DEVICES]: (state, action) => ({
    ...state,
    listeningDevices: action.payload
  })
}, initialState);

export { reducer };
export default reducer;

import observeStore from './observeStore';

import sortBy from 'lodash.sortby';
import deepEqual from 'deep-equal';

const defaultRequestMIDIAccess = global && global.navigator && global.navigator.requestMIDIAccess.bind(global.navigator);

export const makeMidiEnhancer = ({midiOptions, stateKey = 'midi', requestMIDIAccess = defaultRequestMIDIAccess}) => next => (userReducer, preloadedState) => {
  let midiAccess = null;

  const enhancedReducer = (state = {}, action) => {
    const midiState = state[stateKey];
    const nextMidiState = reducer(midiState, action);

    const nextState = userReducer(state, action) || {};
    if (nextMidiState !== nextState[stateKey]) {
      return {...nextState, [stateKey]: nextMidiState};
    }
    return nextState;
  };

  const store = next(enhancedReducer, preloadedState);

  const enhancedStoreMethods = {
    dispatch (action) {
      const {payload} = action;
      if (action.type === SEND_MIDI_MESSAGE) {
        const {timestamp, data, device} = payload;
        if (midiAccess) {
          const {outputs} = midiAccess;
          if (outputs.has(device)) {
            outputs.get(device).send(data, timestamp);
          }
        }
      }
      return store.dispatch(action);
    }
  };

  requestMIDIAccess(midiOptions).then(receivedMidiAccess => {
    midiAccess = receivedMidiAccess;

    const sendDeviceList = () => {
      const devices = sortBy([...midiAccess.inputs.values(), ...midiAccess.outputs.values()].map(device => ({
        id: device.id,
        manufacturer: device.manufacturer,
        name: device.name,
        type: device.type,
        version: device.version,
        state: device.state,
        connection: device.connection
      })), 'id');
      if (!deepEqual(devices, store.getState()[stateKey].devices)) {
        store.dispatch(receiveDeviceList(devices));
      }
    };

    midiAccess.onstatechange = () => sendDeviceList();

    observeStore(store, state => state[stateKey], (state, prevState) => {
      let toUnlisten = [];
      let toListen = [];

      if (!prevState) prevState = initialState;

      if (state.listeningDevices !== prevState.listeningDevices) {
        let prev = new Set(prevState ? prevState.listeningDevices : []);
        let next = new Set(state.listeningDevices);
        toUnlisten.push(...prevState.listeningDevices.filter(dev => !next.has(dev)));
        toListen.push(...state.listeningDevices.filter(dev => !prev.has(dev)));
      }

      if (state.devices !== prevState.devices) {
        let prev = new Set(prevState.devices.map(device => device.id));
        let next = new Set(state.devices.map(device => device.id));
        toListen.push(...state.listeningDevices.filter(device => midiAccess.inputs.has(device) && next.has(device) && !prev.has(device)));
      }

      for (let device of toUnlisten) {
        if (midiAccess.inputs.has(device)) {
          midiAccess.inputs.get(device).onmidimessage = null;
        }
      }

      for (let device of toListen) {
        if (midiAccess.inputs.has(device)) {
          midiAccess.inputs.get(device).onmidimessage = ({receivedTime, timeStamp, timestamp, data}) => {
            timestamp = [receivedTime, timeStamp, timestamp].filter(x => x !== undefined)[0];
            store.dispatch(receiveMidiMessage({ timestamp, data, device }));
          };
        }
      }
    });
    sendDeviceList();
  });
  return {...store, ...enhancedStoreMethods};
};
