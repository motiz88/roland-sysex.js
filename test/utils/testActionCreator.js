export default function testActionCreator (creator, {type, payload, payloads}) {
  creator(payload).should.be.an.FSA
    .with.property('type', type);
  if (payloads) {
    for (let p of payloads) {
      testActionCreator(creator, {type, payload: p});
    }
  }
}
