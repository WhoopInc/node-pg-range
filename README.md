# node-pg-range

<a href="https://travis-ci.org/WhoopInc/node-pg-range">
  <img src="https://travis-ci.org/WhoopInc/node-pg-range.svg?branch=master"
    align="right">
</a>

Range type support for [node-postgres][node-postgres].

## Usage

Install pg-range into your existing [pg][node-postgres] adapter:

```javascript
var pg = require("pg");
require("pg-range").install(pg);
```

Then make a query that returns range objects!

```javascript
client.query("SELECT range FROM table", function (result) {
  // result.range = {
  //   begin: Thu Mar 26 2014 17:57:02 GMT-0400 (EDT),
  //   end: Thu Mar 27 2014 17:57:02 GMT-0400 (EDT),
  //   bounds: '[)'
  // }
});
```

Or make a query that inserts range objects:

```javascript
var Range = require("pg-range").Range;

client.query("INSERT INTO table VALUES ($1)", [Range(1, 3)]);
```

See the Postgres ["Range Types" documentation][postgres-docs] for details.

### Range objects

pg-range uses [stRange.js][strange], a JavaScript range library, to provide a
`Range` class with useful methods, like `contains` and `intersects`.
See the [stRange.js API documentation][strange-docs].

Values of (PostgreSQL) type

* `int4range`
* `int8range`
* `numrange`
* `tsrange`
* `tstzrange`
* `daterange`

will be automatically parsed into instances of `Range` when the pg-range
type adapter is installed.

**Warning:** When constructing range objects for use in queries, use the
pg-range `Range` constructor as shown above, and not raw stRange.js
`Range` objects. Raw stRange.js objects do not provide a `toPostgres`
method, and will not properly serialize date ranges and empty ranges in
queries!

[node-postgres]: https://github.com/brianc/node-postgres
[pg-types]: https://github.com/brianc/node-pg-types
[postgres-docs]: http://www.postgresql.org/docs/9.3/static/rangetypes.html
[strange]: https://github.com/moll/js-strange
[strange-docs]: https://github.com/moll/js-strange/blob/master/doc/API.md
