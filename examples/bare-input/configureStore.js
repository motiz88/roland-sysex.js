import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import { makeMidiEnhancer } from '../../src';

const logger = createLogger();

export default function configureStore (initialState, reducer) {
  let actions = [];

  function collector ({getState}) {
    return (next) => (action) => {
      actions.push(action);
      return next(action);
    };
  }
  const middleware = [collector, logger];

  const store = createStore(reducer || (state => state), initialState, compose(
    makeMidiEnhancer({midiOptions: {sysex: true}}),
    applyMiddleware(...middleware),
    global.devToolsExtension ? global.devToolsExtension() : f => f
  ));

  return store;
}
