# node-pg-range

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
  //   lower: Thu Mar 26 2014 17:57:02 GMT-0400 (EDT),
  //   upper: Thu Mar 27 2014 17:57:02 GMT-0400 (EDT),
  //   bounds: '[)'
  // }
});
```

Or go the other way:

```javascript
var Range = require("pg-range").Range;

client.query("INSERT INTO table VALUES ($1)", [Range(1, 3)]);
```

See the Postgres  ["Range Types" documentation][postgres-docs] for details.

### Range objects

Values of (PostgreSQL) type

* `int4range`
* `int8range`
* `numrange`
* `tsrange`
* `tstzrange`
* `daterange`

will be automatically parsed into instances of `Range`.

#### Construction

Finite integer range with default bounds:

```javascript
Range(1, 3)
```

Explicit bounds:

```javascript
Range(1, 3, "(]")
Range(1, 7, "()")
```

Date ranges:

```javascript
Range(new Date(2014, 0, 1), new Date(2014, 1, 1))
```

Infinite ranges:

```javascript
Range(1, null)
Range(null, 7)
Range(null, null)
```

Empty range:

```javascript
Range()
```

Range is a naive class; instances need not be valid PostgreSQL ranges or even
sensible. This is perfectly valid

```javascript
Range(-7, new Date(2014, 1, 1))
```

and won't fail until you try to use it in a query.

#### Properties

##### `lower` *varies*

The lower bound of the range.

The type depends on which parser you've registered for the component type. For
example, an `int4range` is made up of the `int4` type. By default, node-postgres
parses `int4`s to a JS numbers. But if you've overriden this parsing with
[pg-types][pg-types], pg-range respects this.

##### `upper` *varies*

The upper bound of the range. See `lower`.

##### `bounds` *string*

A string representing the exclusivity of the lower and upper bounds. A
parenthesis indicates an exclusive bound, while a square bracket indicates an
inclusive bound.

Valid values: `()`, `(]`, `[)`, `[]`


#### Methods

##### `toJSON`

Yields an object with the following properties:

```json
{
  "lower": "?",
  "upper": "?",
  "bounds": "?"
}
```


## Caveats

Range objects don't support any useful operators, like `contains`, `leftOf`,
`each`, etc. Maybe for 1.0?

[node-postgres]: https://github.com/brianc/node-postgres
[pg-types]: https://github.com/brianc/node-pg-types
[postgres-docs]: http://www.postgresql.org/docs/9.3/static/rangetypes.html
