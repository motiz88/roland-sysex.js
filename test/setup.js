import chai from 'chai';
import chaiThings from 'chai-things';
import chaiDeepMatch from 'chai-deep-match';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(chaiThings);
chai.use(chaiDeepMatch);
chai.use(sinonChai);
