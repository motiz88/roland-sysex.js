import configureStore from './configureStore';
import {setListeningDevices, RECEIVE_MIDI_MESSAGE} from '../../src';

const store = configureStore({}, (state, action) => {
  if (!state.midiMessages) {
    state = {...state, midiMessages: []};
  }
  if (action.type === RECEIVE_MIDI_MESSAGE) {
    state = {...state, midiMessages: [action.payload, ...state.midiMessages]};
  }
  return state;
});

const deviceList = document.createElement('pre');
const messageLog = document.createElement('pre');

let devices = [];
let midiMessages = [];

store.subscribe(() => {
  const state = store.getState();
  if (state.midi.devices && state.midi.devices !== devices) {
    devices = state.midi.devices;
    deviceList.textContent =
     ['Devices:', ...devices.map(device => `${device.id}> [${device.type}] ${device.manufacturer} ${device.name} - ${device.connection}, ${device.state}`)]
     .join('\n');
    store.dispatch(setListeningDevices(devices
      .filter(device => device.type === 'input')
      .map(device => device.id))
    );
  }
  if (state.midiMessages && state.midiMessages !== midiMessages) {
    midiMessages = state.midiMessages;
    messageLog.textContent =
     midiMessages.map(message => `${message.timestamp}:  ${message.device}> ${formatHex(message.data)}`)
     .join('\n');
  }
});

document.body.appendChild(deviceList);
document.body.appendChild(messageLog);

function formatHex (buf) {
  var s = '';
  for (let b of buf) {
    s += ' ' + (('00' + b.toString(16)).slice(-2));
  }
  return s.trim();
}
