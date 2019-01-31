/* global should */

var pg = require("pg")
  , Range = require("..").Range;

require("..").install(pg);

function val(object) {
  if (object) {
    return object.valueOf();
  }
  return object;
}

describe("acceptance", function () {
  var client;

  before(function () {
    client = new pg.Client();
    client.connect();
  });

  after(function() {
    client.end();
  })

  function create(type, done) {
    client.query("CREATE TEMP TABLE ranges (range " + type + ")", done);
  }

  function roundtrip(rangeIn, rangeOut, done) {
    client.query("INSERT INTO ranges VALUES ($1)", [rangeIn], function (err, result) {
      if (err) {
        throw err;
      }

      client.query("SELECT * FROM ranges", function (err, result) {
        if (err) {
          throw err;
        }

        var row = result.rows.pop();
        row.range.should.be.an.instanceOf(Range);
        should.equal(val(row.range.lower), val(rangeOut.lower));
        should.equal(val(row.range.upper), val(rangeOut.upper));
        should.equal(val(row.range.bounds), val(rangeOut.bounds));
        done();
      });
    });
  }

  function drop(done) {
    client.query("DROP TABLE ranges", done);
  }

  describe("when given an int4range", function () {
    before(function (done) {
      create("int4range", done);
    });

    it("should handle finite ranges", function (done) {
      roundtrip(Range(0, 7, "[)"), Range(0, 7, "[)"), done);
    });

    it("should handle empty ranges", function (done) {
      roundtrip(Range(), Range(), done);
    });

    it("should handle infinite ranges", function (done) {
      roundtrip(Range(null, 2, "()"), Range(null, 2, "()"), done);
    });

    after(function (done) {
      drop(done);
    });
  });

  describe("when given an int8range", function () {
    before(function (done) {
      create("int8range", done);
    });

    it("should handle finite ranges", function (done) {
      roundtrip(Range(0, 7, "[)"), Range("0", "7", "[)"), done);
    });

    it("should handle empty ranges", function (done) {
      roundtrip(Range(), Range(), done);
    });

    it("should handle infinite ranges", function (done) {
      roundtrip(Range(null, "2", "()"), Range(null, "2", "()"), done);
    });

    after(function (done) {
      drop(done);
    });
  });

  describe("when given a numrange", function () {
    before(function (done) {
      create("numrange", done);
    });

    it("should handle finite ranges", function (done) {
      roundtrip(Range(0.3, 7.2, "[)"), Range("0.3", "7.2", "[)"), done);
    });

    it("should handle empty ranges", function (done) {
      roundtrip(Range(), Range(), done);
    });

    it("should handle infinite ranges", function (done) {
      roundtrip(Range(2, null, "()"), Range("2", null, "()"), done);
    });

    after(function (done) {
      drop(done);
    });
  });

  describe("when given a tsrange", function () {
    before(function (done) {
      create("tsrange", done);
    });

    it("should handle finite ranges", function (done) {
      var range = Range(
        new Date(2013, 1, 14, 7, 45, 30, 12),
        new Date(2013, 2, 14, 3, 45, 30, 12),
        "[)");
      roundtrip(range, range, done);
    });

    it("should handle empty ranges", function (done) {
      roundtrip(Range(), Range(), done);
    });

    it("should handle infinite ranges", function (done) {
      var range = Range(
        new Date(2013, 1, 14, 7, 45, 30, 12),
        null,
        "[)");
      roundtrip(range, range, done);
    });

    after(function (done) {
      drop(done);
    });
  });

  describe("when given a tstzrange", function () {
    before(function (done) {
      create("tstzrange", done);
    });

    it("should handle finite ranges", function (done) {
      var range = Range(
        new Date(2013, 1, 14, 7, 45, 30, 12),
        new Date(2013, 2, 14, 3, 45, 30, 12),
        "[)");
      roundtrip(range, range, done);
    });

    it("should handle empty ranges", function (done) {
      roundtrip(Range(), Range(), done);
    });

    it("should handle infinite ranges", function (done) {
      var range = Range(
        new Date(2013, 1, 14, 7, 45, 30, 12),
        null,
        "[)");
      roundtrip(range, range, done);
    });

    after(function (done) {
      drop(done);
    });
  });

  describe("when given a daterange", function () {
    before(function (done) {
      create("daterange", done);
    });

    it("should handle finite ranges", function (done) {
      var range = Range(
        new Date(2013, 1, 14),
        new Date(2013, 2, 14),
        "[)");
      roundtrip(range, range, done);
    });

    it("should handle empty ranges", function (done) {
      roundtrip(Range(), Range(), done);
    });

    it("should handle infinite ranges", function (done) {
      var range = Range(
        new Date(2013, 1, 14),
        null,
        "[)");
      roundtrip(range, range, done);
    });

    after(function (done) {
      drop(done);
    });
  });
});
