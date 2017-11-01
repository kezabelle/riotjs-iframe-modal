.PHONY: default

default: riot ;

help:
	@echo "riot - compile riot tags"

riot:
	rm -f iframe-modal.js iframe-modal.no-css.js iframe-modal.css
	./node_modules/.bin/riot --ext html iframe-modal.tag.html --modular --check
	./node_modules/.bin/riot --ext html iframe-modal.tag.html --modular --compact
	./node_modules/.bin/riot --ext html iframe-modal.tag.html --export="css" --compact
	./node_modules/.bin/riot --ext html iframe-modal.tag.html --exclude="css" --modular --compact iframe-modal.no-css.js

