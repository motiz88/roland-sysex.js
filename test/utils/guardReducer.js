import deepFreeze from 'deep-freeze';

const guardReducer = reducer => (state, action) => reducer(state ? deepFreeze(state) : state, action ? deepFreeze(action) : action);

export default guardReducer;
