# pg-parse-timeranges

Parser for PostgreSQL time ranges (`daterange`, `tsrange`, `tstzrange`).

## Usage

Load pg-parse-timeranges

```javascript
var pg = require("pg");
require("pg-parse-timeranges")(pg);
```

then make a query that returns range objects!

```javascript
client.query("SELECT range FROM table", function (result) {
  // result.range = {
  //   lower: Thu Mar 26 2014 17:57:02 GMT-0400 (EDT),
  //   upper: Thu Mar 27 2014 17:57:02 GMT-0400 (EDT),
  //   bounds: '[)'
  // }
});
```

See the [Postgres "Range Types" documentation][postgres-docs] for details.

### Range objects

The types the range is made of (either `date`, `timestamp`, or `timestamptz`)
are parsed using whatever parser you've registered for that type. That is, the
types of `lower` and `upper` will vary based on the parser you've registered.

By default, node-postgres parses all date/time types to instances of the built-
in `Date` object.

##### `lower` *Date* | *custom*

##### `upper` *Date* | *custom*

##### `bound` *string*

A string representing the exclusivity of the lower and upper bounds. A
parenthesis indicates an exclusive bound, while a square bracket indicates an
inclusive bound.

Valid values: `()`, `(]`, `[)`, `[]`


## Caveats

Doesn't support coercing range objects on insertion. But the range functions
are pretty convenient:

```javascript
client.query("INSERT INTO table VALUES (tsrange($1, $2, $3))", [
  new Date("..."),
  new Date("..."),
  "[)"
])
```

[postgres-docs]: http://www.postgresql.org/docs/9.3/static/rangetypes.html
