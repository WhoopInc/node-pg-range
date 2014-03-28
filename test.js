var _ = require("lodash")
  , assert = require("assert")
  , async = require("async")
  , ok = require("okay")
  , pg = require("pg");

// Ensure node-postgres parses `timestamp without tz` as UTC
process.env.TZ = "UTC";

require(__dirname)(pg);

var dates = {
  tsrangeLower:   new Date(Date.UTC(1999, 0, 8, 4, 5, 6)),
  tsrangeUpper:   new Date(Date.UTC(1999, 0, 9, 12, 5, 6)),
  tsrangeBounds:  "[)",
  tstzrangeLower: new Date(Date.UTC(2001, 0, 8, 4, 5, 6)),
  tstzrangeUpper: new Date(Date.UTC(2001, 0, 9, 12, 5, 6)),
  tstzrangeBounds: "[]",
  daterangeLower: new Date(Date.UTC(1999, 0, 8)),
  daterangeUpper: new Date(Date.UTC(1999, 0, 10)),
  dateRangeBounds: "[)",
};

before(function (done) {
  var client = this.client = new pg.Client();
  client.connect();

  async.eachSeries([
      "SET TIMEZONE TO UTC",
      "CREATE TEMP TABLE rangez(tsrange tsrange, tstzrange tstzrange, daterange daterange)"
    ],
    function (query, callback) {
      client.query(query, callback);
    },
    done
  );
});

describe("it should parse time ranges into range objects", function () {
  beforeEach(function (done) {
    var client = this.client;
    var self = this;

    client.query(
      "INSERT INTO rangez(tsrange, tstzrange, daterange) VALUES(tsrange($1, $2, $3), tstzrange($4, $5, $6), daterange($7, $8, $9))",
      _.values(dates),
      done
    );

    client.query("SELECT * FROM rangez", ok(function (result) {
      assert(result, "should have returned result");
      assert(result.rows, "result should have rows");
      assert.equal(result.rows.length, 1, "should have 1 row but returned " + result.rows.length);
      self.row = result.rows.pop();
      done();
    }));
  });

  it("should parse tsranges into range objects", function () {
    assert.strictEqual(this.row.tsrange.lower.valueOf(), dates.tsrangeLower.valueOf());
    assert.strictEqual(this.row.tsrange.upper.valueOf(), dates.tsrangeUpper.valueOf());
    assert.strictEqual(this.row.tsrange.bounds, dates.tsrangeBounds);
  });

  it("should parse tstzranges into range objects", function () {
    assert.strictEqual(this.row.tstzrange.lower.valueOf(), dates.tstzrangeLower.valueOf());
    assert.strictEqual(this.row.tstzrange.upper.valueOf(), dates.tstzrangeUpper.valueOf());
    assert.strictEqual(this.row.tstzrange.bounds, dates.tstzrangeBounds);
  });

  it("should parse dateranges into range objects", function () {
    assert.strictEqual(this.row.daterange.lower.valueOf(), dates.daterangeLower.valueOf());
    assert.strictEqual(this.row.daterange.upper.valueOf(), dates.daterangeUpper.valueOf());
    assert.strictEqual(this.row.daterange.bounds, dates.tsrangeBounds);
  });
});

after(function (done) {
  this.client.on("end", done);
  this.client.end();
});
