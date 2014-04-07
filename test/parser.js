/* globals should, sinon */

var _ = require("lodash")
  , pg = require("pg")
  , parser = require("../lib/parser");

describe("parser", function () {
  describe(".install", function () {
    it("should install new type parser", sinon.test(function () {
      var typesMock = this.mock(pg.types);

      typesMock.expects("getTypeParser").withArgs(23);
      typesMock.expects("setTypeParser").withArgs(24);

      parser.install(pg, 24, 23);

      typesMock.verify();
    }));
  });

  describe(".parseRange", function () {
    it("should parse [] finite ranges", function () {
      var range = parser.parseRange(_.identity, "[1,2]");
      range.lower.should.equal("1");
      range.upper.should.equal("2");
      range.bounds.should.equal("[]");
    });

    it("should parse [) finite ranges", function () {
      var range = parser.parseRange(_.identity, "[1,2)");
      range.lower.should.equal("1");
      range.upper.should.equal("2");
      range.bounds.should.equal("[)");
    });

    it("should parse (] finite ranges", function () {
      var range = parser.parseRange(_.identity, "(1,2]");
      range.lower.should.equal("1");
      range.upper.should.equal("2");
      range.bounds.should.equal("(]");
    });

    it("should parse () finite ranges", function () {
      var range = parser.parseRange(_.identity, "(1,2)");
      range.lower.should.equal("1");
      range.upper.should.equal("2");
      range.bounds.should.equal("()");
    });

    it("should parse quoted range bounds", function () {
      var range = parser.parseRange(_.identity, '("1, 2","3, 4")'); // jshint ignore:line
      range.lower.should.equal("1, 2");
      range.upper.should.equal("3, 4");
    });

    it("should unescape quoted range bounds", function () {
      // jshint ignore:start
      var range = parser.parseRange(_.identity, '("\\"cows\\"","\\"moos\\"")');
      range.lower.should.equal('"cows"');
      range.upper.should.equal('"moos"');
      // jshint ignore:end
    });

    it("should parse lower bound infinite ranges", function () {
      var range = parser.parseRange(_.identity, "[,2)");
      should.not.exist(range.lower);
      range.upper.should.equal("2");
      range.bounds.should.equal("[)");
    });

    it("should parse upper bound infinite ranges", function () {
      var range = parser.parseRange(_.identity, "[2,)");
      range.lower.should.equal("2");
      should.not.exist(range.upper);
      range.bounds.should.equal("[)");
    });

    it("should parse both bound infinite ranges", function () {
      var range = parser.parseRange(_.identity, "[,)");
      should.not.exist(range.lower);
      should.not.exist(range.upper);
      range.bounds.should.equal("[)");
    });
  });
});
