var chai = require("chai")
  , sinon = require("sinon")
  , sinonChai = require("sinon-chai")
  , sinonTest = require("sinon-test");

chai.use(sinonChai);

global.should = chai.should();
global.sinon = sinon;
global.sinon.test = sinonTest(sinon);