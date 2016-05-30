import guardReducer from '../utils/guardReducer';

export default function testSetterAction ({reducer, type, payload, payloads, key}) {
  const reducerChecked = guardReducer(reducer);
  // From empty state
  reducerChecked({}, {type, payload})
    .should.have.property(key)
    .that.deep.equals(payload);
  // From default state
  reducerChecked(reducerChecked(undefined, {}), {type, payload})
    .should.have.property(key)
    .that.deep.equals(payload);
  if (payloads) {
    for (let p of payloads) {
      testSetterAction({reducer, type, payload: p, key});
    }
  }
}
