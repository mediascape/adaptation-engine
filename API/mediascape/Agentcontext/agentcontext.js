define([""], function () {
    var AgentContext = function () {
        var self = {};

        var _contextItems = {}; // Map key to {currentValue:null, callbacks:[], on:func, off:func}
        var _change_callbacks = [];
        var _capabilities = {};

        var _agent_update_handlers = [];

        var _agent_change_cb = function () {
            for (var i = 0; i < _agent_update_handlers.length; i++) {
                try {
                    _agent_update_handlers[i].call(self);
                } catch (err) {
                    console.log("Error in meta-update", err);
                }
            }
        }
        var setCapability = function (what, state) {
            _capabilities[what] = state;
            _agent_change_cb();
            _doCallbacks.call(self, "keychange", what);
        }

        var _addContextElements = function (instrumentMap) {
            for (var k in instrumentMap) {

                if (!instrumentMap.hasOwnProperty(k)) {
                    continue;
                }
                _contextItems[k] = {
                    currentValue: instrumentMap[k].val || "undefined",
                    callbacks: [],
                    on: instrumentMap[k].on,
                    off: instrumentMap[k].off
                };

                if (instrumentMap[k].init) {
                    instrumentMap[k].init.call(self);
                }else {
                    _doCallbacks.call(self, "keychange", k);
                }
            };
            _agent_change_cb();
            return self;
        }

        var keys = function () {
            var res = [];
            for (k in _contextItems) {
                res.push(k);
            }
            return res;
        }

        // callbacks
        var _doCallbacks = function (what, e, handler) {
            if (what === "keychange") {
                for (var i = 0; i < _change_callbacks.length; i++) {
                    try {
                        _change_callbacks[i].call(self, e);
                    } catch (err) {
                        console.log("Error in keychange handler:" + e);
                    }
                }
                return;
            }
            if (!_contextItems.hasOwnProperty(what)) throw "Unsupported event " + what;
            var h;
            for (var i = 0; i < _contextItems[what].callbacks.length; i++) {
                h = _contextItems[what].callbacks[i];
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
                    console.log("Error in " + what + ": " + h + ": " + e);
                }
            }
        };

        // unregister callback
        var off = function (what, handler) {
            if (what === "keychange") {
                _change_callbacks.splice(_change_callbacks.indexOf(handler), e);
                return;
            }
            if (what === "agentchange") {
                if (_agent_update_handlers.indexOf(handler) == -1) {
                    throw "Callback not registered";
                }
                _agent_update_handlers.splice(agent_update_handlers.indexOf(handler), 1);
                return;
            }
            if (!_contextItems.hasOwnProperty(what)) throw "Unknown parameter " + what;
            if (_contextItems[what].callbacks !== undefined) {
                var index = _contextItems[what].callbacks.indexOf(handler);
                if (index > -1) {
                    _contextItems[what].callbacks.splice(index, 1);
                }

                if (_contextItems[what].callbacks.length === 0 &&
                    _contextItems[what].off) {
                    console.log("Turning " + what + " off");
                    _contextItems[what].off.call(self);
                }
            }
            return self;
        };

        var on = function (what, handler, agentid) {
            if (what === "keychange") {
                _change_callbacks.push(handler);
                handler.call(keys());
                return;
            }
            if (what === "agentchange") {
                console.log("*** Registered agentchange");
                _agent_update_handlers.push(handler);
                try {
                    handler.call(self);
                } catch (err) {
                    console.log("Error in agentchange handler", err);
                }
                return;
            }
            if (!handler || typeof handler !== "function") throw "Illegal handler";
            if (!_contextItems.hasOwnProperty(what)) throw "Unsupported event " + what;
            var index = _contextItems[what].callbacks.indexOf(handler);
            if (index === -1) {
                if (_contextItems[what].callbacks == 0) {
                    // Turn on?
                    if (self.requestHandler.call(self, what, agentid || "self") === true) {
                        if (_contextItems[what].on) {
                            console.log("Turning " + what + " on");
                            _contextItems[what].on.call(self);
                        }
                    }
                }
                // register handler
                _contextItems[what].callbacks.push(handler);
                // flag handler
                handler._immediate_pending = true;
                // do immediate callback
                setTimeout(function () {
                    _doCallbacks(what, {
                        key: what,
                        value: _contextItems[what].currentValue
                    }, handler);
                }, 0);
            }
            return self;
        };


        var setItem = function (what, value) {
            if (!_contextItems.hasOwnProperty(what)) {
                i = [];
                i[what] = {
                    val: value
                };
                _addContextElements(i);
            }

            _contextItems[what].currentValue = value;

            // Do callbacks on it
            _doCallbacks(what, {
                key: what,
                value: value
            });
            return self;
        }


        var getItem = function (what) {
            if (!_contextItems.hasOwnProperty(what)) {
                throw "Unknown item " + what;
            }
            return _contextItems[what].currentValue;
        }

        self.loadContextElements = _addContextElements;
        self.load = _addContextElements;
        self.keys = keys;
        self.on = on;
        self.off = off;
        self.setCapability = setCapability;
        self.getCapability = function(what) {
            return _capabilities[what];
        }
        self.capabilities = function () {
            return _capabilities
        };

        self.setItem = setItem;
        self.getItem = getItem;

        self.requestHandler = function (what, agentid) {
            console.log("Allowing " + what + " by " + agentid);
            return true
        };
        return self;
    }

    AgentContext.__moduleName = "agentContext";

    return AgentContext;
});