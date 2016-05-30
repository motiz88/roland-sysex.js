/* eslint-env mocha */

import testNoOpAction from './testNoOpAction';

export default function describeNoOpAction ({reducer, type, ...otherParams}, customBody) {
  describe(`action ${type}`, () => {
    it('should be a no-op', () => {
      testNoOpAction({ reducer, type, ...otherParams });
    });
    if (typeof customBody === 'function') customBody();
  });
}
