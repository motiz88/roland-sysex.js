import { createDuck } from 'redux-duck';

const myDuck = createDuck('midi', 'redux-midi');

export const RECEIVE_DEVICE_LIST = myDuck.defineType('RECEIVE_DEVICE_LIST');
export const SET_LISTENING_DEVICES = myDuck.defineType('SET_LISTENING_DEVICES');
export const RECEIVE_MIDI_MESSAGE = myDuck.defineType('RECEIVE_MIDI_MESSAGE');
export const SEND_MIDI_MESSAGE = myDuck.defineType('SEND_MIDI_MESSAGE');

/**
 * Creates a `RECEIVE_DEVICE_LIST` action.
 * This action is dispatched by the MIDI enhancer at initialization, when devices are connected/disconnected and when devices change state.
 * @param {Array<MIDIDevice>} devices
 */
export const receiveDeviceList = myDuck.createAction(RECEIVE_DEVICE_LIST);

/**
 * Creates a `SET_LISTENING_DEVICES` action. Dispatch this action with the `id`s of MIDI input devices you would like to receive messages from.
 * @param {Array<string>} listeningDevices
 */
export const setListeningDevices = myDuck.createAction(SET_LISTENING_DEVICES);

/**
 * Creates a `RECEIVE_MIDI_MESSAGE` action. This action is dispatched by the MIDI enhancer when a message received from a device you're listening to.
 * @param {MIDIMessage} message
 * @param {Uint8Array} message.data
 * @param {DOMHighResTimeStamp} message.timestamp
 * @param {string} message.device - ID of the source device
 */
export const receiveMidiMessage = myDuck.createAction(RECEIVE_MIDI_MESSAGE);

/**
 * Creates a `SEND_MIDI_MESSAGE` action. Dispatch this action to send a MIDI message to a specified device.
 * @param {MIDIMessage} message
 * @param {Uint8Array} message.data
 * @param {DOMHighResTimeStamp} message.timestamp
 * @param {string} message.device - ID of the destination device
 */
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

/**
 * Create a Redux {@link https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer|store enhancer} wrapping MIDI I/O and device discovery.
 * @param {MIDIOptions} [$0.midiOptions] - Options with which to invoke `requestMIDIAccess`.
 * @param {string} [$0.stateKey='midi'] - The key under which the enhancer will store MIDI device information in the state.
 * @param {function(MIDIOptions): Promise<MIDIAccess>} [$0.requestMIDIAccess=navigator.requestMIDIAccess] - Web MIDI API entry point.
 * @example
 * // Basic usage
 * import { createStore } from 'redux';
 * import { makeMidiEnhancer } from 'redux-midi';
 * const store = createStore(reducer, initialState, makeMidiEnhancer());
 * @example
 * // With middleware
 * import { createStore, applyMiddleware, compose } from 'redux';
 * import { makeMidiEnhancer } from 'redux-midi';
 * // assuming middleware is an array of Redux middleware functions
 * const store = createStore(reducer, initialState, compose(
 *   makeMidiEnhancer({midiOptions: {sysex: true}}),
 *   applyMiddleware(...middleware)
 * ));
 */
export const makeMidiEnhancer = ({midiOptions, stateKey = 'midi', requestMIDIAccess = defaultRequestMIDIAccess} = {}) => next => (userReducer, preloadedState) => {
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
