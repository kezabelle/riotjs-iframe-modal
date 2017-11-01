
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {
riot.tag2('iframe-modal', '<yield></yield><div class="modal" if="{isOpen}"><div class="{overlay: true, finish: overlayLoaded}" onclick="{closeByOverlay}"><span class="{progress: true, finish: iframeLoaded}" if="{!closing}"><svg width="32px" height="32px" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100" preserveaspectratio="xMidYMid" style="background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;"><circle cx="50" cy="50" fill="none" stroke="#FFF" stroke-width="12" r="40" stroke-dasharray="188.49555921538757 64.83185307179586"><animatetransform attributename="transform" type="rotate" calcmode="linear" values="0 50 50;360 50 50" keytimes="0;1" dur="1s" begin="0s" repeatcount="indefinite"></animateTransform></circle></svg></span></div><div class="{header: true, finish: overlayLoaded}" onclick="{closeByOverlay}"><span class="header-close" onclick="{closeByX}" if="{allowCloseByX}">&times;</span></div><div class="{content: true, finish: iframeLoaded}"><iframe onload="{display}" class="{viewport: true, finish: iframeLoaded}" riot-src="{opts.href}"></iframe></div></div>', 'iframe-modal .modal,[data-is="iframe-modal"] .modal{ } iframe-modal .overlay,[data-is="iframe-modal"] .overlay{ width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 2000; background-color: #303030; overflow-y: hidden; opacity: 0; transition: opacity 350ms ease-in-out; cursor: default; } iframe-modal .overlay.finish,[data-is="iframe-modal"] .overlay.finish{ opacity: 0.65; } iframe-modal .progress,[data-is="iframe-modal"] .progress{ margin-top: 0.118rem; opacity: 1; display: inline-block; transition: opacity 350ms ease-in-out; position: fixed; top: calc(50% - 24px); left: calc(50% - 24px); } iframe-modal .progress.finish,[data-is="iframe-modal"] .progress.finish{ opacity: 0; } iframe-modal .header,[data-is="iframe-modal"] .header{ height: 2rem; position: fixed; top: 0; right: 0; left: 0; opacity: 0; overflow: hidden; background-color: #303030; color: #FFF; z-index: 2002; transform: translate(0, -2rem); transition: opacity 350ms ease-in-out, transform 200ms ease-in-out; cursor: default; text-align: center; } iframe-modal .header.finish,[data-is="iframe-modal"] .header.finish{ opacity: 0.9; transform: translate(0, 0); } iframe-modal .header-close,[data-is="iframe-modal"] .header-close{ font-size: 2rem; line-height: 1.75rem; display: inline-block; float: right; margin: 0 0.5rem 0 0; cursor: pointer; transition: transform 200ms ease-in-out; } iframe-modal .header-close:hover,[data-is="iframe-modal"] .header-close:hover{ transform: scale(1.5) } iframe-modal .content,[data-is="iframe-modal"] .content{ cursor: default; background-color: #FFF; height: 100%; max-height: 83%; position: fixed; top: calc(4% + 2rem); left: 10%; right: 10%; -webkit-box-shadow: 0 1rem 2.500rem -1rem rgba(0,0,0,1); -moz-box-shadow: 0 1rem 2.500rem -1rem rgba(0,0,0,1); box-shadow: 0 1rem 2.500rem -1rem rgba(0,0,0,1); z-index: 2001; opacity: 0; transform: translate(0, -100vh); transition: all 350ms ease-in-out; } iframe-modal .content.finish,[data-is="iframe-modal"] .content.finish{ opacity: 1; transform: translate(0, 0); } iframe-modal iframe,[data-is="iframe-modal"] iframe{ cursor: default; width: 100%; max-width: 100%; height: 100%; max-height: 100%; background-color: #FFF; border: 1px solid #FFF; }', 'onclick="{open}"', function(opts) {
    this.opening = false;
    this.closing = false;
    this.isOpen = false;
    this.overlayLoaded = false;
    this.iframeLoaded = false;
    this.allowCloseByOverlay = (this.opts.closeByOverlay !== void(0)) ?  this.opts.closeByOverlay : true;
    this.allowCloseByX = (this.opts.closeByX !== void(0)) ?  this.opts.closeByX : true;
    this.allowCloseByKeys = (Array.isArray(this.opts.closeByKeys) === true) ?  this.opts.closeByKeys : [27];

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

    this.display = function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.iframeLoaded = true;
        this.opening = false;
        this.closing = false;
    }.bind(this)

    this.postMessageListener = function(event) {
        const data = event.data;
        const _keys = Object.keys(data);
        if (_keys.indexOf('iframe-modal') > -1 && data['iframe-modal'] === 'close' && this.isOpen == true) {
            this.close(event);
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