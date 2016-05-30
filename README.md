# redux-midi

This module provides a store enhancer and a set of action creators wrapping the Web MIDI API for use in Redux apps.

* The list of MIDI devices is kept up-to-date in the state tree for your own reducers to use; updates are sent via the `RECEIVE_DEVICE_LIST` action.
* Dispatch a `SEND_MIDI_MESSAGE` action with a device ID, MIDI data and optional timestamp, and it will be sent.
* Dispatch a `SET_LISTENING_DEVICES` action with the IDs of one or more input devices and you will begin receiving messages from them.
* Listen for `RECEIVE_MIDI_MESSAGE` actions to handle incoming MIDI messages.

This repo is a work in progress. Watch this space for updates and in the mean time have a look at the source code for a better idea of what's going on.
