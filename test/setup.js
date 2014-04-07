var chai = require("chai")
  , sinon = require("sinon")
  , sinonChai = require("sinon-chai");

chai.use(sinonChai);

global.should = chai.should();
global.sinon = sinon;
