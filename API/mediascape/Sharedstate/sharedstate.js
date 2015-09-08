define(["socketio"], function (io) {
    /**
     * @class SharedState
     * @classdesc JavaScript Library for the MediaScape SharedState
     * @param {string} url URL for the WS connection. if(!url) it tryes to connect to the server wich hosts the socket.io.js
     * @param {string} token the connection token
     * @param {Object} options
     * @param {boolean} [options.reconnection] if the Client should try to reconnect,Default = true
     * @param {boolean} [options.agentid] the AgentID to use, Default = random()
     * @param {boolean} [options.getOnInit] get all Keys from the Server on init(), Default = true
     * @param {boolean} [options.logStateInterval] logs the sharedState every 5sec to the console, Default = false
     * @param {boolean} [options.logToConsole] if things should get logged to console, Default = false
     * @param {boolean} [options.autoPresence] set presence to "online" on connect, Default = true
     * @returns {Object} SharedState
     * @author Andreas Bosl <bosl@irt.de>
     * @copyright 2014 Institut für Rundfunktechnik GmbH, All rights reserved.
     *
     */
    var SharedState = function (url, options) {
        var _connection = null;

        var self = {};

        // READY STATE for Shared State
        var STATE = Object.freeze({
            CONNECTING: "connecting",
            OPEN: "open",
            CLOSED: "closed"
        });

        // Event Handlers
        var _callbacks = {
            'change': [],
            'remove': [],
            'readystatechange': [],
            'presence': []
        };

        var _sharedStates = {};

        var _presence = {};
        var _request = false;

        var _stateChanges = {};


        var _log = function (text, datagram) {
            if (options.logToConsole === true) {
                console.info(text, datagram);
            }
        };

        var _error = function (text, datagram) {
            if (options.logToConsole === true) {
                console.error(text, datagram);
            }
        };

        /* <!-- defaults */
        options = options || {};
        if (options instanceof String) {
            options = {};
        }
        if (options.reconnection !== false) {
            options.reconnection = true;
        }
        if (!options.agentid) {
            _log('SHAREDSTATE - agentID undefined, generating one for this session');
            options.agentid = (Math.random() * 999999999).toFixed(0);
        }
        if (options.getOnInit !== false) {
            options.getOnInit = true;
        }

        if (options.autoPresence !== false) {
            options.autoPresence = true;
        }
        if (options.autoClean !== true) {
            options.autoClean = false;
        }
        options.forceNew = true;
        options.multiplex = false;

        url = url || {};
        /* defaults --> */



        if (options.logStateInterval === true) {
            setInterval(function () {
                _log('SharedSate(' + url + '):', _sharedStates);
            }, 5000);
        }


        /* <!-- internal functions */
        var _init = function () {


            _connection = io(url, options);
            _connection.on('connect', onConnect);
            _connection.on('disconnect', onDisconnect);

            _connection.on('joined', onJoined);
            _connection.on('status', onStatus);
            _connection.on('changeState', onChangeState);
            _connection.on('initState', onInitState);

            _connection.on('ssError', onError);
            readystate.set('connecting');


            if (_connection.connected === true) {
                onConnect();
            }

        };

        var onError = function (data) {
            _error('SharedState-error', data);
        };

        var onConnect = function () {
            if (_connection.connected === true) {
                readystate.set('connecting');
                var datagram = {
                    agentID: options.agentid
                };
                if (options.userId) {
                    datagram.userId = options.userId;
                }
                _sendDatagram('join', datagram);
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
                    if (h._ctx) {
                        h.call(h._ctx, e);
                    } else {
                        h.call(self, e);
                    }
                } catch (e) {
                    _error("Error in " + what + ": " + h + ": " + e);
                }
            }
        };
        /* internal functions --> */


        /* <!-- incoming socket functions */
        var onStatus = function (datagram) {
            _log('SHAREDSTATE - got "status"', datagram);
            for (var i = 0; i < datagram.presence.length; i++) {
                if (datagram.presence[i].key && (JSON.stringify(_presence[datagram.presence[i].key]) != JSON.stringify(datagram.presence[i].value || !_presence[datagram.presence[i].key]))) {
                    var presence = {
                        key: datagram.presence[i].key,
                        value: datagram.presence[i].value || undefined
                    };
                    _presence[datagram.presence[i].key] = datagram.presence[i].value;
                    _do_callbacks('presence', presence);
                } else {
                    _log('SHAREDSTATE - reveived "presence" already saved or something wrong', datagram.presence[i]);
                }

            }
        };

        var onDisconnect = function () {
            readystate.set('connecting');
            _log('SHAREDSTATE - got "disconnected"');
        };


        var onChangeState = function (datagram) {
            _log('SHAREDSTATE - got "changeState"', datagram);

            datagram = datagram || {};


            for (var i = 0; i < datagram.length; i++) {
                if (datagram[i].type == 'set') {
                    if (datagram[i].key && JSON.stringify(_sharedStates[datagram[i].key]) != JSON.stringify(datagram[i].value)) {
                        var state = {
                            key: datagram[i].key,
                            value: datagram[i].value,
                            type: 'add'
                        };
                        if (_sharedStates[datagram[i].key]) {
                            state.type = 'update';
                        }
                        _sharedStates[datagram[i].key] = datagram[i].value;
                        _do_callbacks('change', state);

                    } else {
                        _log('SHAREDSTATE - reveived "set" already saved or something wrong', datagram[i]);
                    }
                } else if (datagram[i].type == 'remove') {
                    if (datagram[i].key && _sharedStates[datagram[i].key]) {
                        var state = {
                            key: datagram[i].key,
                            value: _sharedStates[datagram[i].key],
                            type: 'delete'
                        };
                        delete _sharedStates[datagram[i].key];
                        _do_callbacks('remove', state);
                    }

                }

            }
        };

        var onJoined = function (datagram) {
            _log('SHAREDSTATE - got "joined"', datagram);
            if (datagram.agentID == options.agentid) {
                if (options.getOnInit === true) {
                    var datagram = [];
                    _sendDatagram('getInitState', datagram);
                } else {
                    readystate.set('open');
                    if (options.autoPresence === true) {
                        setPresence("online");
                    }
                }


            }
            if (options.autoClean) {

                setInterval(function () {
                    // Autoclean - check for meta keys without online nodes
                    for (var key in _sharedStates) {
                        if (_sharedStates.hasOwnProperty(key)) {
                            if (key.indexOf("__meta__") == 0) {
                                var agentid = key.substr(8);
                                if (!_presence[agentid]) {
                                    _autoClean(agentid);
                                }

                            }
                        }
                    }
                }, 15000);
            }
        };



        var onInitState = function (datagram) {
            _log('INITSTATE', datagram);

            for (var i = 0, len = datagram.length; i < len; i++) {
                if (datagram[i].type == 'set') {
                    if (datagram[i].key && datagram[i].value && JSON.stringify(_sharedStates[datagram[i].key]) != JSON.stringify(datagram[i].value)) {
                        var state = {
                            key: datagram[i].key,
                            value: datagram[i].value,
                            type: 'add'
                        };
                        _sharedStates[datagram[i].key] = datagram[i].value;
                        _do_callbacks('change', state);
                    }
                }
            }
            readystate.set('open');
            if (options.autoPresence === true) {
                setPresence("online");
            }

        }


        var _autoClean = function (agentid) {
            if (!options.autoClean) {
                return;
            }
            _log("*** Cleaning agent ", agentid)
                // Go through the dataset and remove anything left from this node
            for (var key in _sharedStates) {
                if (_sharedStates.hasOwnProperty(key)) {
                    if (key.indexOf("__") == 0 && key.indexOf("__" + agentid) > -1) {
                        self.removeItem(key);
                    }
                }
            }
        }


        /* incoming socket functions --> */



        /* <!-- outgoing socket functions */
        var _sendDatagram = function (type, datagram) {
            _log('SHAREDSTATE - sending', datagram);
            _connection.emit(type, datagram);
        };
        /* outgoing socket functions --> */


        /* <!-- API functions */
        /**
         * sets a key in the sharedState
         * @method setItem
         * @param {string} key the key to set
         * @param {Object} value the value to set
         * @param {string} [options] tbd
         * @returns {Object} SharedState
         * @memberof SharedState
         */
        var setItem = function (key, value, options) {
            if (_request) {
                var state = {
                    type: 'set',
                    key: key,
                    value: value
                };

                _stateChanges[key] = state;
            } else {
                if (readystate.get() === STATE.OPEN) {
                    if (key) {
                        var datagram = [
                            {
                                type: 'set',
                                key: key,
                                value: value
                                }
                            ];
                        _sendDatagram('changeState', datagram);
                    } else {
                        throw 'SHAREDSTATE - params with error - key:' + key + 'value:' + value;
                    }
                } else {
                    throw 'SHAREDSTATE - setItem not possible - connection status:' + readystate.get();
                }
            }


            return self;
        };

        /**
         * removes a key from the sharedState
         * @method removeItem
         * @param {string} key the key to remove
         * @param {string} [options] tbd
         * @returns {Object} SharedState
         * @memberof SharedState
         */
        var removeItem = function (key, options) {
            if (_request) {
                var state = {
                    type: 'remove',
                    key: key
                };
                _stateChanges[key] = state;
            } else {
                if (readystate.get() == STATE.OPEN) {
                    if (_sharedStates[key]) {
                        var datagram = [
                            {
                                type: 'remove',
                                key: key
                                }
                            ];
                        _sendDatagram('changeState', datagram);
                    } else {
                        throw 'SHAREDSTATE - key with error - key:' + key;
                    }
                } else {
                    throw 'SHAREDSTATE - removeItem not possible - connection status:' + readystate.get();
                }
            }
            return self;
        };

        /**
         * starts the request builder
         * @method request
         * @returns {Object} SharedState
         * @memberof SharedState
         */
        var request = function () {
            _request = true;
            return self;
        };

        /**
         * stops the request builder and sends all changes
         * @method send
         * @returns {Object} SharedState
         * @memberof SharedState
         */
        var send = function () {
            if (readystate.get() == STATE.OPEN) {
                _request = false;
                if (Object.keys(_stateChanges).length > 0) {
                    var datagram = [];
                    var keys = Object.keys(_stateChanges);
                    for (var i = 0; i < keys.length; i++) {
                        datagram.push(_stateChanges[keys[i]]);
                    }
                    _sendDatagram('changeState', datagram);

                    _stateChanges = {};
                }
            } else {
                throw 'SHAREDSTATE - send not possible - connection status:' + readystate.get();
            }
            return self;
        };

        /**
         * returns a value of the given key
         * @method getItem
         * @param {string} key the key to remove
         * @param {string} [options] tbd
         * @returns {Object} data
         * @returns {Object} data.key the value of the key
         * @returns {Object} data.newValue the value of the key
         * @memberof SharedState
         */
        var getItem = function (key, options) {

            if (key === undefined || key === null) {
                var datagram = [];
                _sendDatagram('getState', datagram);
                return;
            } else {
                key = key + '';
                if (_sharedStates[key]) {
                    return JSON.parse(JSON.stringify(_sharedStates[key]));
                }
            }
            return;
        };

        /**
         * returns an Array of keys
         * @method keys
         * @returns {Array} keys
         * @memberof SharedState
         */
        var keys = function () {

            return Object.keys(_sharedStates);

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

        var on = function (what, handler, ctx) {
            if (!handler || typeof handler !== "function") throw "Illegal handler";
            if (!_callbacks.hasOwnProperty(what)) throw "Unsupported event " + what;
            if (ctx) {
                handler._ctx = ctx;
            }
            var index = _callbacks[what].indexOf(handler);
            if (index === -1) {
                // register handler
                _callbacks[what].push(handler);
                // flag handler
                handler._immediate_pending = true;
                // do immediate callback
                setTimeout(function () {
                    switch (what) {
                    case 'change':
                        var keys = Object.keys(_sharedStates);
                        if (keys.length === 0) {
                            handler._immediate_pending = false;
                        } else {
                            for (var i = 0, len = keys.length; i < len; i++) {
                                var state = {
                                    key: keys[i],
                                    value: _sharedStates[keys[i]],
                                    type: 'update'
                                };
                                _do_callbacks('change', state, handler);
                            }
                        }
                        break;
                    case 'presence':
                        var keys = Object.keys(_presence);
                        if (keys.length === 0) {
                            handler._immediate_pending = false;
                        } else {
                            for (var i = 0, len = keys.length; i < len; i++) {
                                var presence = {
                                    key: keys[i],
                                    value: _presence[keys[i]]
                                };
                                _do_callbacks('presence', presence, handler);
                            }
                        }
                        break;
                    case 'remove':
                        handler._immediate_pending = false;
                        break;
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


        /**
         * sets the presence of the client ('connected' and 'disconnected' automatically set by server)
         * @method setPresence
         * @param {string} state the string to set the presence to
         * @returns {Object} SharedState
         * @memberof SharedState
         */
        var setPresence = function (state) {
            if (readystate.get() == STATE.OPEN) {
                if (state) {
                    var datagram = {
                        agentID: options.agentid,
                        presence: state
                    };
                    _sendDatagram('changePresence', datagram);

                } else {
                    throw 'SHAREDSTATE - params with error - state:' + state;
                }
            } else {
                throw 'SHAREDSTATE - send not possible - connection status:' + readystate.get();
            }
            return self;
        };
        /* API functions --> */


        /* <!-- public */
        self.__defineGetter__("readyState", readystate.get);
        self.__defineGetter__("STATE", function () {
            return STATE;
        });
        self.__defineGetter__("agentid", function () {
            return options.agentid;
        });

        self.setItem = setItem;
        self.removeItem = removeItem;

        self.request = request;
        self.send = send;

        self.getItem = getItem;

        self.keys = keys;
        self.on = on;
        self.off = off;


        self.setPresence = setPresence;
        /* public --> */

        _init();

        return self;
    }

    SharedState.__moduleName = "sharedState";

    return SharedState;
});
