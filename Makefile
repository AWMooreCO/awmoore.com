install:
	@npm install
	@bower install

clean:
	@rm -rf build

build: clean
	@node build.js

serve: build

publish: build

uninstall: clean
	@rm -rf bower_components
	@rm -rf node_modules

.PHONY: install clean build serve publish uninstall
