# redux-midi
[![travis][travis-image]][travis-url]
[![npm][npm-image]][npm-url]
[![semantic release][semantic-release-image]][semantic-release-url]
[![js-semistandard-style][semistandard-image]][semistandard-url]
[![MIT License][license-image]][license-url]

This module provides a store enhancer and a set of action creators wrapping the Web MIDI API for use in Redux apps.

* The list of MIDI devices is kept up-to-date in the state tree for your own reducers to use; updates are sent via the `RECEIVE_DEVICE_LIST` action.
* Dispatch a `SEND_MIDI_MESSAGE` action with a device ID, MIDI data and optional timestamp, and it will be sent.
* Dispatch a `SET_LISTENING_DEVICES` action with the IDs of one or more input devices and you will begin receiving messages from them.
* Listen for `RECEIVE_MIDI_MESSAGE` actions to handle incoming MIDI messages.

This repo is a work in progress. Watch this space for updates and in the mean time have a look at the source code for a better idea of what's going on.

[travis-image]: https://img.shields.io/travis/motiz88/redux-midi.svg?style=flat-square
[travis-url]: https://travis-ci.org/motiz88/redux-midi
[npm-image]: https://img.shields.io/npm/v/redux-midi.svg?style=flat-square
[npm-url]: https://npmjs.org/package/redux-midi
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[license-image]: http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square
[license-url]: http://motiz88.mit-license.org/
[semistandard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[semistandard-url]: https://github.com/Flet/semistandard
