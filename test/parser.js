/* globals should, sinon */

var pg = require("pg")
  , parser = require("../lib/parser");

const identity = x => x;

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
      var range = parser.parseRange(identity, "[1,2]");
      range.begin.should.equal("1");
      range.end.should.equal("2");
      range.bounds.should.equal("[]");
    });

    it("should parse [) finite ranges", function () {
      var range = parser.parseRange(identity, "[1,2)");
      range.begin.should.equal("1");
      range.end.should.equal("2");
      range.bounds.should.equal("[)");
    });

    it("should parse (] finite ranges", function () {
      var range = parser.parseRange(identity, "(1,2]");
      range.begin.should.equal("1");
      range.end.should.equal("2");
      range.bounds.should.equal("(]");
    });

    it("should parse () finite ranges", function () {
      var range = parser.parseRange(identity, "(1,2)");
      range.begin.should.equal("1");
      range.end.should.equal("2");
      range.bounds.should.equal("()");
    });

    it("should parse quoted range bounds", function () {
      var range = parser.parseRange(identity, '("1, 2","3, 4")'); // jshint ignore:line
      range.begin.should.equal("1, 2");
      range.end.should.equal("3, 4");
    });

    it("should unescape quoted range bounds", function () {
      // jshint ignore:start
      var range = parser.parseRange(identity, '("\\"cows\\"","\\"moos\\"")');
      range.begin.should.equal('"cows"');
      range.end.should.equal('"moos"');
      // jshint ignore:end
    });

    it("should parse begin bound infinite ranges", function () {
      var range = parser.parseRange(identity, "[,2)");
      should.not.exist(range.begin);
      range.end.should.equal("2");
      range.bounds.should.equal("[)");
    });

    it("should parse end bound infinite ranges", function () {
      var range = parser.parseRange(identity, "[2,)");
      range.begin.should.equal("2");
      should.not.exist(range.end);
      range.bounds.should.equal("[)");
    });

    it("should parse both bound infinite ranges", function () {
      var range = parser.parseRange(identity, "[,)");
      should.not.exist(range.begin);
      should.not.exist(range.end);
      range.bounds.should.equal("[)");
    });
  });
});
