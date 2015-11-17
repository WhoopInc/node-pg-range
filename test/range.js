/* global sinon */

var Range = require("../lib/range");

describe("Range", function () {
  describe("constructor", function () {
    it("should work with new", function () {
      var range = new Range(1, 2, "[]");
      range.should.be.an.instanceOf(Range);
    });

    it("should work without new", function () {
      var range = Range(1, 2, "[]");
      range.should.be.an.instanceOf(Range);
    });

    it("should not reject ranges where lower > upper", function () {
      (function () {
        Range(2, 1, "[]");
      }).should.not.throw();
    });

    it("should use default bounds [] if unspecified", function () {
      Range(1, 2).bounds.should.equal("[]");
    });

    it("should support empty ranges", function () {
      Range().isEmpty().should.be.true;
    });
  });

  describe("#toPostgres", function () {
    function toPostgres(lower, upper, bounds) {
      var prepare = sinon.stub();
      prepare.withArgs(lower).returns(lower ? lower.toString() : null);
      prepare.withArgs(upper).returns(upper ? upper.toString() : null);

      return Range(lower, upper, bounds).toPostgres(prepare);
    }

    it("properly prepares lower and upper bounds", function () {
      var prepare = sinon.stub().returns("");
      Range(1, 2, "[]").toPostgres(prepare);
      prepare.should.have.been.calledWith(1);
      prepare.should.have.been.calledWith(2);
    });

    describe("when given a finite range", function () {
      it("handles [] ranges", function () {
        toPostgres(1, 2, "[]").should.equal("[1,2]");
      });

      it("handles [) ranges", function () {
        toPostgres(1, 2, "[)").should.equal("[1,2)");
      });

      it("handles (] ranges", function () {
        toPostgres(1, 2, "(]").should.equal("(1,2]");
      });

      it("handles () ranges", function () {
        toPostgres(1, 2, "()").should.equal("(1,2)");
      });
    });

    describe("when given a non-finite range", function () {
      it("handles lower bound infinite", function () {
        toPostgres(null, 2, "()").should.equal("(,2)");
      });

      it("handles upper bound infinite", function () {
        toPostgres(2, null, "()").should.equal("(2,)");
      });

      it("handles both bounds infinite", function () {
        toPostgres(null, null, "()").should.equal("(,)");
      });
    });

    describe("when given bounds with range syntax characters", function () {
      it("double quotes the offending bound", function () {
        toPostgres(",", 2, "[]").should.equal('[",",2]'); // jshint ignore:line
      });

      it("escapes quotes inside double-quoted bounds", function () {
        toPostgres('"', 2, "[]").should.equal('["\\"",2]'); // jshint ignore:line
      });

      it("escapes backslashes inside double-quoted bounds", function () {
        toPostgres("\\", 2, "[]").should.equal('["\\\\",2]'); // jshint ignore:line
      });
    });

    describe("when given an empty range", function () {
      it("returns empty range literal", function () {
        toPostgres().should.equal("empty");
      });
    });
  });
});
