import { createStore, applyMiddleware, compose } from 'redux';

import createLogger from 'redux-logger';

const logger = createLogger({colors: false});

const debug = false;

export default function createMockStore (initialState, preEnhancer = f => f) {
  let actions = [];

  function collector ({getState}) {
    return (next) => (action) => {
      actions.push(action);
      return next(action);
    };
  }
  const middleware = [collector].concat(debug ? [logger] : []);

  const store = createStore(state => state, initialState, compose(
    preEnhancer,
    applyMiddleware(...middleware),
    global.devToolsExtension ? global.devToolsExtension() : f => f
  ));

  store.getActions = () => actions;
  store.clearActions = () => {
    actions = [];
  };
  return store;
}
