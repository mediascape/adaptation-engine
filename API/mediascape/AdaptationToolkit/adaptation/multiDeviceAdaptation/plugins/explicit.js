define([""],
function(){
    var explicitAdaptation = function (){
        // the rule table to record all pre-defined rules
        var config = {};

        // a reference to the shared context which is maintained by the hybrid adaptation engine
        var context = {};

        // search for the matched agents according to the defined capability constraints
        var searchAgents = function(constraints) {
            var agentList = [];

            for(var i=0; i<context.agents.length; i++)  {
                var agent = context.agents[i];

                var matched = true;
                for(var key in constraints){
                    if( agent.capabilities[key] != constraints[key] ){
                        matched = false;
                        break;
                    }
                }

                if(matched) {
                    agentList.push(agent);
                }
            }

            return agentList;
        };

        // verify whether the current context fits the required condition
        var checkCondition = function(statements){
            var result = true;

            // check the number of agents
            if(statements.exists.length != context.agents.length){
                result = false;
            } else if(statements.exists) {
                // further check the capabilities of existing agents
                for(var i=0; i<statements.exists.length; i++){
                    var agentIndex = statements.exists[i];
                    var constraints = config.behaviour.agents[agentIndex];
                    if( searchAgents(constraints).length == 0 ) {
                        result = false;
                        break;
                    }
                }
            } else {
                result = false;
            }

            return result;
        };

        // derive actions based on the current context and the adaptation rules
        var makeDecision = function() {
            var decision = {priority: config.priority, actions: []};

            var actions = [];
            var rules = config['behaviour']['rules'];

            for(var i=0; i<rules.length; i++){
                var rule = rules[i];
                if( checkCondition(rule.conditions) == true ){
                    for(var agentIdx in rule.actions){
                        var constraints = config.behaviour.agents[agentIdx];
                        var associatedAgents = searchAgents(constraints);
                        // put the associated actions into the decision
                        for(var j=0; j<associatedAgents.length; j++){
                            var agent = associatedAgents[j];
                            var item = {"agent": agent.id, "actions": []};
                            var components = rule.actions[agentIdx];
                            for(var component in components){
                                if(components[component].load == true)
                                    item.actions.push({"type": "SHOW", "component": component, "config": components[component]});
                                else
                                    item.actions.push({"type": "HIDE", "component": component, "config": components[component]});                                
                            }
                            actions.push(item);
                        }
                    }

                    break; // return the action result for the first matched condition
                }
            }

            decision.actions = actions;
            return decision;
        }

        // initialize the adaptation plugin
        this.init = function(cfg, ctx) {
            console.log("=============explicit_adaptation=== [init]=================");

            config = cfg;
            context = ctx;
        };



        // derive the new output according to the latest context
        this.onChange = function(evt, ctx) {
            context = ctx;
            
            // derive the new output according to the latest context
            var decision = makeDecision();
            return decision;
        };
    };

    explicitAdaptation.__moduleName = "explicit";
    return explicitAdaptation;
});