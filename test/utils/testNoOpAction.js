import guardReducer from '../utils/guardReducer';

export default function testNoOpAction ({reducer, type, payload, payloads, key}) {
  const reducerChecked = guardReducer(reducer);
  const initialState = reducerChecked(undefined, {});
  reducerChecked(initialState, {type, payload})
    .should.equal(initialState);
  if (payloads) {
    for (let p of payloads) {
      testNoOpAction({reducer, type, payload: p, key});
    }
  }
}
