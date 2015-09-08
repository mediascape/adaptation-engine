define([""],
function(){
    var affinitymatchAdaptation = function (){
        console.log("=============implicit_adaptation====================");

        // the constraints for matching web components to agents
        var opt_constraints = {};

        // a reference to the shared context which is maintained by the hybrid adaptation engine
        var context = {};

        var hasAgent = function(cid) {
            for(var i=0; i<context.agents.length; i++){
                if(context.agents[i].id == cid)
                    return true;
            }

            return false;
        };

        var getAgentById = function(id) {
            for(var i=0; i<context.agents.length; i++){
                if(context.agents[i].id == id)
                    return context.agents[i];
            }

            return null;
        };

        var checkByFilter = function(capabilities, requirements) {
            var result = true;

            for(var i=0; i<requirements.length; i++){
                if(capabilities[requirements[i].capability] != requirements[i].value) {
                    result = false;
                    break;
                }
            }

            return result;
        };

        // calculate the affinity score for a given agent and a given web component
        var estimateAffinity = function(capabilities, preferences) {
            var score = 0;

            for(var i=0; i<preferences.length; i++){
                var capabilityName = preferences[i].capability;
                var value = preferences[i].value;
                if(capabilityName in capabilities) {
                    if( capabilities[capabilityName] == value )
                        score += preferences[i].affinity;
                }
            }

            return score;
        };

        // search for the agents which meet the defined requirements,
        // return an estimated affinity score for each suitable agent based on the defined preferences
        var findMatchedAgents = function(requirements, preferences) {
            var agents = [];

            console.log(context.agents);

            for(var i=0; i<context.agents.length; i++){
                // check the requirements
                if(checkByFilter(context.agents[i].capabilities, requirements) == true) {
                    // calculate the affinity score
                    var affinity = estimateAffinity(context.agents[i].capabilities, preferences);

                    agents.push({"id": context.agents[i].id, "affinity": affinity});
                }
            }

            return agents;
        };

        // find the best matching between web components and agents
        // in a way that we can maximize the total affinity score of all web components
        var doOptimization = function(agentList, components) {
            var actions = [];

            for( var key in components){
                var cid = key;
                var constraints = components[key];

                console.log(constraints);

                var matchedAgents = findMatchedAgents(constraints.requirement, constraints.preference);

                if(matchedAgents.length <= 0) continue;

                // sort all matched agents based on their affinity scores in descending order
                var rankedList = matchedAgents.sort( function(a, b) { return b.affinity - a.affinity; } );

                actions.push({"component": cid, "agent": rankedList[0].id});
            }

            return actions;
        };

        // derive actions based on the current context and the adaptation rules
        var makeDecision = function() {
            var decision = {priority: config.priority, actions: []};

            // matching web components to agents according to their requirements and preferences
            var result = doOptimization(context.agents, opt_constraints);

            // reconstruct the decision result for each agent
            var actions = {};
            for(var i=0; i<result.length; i++){
                var cid = result[i].component;
                var aid = result[i].agent;
                if( aid in actions ) {
                    actions[aid].push({"type": "SHOW", "component": cid});
                } else {
                    actions[aid] = [{"type": "SHOW", "component": cid}];
                }
            }
            for(var id in actions) {
                decision.actions.push( {"agent": id, "actions": actions[id]} );
            }

            return decision;
        };

        this.init = function(cfg, ctx) {
            console.log("=============affinity_matching=== [init]=================");
            console.log(cfg);

            config = cfg;
            context = ctx;

            // extract the requirements and preference for each web component
            for(var i=0; i<config.behaviour.length; i++){
                var component = config.behaviour[i];

                var constrain = {"requirement": [], "preference": []};

                // requirement
                var items = component.requirement.trim().split(')');
                for(var j=0; j<items.length; j++){
                    if(items[j].indexOf('(') < 0) continue;

                    var kv = items[j].split('(');
                    var capability = kv[0].trim();
                    var value = kv[1].trim();
                    constrain.requirement.push({'capability': capability, 'value': value});
                }

                // preference
                items = component.preference.trim().split(')');
                for(var j=0; j<items.length; j++){
                    if(items[j].indexOf('(') < 0) continue;
                    var kv = items[j].split('(');
                    var capability = kv[0].trim();
                    var value = kv[1].split(',')[0].trim();
                    var affinity = kv[1].split(',')[1].trim();
                    constrain.preference.push({'capability': capability, 'value': value, 'affinity': affinity});
                }

                // add it into the constraint list for the matching based optimization problem
                opt_constraints[component.componentId] = constrain;
            }

            console.log(opt_constraints);
        };

        this.onChange = function( evt, ctx ) {
            context = ctx;
            
            // derive the new output according to the latest context
            var decision = makeDecision();
            return decision;
        };
    };

    affinitymatchAdaptation.__moduleName = "affinitymatch";
    return affinitymatchAdaptation;
});
