//main javascript
(function init() {
    // If we need to load requirejs before loading butter, make it so
    if (typeof define === "undefined") {
        var rscript = document.createElement("script");
        rscript.onload = function () {
            init();
        };
        rscript.src = "require.js";
        document.head.appendChild(rscript);
        return;
    }

    require.config({
        baseUrl: 'js/',
        paths: {
			jquery: 'lib/jquery-2.1.3.min',	
			ui:'lib/jquery-ui',						
			bootstrap: 'lib/bootstrap.min',    			
			underscore:'lib/underscore-min',
            socketio: '/socket.io/socket.io',
            shake: 'lib/shake',
			namedwebsockets: 'lib/namedwebsockets'
        }
    });

    // Start the main app logic.
    define("mediascape", ["mediascape/Agentcontext/agentcontext",
						  "mediascape/Discovery/discovery",
                          "mediascape/Discovery/discovery_wp4",
                          "mediascape/Sharedstate/sharedstate",
                          "mediascape/Mappingservice/mappingservice",
                          "mediascape/Applicationcontext/applicationcontext",
						  "mediascape/AdaptationToolkit/AdaptationToolkit"], function ($, Modules) {

        //creation of mediascape and discovery objects.
        var mediascape = {};
        var moduleList = Array.prototype.slice.apply(arguments);
        mediascape.init = function (options) {
            mediascapeOptions = {};
            _this = Object.create(mediascape);
            for (var i = 0; i < moduleList.length; i++) {					
                var name = moduleList[i].__moduleName;	
                var dontCall = ['sharedState', 'mappingService', 'applicationContext'];
                if (dontCall.indexOf(name) === -1) {
                    mediascape[name] = new moduleList[i](mediascape, "gq" + i, mediascape);
                } else {
                    mediascape[name] = moduleList[i];
                }
            }
            return _this;
        };

        mediascape.version = "0.0.1";

        // See if we have any waiting init calls that happened before we loaded require.
        if (window.mediascape) {
            var args = window.mediascape.__waiting;
            delete window.mediascape;
            if (args) {
                mediascape.init.apply(this, args);
            }
        }

        window.mediascape = mediascape;

        //return of mediascape object with discovery and features objects and its functions
        return mediascape;
    });
    require(["mediascape"], function (mediascape) {
        mediascape.init();
        /**
         *
         *  Polyfill for custonevents
         */
        (function () {
            function CustomEvent(event, params) {
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            };
            CustomEvent.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent;
        })();
        var event = new CustomEvent("mediascape-ready", {
            "detail": {
                "loaded": true
            }
        });
        document.dispatchEvent(event);
    });
}());
