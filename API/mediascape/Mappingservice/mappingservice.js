define(["socketio"], function (io) {
    /**
     *
     */
    var MappingService = function (url, options) {

        var _connection = null;

        var self = {};

        // READY STATE for Shared State
        var STATE = Object.freeze({
            CONNECTING: "connecting",
            OPEN: "open",
            CLOSED: "closed"
        });

        if (typeof url === 'object') {
            var options = url;
            url = {};
            console.log('options', options);
        }

        // Event Handlers
        var _callbacks = {
            'readystatechange': []
        };
        /* <!-- defaults */
        if (!options) {
            var options = {};
        }

        options.forceNew = true;
        options.multiplex = false;

        var connectURL = url || {};
        /* defaults --> */

        var waitingUserPromises = [];
        var waitingGroupPromises = [];

        /* <!-- internal functions */
        var _init = function () {

            _connection = io(connectURL, options);
            _connection.on('connect', onConnect);
            readystate.set('connecting');
            _connection.on('mapping', onMapping)
            if (_connection.connected === true) {
                onConnect();
            }

        };

        var onConnect = function () {
            readystate.set('open');
        };

        var onMapping = function (response) {
            var host = url;
            
            if (typeof url === 'object' || !url) {
                var host = window.location.protocol + '//' + window.location.host + '/';
            }
            if (!response.group) {
                var result = {}
                if (response.user) {
                    result.user = host + response.user;
                }
                if (response.app) {
                    result.app = host + response.app;
                }
                if (response.userApp) {
                    result.userApp = host + response.userApp;
                }


                if (waitingUserPromises.length > 0) {
                    promise = waitingUserPromises.pop();
                    promise(result);
                }
            } else {
                var result = {
                    group: host + response.group
                }
                if (waitingGroupPromises.length > 0) {
                    promise = waitingGroupPromises.pop();
                    promise(result);
                }
            }
        };

        /* 
			Internal method for invoking callback handlers
			
			Handler is only supplied if on one specific callback is to used.
			This is helpful for supporting "immediate events", i.e. events given directly
			after handler is registered - on("change", handler);

			If handler is not supplied, this means that all callbacks are to be fired.
			This function is also sensitive to whether an "immediate event" has already been fired
			or not. See callback registration below.
        */
        var _do_callbacks = function (what, e, handler) {
            if (!_callbacks.hasOwnProperty(what)) throw "Unsupported event " + what;
            var h;
            for (i = 0; i < _callbacks[what].length; i++) {
                h = _callbacks[what][i];
                if (handler === undefined) {
                    // all handlers to be invoked, except those with pending immeditate
                    if (h._immediate_pending) {
                        continue;
                    }
                } else {
                    // only given handler to be called
                    if (h === handler) handler._immediate_pending = false;
                    else {
                        continue;
                    }
                }
                try {
                    h.call(self, e);
                } catch (e) {
                    _error("Error in " + what + ": " + h + ": " + e);
                }
            }
        };

        /*
			READYSTATE

			encapsulate protected property _readystate by wrapping 
			getter and setter logic around it.
			Closure ensures that all state transfers must go through set function.
			Possibility to implement verification on all attempted state transferes 
			Event

  		*/
        var readystate = function () {
            var _readystate = STATE["CONNECTING"];
            // accessors  
            return {
                set: function (new_state) {
                    // check new state value
                    found = false;
                    for (key in STATE) {
                        if (!STATE.hasOwnProperty(key)) continue;
                        if (STATE[key] === new_state) found = true;
                    }
                    if (!found) throw "Illegal state value " + new_state;
                    // check state transition
                    if (_readystate === STATE["CLOSED"]) return; // never leave final state
                    // perform state transition
                    if (new_state !== _readystate) {
                        _readystate = new_state;
                        // trigger events
                        _do_callbacks("readystatechange", new_state);
                    }
                },
                get: function () {
                    return _readystate;
                }
            };
        }();

        var getUserMapping = function (appId, scopeList) {
            if (appId && Array.isArray(scopeList)) {
                var request = {
                    appId: appId
                };
                for (var i = 0, len = scopeList.length; i < len; i++) {
                    if (scopeList[i] === 'user') {
                        request.user = true;
                    }
                    if (scopeList[i] === 'app') {
                        request.app = true;
                    }
                    if (scopeList[i] === 'userApp') {
                        request.userApp = true;
                    }
                }
                if (options.userId) {
                    request.userId = options.userId;
                }
                _connection.emit('getMapping', request);
            } else {
                throw 'appId or scopeList undefined';
            }
            return new Promise(function (fulfill, reject) {
                waitingUserPromises.push(function (data) {
                    fulfill(data);
                });
                setTimeout(function () {
                    reject({
                        error: 'timeout'
                    })
                }, 2000);
            });
        };

        var getGroupMapping = function (groupId) {
            if (groupId) {
                var request = {
                    groupId: groupId
                };
                _connection.emit('getMapping', request);
            } else {
                throw 'groupId undefined';
            }
            return new Promise(function (fulfill, reject) {
                waitingGroupPromises.push(function (data) {
                    fulfill(data);
                });
                setTimeout(function () {
                    reject({
                        error: 'timeout'
                    })
                }, 2000);
            });
        };

        /**
         * registers a function on event, function gets called immediatly
         * @method on
         * @param {string} what change || presence || readystatechange
         * @param {function} handler the function to call on event
         * @returns {Object} SharedState
         * @memberof SharedState
         */
        /*
		    register callback

			The complexity of this method arise from the fact that we are to give 
			an "immediate callback" to the given handler. 

			In addition, I do not want to do so directly within the on() method. 

			As a programmer I would like to ensure that initialisation of an object 
			is completed BEFORE the object needs to process any callbacks from the 
			external world. This can be problematic if the object depends on events 
			from multiple other objects. For example, the internal initialisation code
			needs to register handlers on external objects a and b.

			a.on("event", internal_handler_a);
			b.on("event", internal_handler_b);
			
			However, if object a gives an callback immediately within on, this callback 
			will be processed BEFORE we have completed initialisation, i.e., any code 
			subsequent to a.on).

			It is quite possible to make this be correct still, but I find nested handler 
			invocation complicated to think about, and I prefer to avoid the problem.
			Therefore I like instead to make life easier by delaying "immediate callbacks" 
			using 

			setTimeout(_do_callbacks("event", e, handler), 0); 
			
			This however introduces two new problems. First, if you do :
			
			o.on("event", handler);
			o.off("event", handler);
			
			you will get the "immediate callback" after off(), which is not what you 
			expect. This is avoided by checking that the given handler is indeed still 
			registered when executing _do_callbacks(). Alternatively one could cancel the 
			timeout within off().

			Second, with the handler included in _callbacks[what] it is possible to receive 
			event callbacks before the delayed "immediate callback" is actually invoked.
			This breaks the expectation the the "immediate callback" is the first callback.
			This problem is avoided by flagging the callback handler with ".immediate_pending"
			and dropping notifications that arrive before the "immediate_callback has executed".
			Note however that the effect of this dropped notification is not lost. The effects
			are taken into account when we calculate the "initial state" to be reported by the 
			"immediate callback". Crucially, we do this not in the on() method, but when the 
			delayed "immediate callback" actually is processed. 
	    */

        var on = function (what, handler) {
            if (!handler || typeof handler !== "function") throw "Illegal handler";
            if (!_callbacks.hasOwnProperty(what)) throw "Unsupported event " + what;
            var index = _callbacks[what].indexOf(handler);
            if (index === -1) {
                // register handler
                _callbacks[what].push(handler);
                // flag handler
                handler._immediate_pending = true;
                // do immediate callback
                setTimeout(function () {
                    switch (what) {
                    case 'readystatechange':
                        _do_callbacks("readystatechange", readystate.get(), handler);
                        break;
                    }
                }, 0);
            }
            return self;
        };

        /**
         * deregisters a function on event
         * @method off
         * @param {string} what change || presence || readystatechange
         * @param {function} handler the function to call on event
         * @returns {Object} SharedState
         * @memberof SharedState
         */
        // unregister callback
        var off = function (what, handler) {
            if (_callbacks[what] !== undefined) {
                var index = _callbacks[what].indexOf(handler);
                if (index > -1) {
                    _callbacks[what].splice(index, 1);
                }
            }
            return self;
        };

        /* API functions --> */


        /* <!-- public */
        self.__defineGetter__("readyState", readystate.get);
        self.__defineGetter__("STATE", function () {
            return STATE;
        });


        self.getUserMapping = getUserMapping;
        self.getGroupMapping = getGroupMapping;

        self.on = on;
        self.off = off;

        /* public --> */

        _init();

        return self;
    }
    MappingService.__moduleName = "mappingService";

    return MappingService;
});