define(['jquery',
        'mediascape/Applicationcontext/applicationcontext',
        'mediascape/AdaptationToolkit/adaptation/multiDeviceAdaptation/plugins/explicit',
        'mediascape/AdaptationToolkit/adaptation/multiDeviceAdaptation/plugins/affinitymatch',
        'mediascape/AdaptationToolkit/adaptation/multiDeviceAdaptation/plugins/bestfit',
        'mediascape/AdaptationToolkit/adaptation/multiDeviceAdaptation/plugins/userpref'],
function($, applicationContext){

    // find out all adaptation plugin modules
    var plugin_modules = {};
    var moduleList = Array.prototype.slice.apply(arguments);
    for(var i=2; i<moduleList.length; i++){
        var name = moduleList[i].__moduleName;
        plugin_modules[name] = moduleList[i];
    }

    var multiDeviceAdaptation = function(){
        // the reference to the shared context
        var applicationContext = {};

        // the constructed context based on the context updates
        var context = {"agents":[]};

        // id of the local agent
        var local_agent_id;

        // the list to record the capabilities involved in the rule file
        var required_capability_list = [];

        /*['battery', 'camera', 'deviceMotion', 'deviceOrientation', 'deviceType',
                                        'geolocation', 'language',
                                        'microphone', 'navigatorProduct', 'onLine',
                                        'orientation', 'platform', 'screenSize',
                                        'shake', 'userProximity', 'vibrate']; */

        var plugins = [];

        // the callback functions to inform the others (e.g., UI engine) about the actions
        var all_cbs = [];
        var doCallbacks = function (e) {
            for (var i = 0; i < all_cbs.length; i++) {
                try {
                    all_cbs[i].call(self, e);
                } catch (err) {
                    console.log("Error in agentchange callback: ", err);
                }
            }
        };

        // detect the existing conflict in the results returned from all plugins and try to solve them
        var cleanConflict = function(decisions) {
            var maxPriority = 0, result = null;

            for(var i=0; i<decisions.length; i++){
                if(decisions[i].priority > maxPriority) {
                    maxPriority = decisions[i].priority;
                    result = decisions[i].actions;
                }
            }

            return result;
        };

        // take only the actions for the local agent from the generated results
        var filterByAgentId = function( list, id ) {
            for(var i=0; i<list.length; i++){
                if(list[i].agent == id){
                    return list[i].actions;
                }
            }
        };

        // check if it is an existing agent
        var hasAgent = function(id) {
            for(var i=0; i<context.agents.length; i++){
                if(context.agents[i].id == id)
                    return true;
            }

            return false;
        };

        // access the agent object by ID
        var getAgentById = function(id) {
            for(var i=0; i<context.agents.length; i++){
                if(context.agents[i].id == id)
                    return context.agents[i];
            }

            return null;
        };

        // called whenever a change happens to the shared context
        var updateContext = function(change) {
            if( change.type === 'CAPABILITY_CHANGE' ) {
                
                console.log('********************* capability change event **********************');
                console.log(change);
                
                var agent = getAgentById(change.agentid);
                agent.capabilities[change.capability] = change.value;
            } else if( change.type === 'AGENT_CHANGE' ) {
                if( change.value === 'joined' ) {
                    if( hasAgent(change.agentid) == false) {
                        // new agent joined, add it into the list
                        context.agents.push( {"id": change.agentid, "capabilities": change.capabilities} );
                    } else {
                        // update the exiting agent with the new capability list
                        var agent = getAgentById(change.agentid);
                        for(var capability in change.capabilities){
                            agent.capabilities[capability] = change.capabilities[capability];
                        }
                    }
                } else if( change.value === 'left' ){
                    console.log('existing agent is leaving');
                    console.log(change);
                    // existing agent left, remove it from the list
                    for(var j=0; j<context.agents.length; j++){
                        if(context.agents[j].id == change.agentid){
                            console.log('remove it from the list');
                            context.agents.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        };

        // react on the context change, the core function of the designed hybrid adaptation
        var hybridAdaptation = function(change) {
            var decisions = [];

            // inform all plugins about this change and get back the updated decisions from each of them
            for(var i=0; i<plugins.length; i++) {
                var decision = plugins[i].onChange(change, context);
                if( decision && decision.actions.length > 0 )
                    decisions.push(decision);
            }

            // solve the conflicts in the decisions made by different adaptation plugins
            if(decisions.length > 0) {
                var actions = cleanConflict(decisions);

                // keep the actions for the current agent
                var myactions = filterByAgentId(actions, local_agent_id);

                // notify the UI engine about which web components to display
                if( myactions && myactions.length && myactions.length > 0){
                    var event = {"type": "FULL_UPDATE", "actions": myactions};
                    doCallbacks(event);
                }
            }
        };


        var onUpdateContext = function (change) {
            // update the shared context object
            updateContext(change);

            // adapt to the current context change
            hybridAdaptation(change);
        };


        // subscribe all demanded agent capabilities
        var subscribeAgentCapabilities = function(e) {
            console.log('subscribe agent capabilities');
            for(var i=0; i<required_capability_list.length; i++){
                var capability = required_capability_list[i];

                // listen to the events that cause changes to the capabilities involved in the rule file
                var availableCapabilities = e.diff.capabilities;

                console.log(availableCapabilities);
                console.log(required_capability_list);

                if( availableCapabilities.hasOwnProperty(capability) == true && availableCapabilities[capability] === 'supported' ) {
                    console.log('subscribe to the change of ' + capability + ' for agent id = ' + e.agentid);
                    // subscribe the change of all demanded capabilities for remote agents
                    e.agentContext.on(capability, function(key, value) {
                        console.log('capture a capability value change event key = ' + key + ' value = ' + value + ' from agent id = ' + e.agentid);
                        if( key && value ) {
                            var change = {};
                            change['type'] = 'CAPABILITY_CHANGE';
                            change['agentid'] = e.agentid;
                            change['capability'] = key;
                            change['value'] = value;
                            onUpdateContext(change);
                        }
                    }, e.agentid);
                }
            }
        };


        // the handler to process the change events from the application context
        var onAgentsChange = function (e){
            console.log(e);

            if( e.agentContext == null ){
                var change = {};
                change['type'] = 'AGENT_CHANGE';
                change['agentid'] = e.agentid;
                change['value'] = 'left';

                console.log('^^^^^^^^^^^^^^^^^^^^^^^' + e.agentid + 'left===============');
                onUpdateContext(change);
            } else if( e.agentContext ) {
                console.log(e.agentid + 'join=============');
                console.log(e.diff.capabilities);

                var change = {};
                change['type'] = 'AGENT_CHANGE';
                change['agentid'] = e.agentid;
                change['value'] = 'joined';
                change['capabilities'] = e.diff.capabilities;
                onUpdateContext(change);

                subscribeAgentCapabilities(e);
            }
        };

        // a callback function when the user confirms the operations
        var onUserOperation = function( actions ) {
            // propagate this operation to the shared context via the agent context
            mediascape.agentContext.setItem('operation', actions);
        };

        // install event listeners to trigger the popup dialog for users to specify how to move or duplicate the selected web component
        var hookPersonalAdaptationMenu = function (config){
            mediascape.AdaptationToolkit.uiComponents.addMultiDeviceButtonPanel( function() {
                var componentId = 'view';
                console.log('click multi-device button');

                // prepare the list of available devices
                var devices = [];
                for(var i = 0; i < context.agents.length; i++){
                    var agent = context.agents[i];
                    if(agent.id != local_agent_id) {
                        devices.push({id: agent.id, type: agent.capabilities['deviceType']});
                    }
                }
                
                if(devices.length > 0)
                    mediascape.AdaptationToolkit.uiComponents.showOperationDialog(devices, config, onUserOperation);  
            });
        };


        // initialize the loaded adaptation plugins with their associated rule inputs
        var initPlugins = function(rules) {
            var inputs = [];

            // explicit rule
            inputs.push(rules['explicitRules']);

            // implicit rules
            for(var implicit in rules['implicitRules']){
                inputs.push(rules['implicitRules'][implicit]);
            }

            // user preference
            inputs.push(rules['userPreferences']);

            // initialize all plugins with their behavior specification
            for(var i=0; i<inputs.length; i++) {
                var temp = inputs[i];

                if(temp.enabled == true) {
                    var plugin = new plugin_modules[temp.name]();

                    // initialize the plugin with the right input and put it into the plugin array
                    plugin.init(temp, context);
                    plugins.push(plugin);

                    // prepare the agent capability list demanded by enabled adaptation plugins
                    for(var j = 0; j < temp.capabilities.length; j++) {
                        if( required_capability_list.indexOf(temp.capabilities[j]) < 0 ) {
                            required_capability_list.push(temp.capabilities[j]);
                        }
                    }
                }
            }

            // print out all demanded agent capabilities
            console.log(required_capability_list);
        };

        // parse the input json file to extract rules and constraints
        var loadJSONRules = function(file) {
            $.getJSON(file, function(rules){
                // set up for the personal adaptation to take care of user preference
                if( rules['userPreferences'].enabled == true ) {
                    // add one new capability named "operation" to propagate the move/duplicate operations triggered by the user
                    var instruments = {};
                    instruments.operation = {
                        init: function () {
                            this.setCapability("operation", "supported");
                        }
                    };
                    mediascape.agentContext.load(instruments);

                    console.log('=============hook adaptation contextual menu');

                    // install the listener to trigger a contextual popup menu for specifying the operations
                    hookPersonalAdaptationMenu(rules['userPreferences']['behaviour']);
                }

                // initialize all the adaptation plugins with the loaded rule inputs
                initPlugins(rules);

                // listen to the change events of the application context
                applicationContext.on('agentchange', onAgentsChange);
            });
        };

        // interface functions to external components and developers
        this.init = function (rulefile, ctx){
            console.log('===================init adaptation engine============');
            applicationContext = ctx;

            // get the id of myself
            local_agent_id = applicationContext.getAgents().self.agentid;

            // load adaptation behavior and rules from the JSON file
            loadJSONRules(rulefile);
        };

        // the interface to set and change the priority of a adaptation plug-in
        this.setPriority = function(pluginName, priority) {

        };

        // interface to register a callback function to listen to the decisions made by the adaptation engine
        this.on = function(what, handler) {
            if( what != "actionchange" ) {
                throw "incorrect callback" + what;
            }
            all_cbs.push(handler);
        };

        // interface to unregister the callback function that listens to the decisions made by the adaptation engine
        this.off = function(what, handler) {
            if (what != "actionchange") {
                throw "incorrect callback: " + what;
            }
            if (all_cbs.indexOf(handler) == -1) {
                throw "handler not registered";
            }
            all_cbs.splice(all_cbs.indexOf(handler), 1);
        };
    };

    multiDeviceAdaptation.__moduleName = "multiDeviceAdaptation";
    return multiDeviceAdaptation;
});

