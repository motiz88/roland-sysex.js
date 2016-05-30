/* eslint-env mocha */

import testActionCreator from './testActionCreator';

export default function describeActionCreator (creatorName, creator, {type, ...otherParams}, customBody) {
  describe(`${creatorName}`, () => {
    it('should be a function', () => {
      creator.should.be.a('function');
    });
    if (type) {
      it(`should create actions of type ${type}`, () => {
        testActionCreator(creator, {type, ...otherParams});
      });
    }
    if (typeof customBody === 'function') customBody();
  });
}
