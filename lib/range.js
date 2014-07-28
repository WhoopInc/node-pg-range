var util = require("util");

var VALID_BOUNDS = ["[]", "[)", "(]", "()"];

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

function Range(lower, upper, bounds) {
  if (!(this instanceof Range)) {
    return new Range(lower, upper, bounds);
  }

  if (!lower && !upper && !bounds) {
    this.empty = true;
    return;
  }

  bounds = bounds || "[)";
  if (VALID_BOUNDS.indexOf(bounds) === -1) {
    throw new Error(util.format("invalid bounds: %s", bounds));
  }

  this.lower = lower;
  this.upper = upper;
  this.bounds = bounds;
}

Range.prototype.toPostgres = function (prepare) {
  if (this.empty) {
    return "empty";
  }

  return util.format("%s%s,%s%s",
    this.bounds[0],
    formatBound(this.lower, prepare),
    formatBound(this.upper, prepare),
    this.bounds[1]);
};

Range.prototype.toJSON = function () {
  if (this.empty) {
    return { lower: null, upper: null, bounds: null };
  }
  return {
    lower: this.lower,
    upper: this.upper,
    bounds: this.bounds
  };
};

module.exports = Range;
