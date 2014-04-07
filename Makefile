FILES = $(shell find . -name '*.js' -not -path '*node_modules*')

check:
	jshint $(FILES)

test:
	mocha

test-watch:
	mocha --reporter min --watch --growl

.PHONY: jshint test test-watch
