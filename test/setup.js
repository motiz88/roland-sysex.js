import chai from 'chai';
import chaiFlux from './helpers/chai-flux';
import chaiThings from 'chai-things';
import chaiDeepMatch from 'chai-deep-match';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(chaiFlux);
chai.use(chaiThings);
chai.use(chaiDeepMatch);
chai.use(sinonChai);
