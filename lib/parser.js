var _ = require("lodash")
  , Range = require("./range");

var RANGE_MATCHER = /(\[|\()("((?:\\"|[^"])*)"|[^"]*),("((?:\\"|[^"])*)"|[^"]*)(\]|\))/;

var oids = {
  INTEGER: 23,
  BIGINT: 20,
  NUMERIC: 1700,
  TIMESTAMP: 1114,
  TIMESTAMPTZ: 1184,
  DATE: 1082,

  INT4RANGE: 3904,
  INT8RANGE: 3926,
  NUMRANGE: 3906,
  TSRANGE: 3908,
  TSTZRANGE: 3910,
  DATERANGE: 3912,
};

function parseRangeSegment(whole, quoted) {
  if (quoted) {
    return quoted.replace(/\\(.)/g, "$1");
  }
  if (whole === "") {
    return null;
  }
  return whole;
}

function parseRange(parseBound, rangeLiteral) {
  var matches = rangeLiteral.match(RANGE_MATCHER);

  if (!matches) {
    // empty
    return Range();
  }

  var bounds = matches[1] + matches[6];
  var lower = parseRangeSegment(matches[2], matches[3]);
  var upper = parseRangeSegment(matches[4], matches[5]);

  return Range(
    lower ? parseBound(lower) : null,
    upper ? parseBound(upper) : null,
    bounds);
}

function install(pg, rangeOid, subtypeOid) {
  var subtypeParser;

  if (!rangeOid && !subtypeOid) {
    install(pg, oids.INT4RANGE, oids.INTEGER);
    install(pg, oids.INT8RANGE, oids.BIGINT);
    install(pg, oids.NUMRANGE, oids.NUMERIC);
    install(pg, oids.TSRANGE, oids.TIMESTAMP);
    install(pg, oids.TSTZRANGE, oids.TIMESTAMPTZ);
    install(pg, oids.DATERANGE, oids.DATE);
  }

  subtypeParser = pg.types.getTypeParser(subtypeOid, "text");
  pg.types.setTypeParser(rangeOid, _.partial(parseRange, subtypeParser));
}

module.exports = {
  install: install,
  parseRange: parseRange
};
