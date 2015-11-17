var Range = require("strange")
  , util = require("util");

function formatBound(value, prepare) {
  if (value === null) {
    return "";
  }

  value = prepare(value);
  if (/[()[\],"\\]/.test(value)) {
    // quote bound only if necessary
    value = "\"" + value.replace(/(\\|")/, "\\$1") + "\"";
  }
  return value;
}

function PGRange(begin, end, bounds) {
  if (!(this instanceof PGRange)) {
    return new PGRange(begin, end, bounds);
  }
  Range.call(this, begin, end, bounds);
}

util.inherits(PGRange, Range);

PGRange.prototype.toPostgres = function (prepare) {
  if (this.isEmpty()) {
    return "empty";
  }

  return util.format("%s%s,%s%s",
    this.bounds[0],
    formatBound(this.begin, prepare),
    formatBound(this.end, prepare),
    this.bounds[1]);
};

module.exports = PGRange;
