module.exports = function (pg) {
  var RANGE_MATCHER = /(\[|\()("((?:\\"|[^"])*)"|[^"]*),("((?:\\"|[^"])*)"|[^"]*)(\]|\))/;

  var types = {
    DATE:        1082,
    TIMESTAMP:   1114,
    TIMESTAMPTZ: 1184,
    DATERANGE:   3912,
    TSRANGE:     3908,
    TSTZRANGE:   3910
  };

  function parseRangeSegment(whole, quoted) {
    if (quoted) {
      return quoted.replace(/\\(.)/g, '$1');
    }
    return whole;
  }

  function makeRangeParser(dateType) {
    var parseDate = pg.types.getTypeParser(dateType, "text");

    return function parseRange(val) {
      var matches = val.match(RANGE_MATCHER);

      if (!matches) {
        // empty
        return {
          "lower": null,
          "upper": null,
          "bounds": null
        };
      }

      var bounds = matches[1] + matches[6];
      var lower = parseRangeSegment(matches[2], matches[3]);
      var upper = parseRangeSegment(matches[4], matches[5]);

      return {
        "lower": parseDate(lower),
        "upper": parseDate(upper),
        "bounds": bounds
      };
    };
  }

  pg.types.setTypeParser(types.DATERANGE, makeRangeParser(types.DATE));
  pg.types.setTypeParser(types.TSRANGE,   makeRangeParser(types.TIMESTAMP));
  pg.types.setTypeParser(types.TSTZRANGE, makeRangeParser(types.TIMESTAMPTZ));
};
