/* eslint-env mocha */

import testSetterAction from './testSetterAction';

export default function describeSetterAction ({reducer, type, key, ...otherParams}, customBody) {
  describe(`action ${type}`, () => {
    it(`should set state.${key}`, () => {
      testSetterAction({ reducer, type, key, ...otherParams });
    });
    if (typeof customBody === 'function') customBody();
  });
}
