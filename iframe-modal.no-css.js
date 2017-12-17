
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
riot.tag2('iframe-modal', '<yield></yield><div class="modal" if="{isOpen}"><div class="overlay {finish: overlayLoaded}" onclick="{closeByOverlay}"><span class="progress {finish: iframeLoaded}" if="{!closing}"><svg width="32px" height="32px" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100" preserveaspectratio="xMidYMid" style="background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;"><circle cx="50" cy="50" fill="none" stroke="#FFF" stroke-width="12" r="40" stroke-dasharray="188.49555921538757 64.83185307179586"><animatetransform attributename="transform" type="rotate" calcmode="linear" values="0 50 50;360 50 50" keytimes="0;1" dur="1s" begin="0s" repeatcount="indefinite"></animateTransform></circle></svg></span></div><div class="header {finish: overlayLoaded}" onclick="{closeByOverlay}" if="{allowCloseByX}"><span class="header-close" onclick="{closeByX}">&times;</span></div><div class="content {finish: iframeLoaded}" ref="viewportWrapper" riot-style="{modalHeight}"><iframe ref="viewport" onload="{display}" riot-style="{modalHeight}" class="viewport {finish: iframeLoaded}" riot-src="{opts.href}"></iframe></div></div>', '', 'onclick="{open}"', function(opts) {
    this.opening = false;
    this.closing = false;
    this.isOpen = false;
    this.overlayLoaded = false;
    this.iframeLoaded = false;
    this.allowCloseByOverlay = (this.opts.closeByOverlay !== void(0)) ?  this.opts.closeByOverlay : true;
    this.allowCloseByX = (this.opts.closeByX !== void(0)) ?  this.opts.closeByX : true;
    this.allowCloseByKeys = (Array.isArray(this.opts.closeByKeys) === true) ?  this.opts.closeByKeys : [27];
    this.modalHeight = {};

    this.open = function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.opening = true;
        this.closing = false;
        this.isOpen = true;
        this.configureExternalListeners();

        const that = this;
        setTimeout(function() {
            that.overlayLoaded = true;
            that.update();
        }, 16);
    }.bind(this)
    this.close = function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.opening = false;
        this.closing = true;
        this.overlayLoaded = false;
        this.iframeLoaded = false;
        this.unconfigureExternalListeners();

        const that = this;
        setTimeout(function() {
            that.isOpen = false;
            that.update();
        }, 350);
    }.bind(this)
    this.closeByOverlay = function(event) {
        if (this.allowCloseByOverlay) {
            this.close(event);
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    }.bind(this)
    this.closeByX = function(event) {
        if (this.allowCloseByX) {
            this.close(event);
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    }.bind(this)
    this.closeByEscape = function(event) {
        if (this.allowCloseByKeys.indexOf(event.which) > -1) {
            this.close(event);

            this.update();
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    }.bind(this)

    this.resize = function(event) {
        const viewport = this.refs.viewport;
        const viewportDoc = viewport.contentDocument? viewport.contentDocument: viewport.contentWindow.document;
        const body = viewportDoc.body;
        const html = viewportDoc.documentElement;
        const heights = [body.scrollHeight, body.offsetHeight,
                         html.scrollHeight, html.offsetHeight];
        const height = Math.min.apply(null, heights);
        this.modalHeight = {
            'height': (height + 10) + 'px'
        };
    }.bind(this)

    this.display = function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.iframeLoaded = true;
        this.opening = false;
        this.closing = false;
        this.resize(event);
    }.bind(this)

    this.postMessageListener = function(event) {
        const data = event.data;
        const _keys = Object.keys(data);
        if (_keys.indexOf('iframe-modal') > -1) {
            if (data['iframe-modal'] === 'close' && this.isOpen == true) {
                this.close(event);
            } else if (data['iframe-modal'] === 'autosize') {
                this.resize(event);
            }
        }

    }.bind(this)

    this.configureExternalListeners = function() {
        const doc = this.root.getRootNode();
        const window = doc.defaultView || void(0);
        if (window !== void(0)) {
            window.addEventListener('message', this.postMessageListener, false);
        }
        if (doc !== void(0)) {
            doc.addEventListener('keyup', this.closeByEscape, false);
        }
    }.bind(this)
    this.unconfigureExternalListeners = function() {
        const doc = this.root.getRootNode();
        const window = doc.defaultView || void(0);
        if (window !== void(0)) {
            window.removeEventListener('message', this.postMessageListener, false);
        }
        if (doc !== void(0)) {
            doc.removeEventListener('keyup', this.closeByEscape, false);
        }
    }.bind(this)

    this.on('mount', function() {
    });
    this.on('unmount', function() {
        this.unconfigureExternalListeners();
    });
});
});