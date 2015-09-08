define([""],
function(){
    var userprefAdaptation = function (){
        // save the actions done by the previous operations
        var aggregated_result = [];

        // configuration, defined by the JSON fule file as the input to this adaptation plugin
        var config = {};

        // a reference to the shared context which is maintained by the hybrid adaptation engine
        var context = {};

        // initialize the adaptation plugin
        this.init = function(cfg, ctx) {
            console.log("=============personal_adaptation=== [init]=================");
            console.log(cfg);

            config = cfg;
            context = ctx;
        };

        // deal with the change events of the application context
        this.onChange = function( evt, ctx) {
            context = ctx;
            
            if( evt.type === 'CAPABILITY_CHANGE' && evt.capability === 'operation'  && evt.value !== 'undefined' ) {
                console.log(evt);
                var decision = {priority: config.priority, actions: []};
                
                var actions = evt.value; 
                for(var i=0; i<actions.length; i++) {
                    var operation = actions[i];      
                    
                    if(operation.type === 'MOVE'){  //move the selected component from one device to another device
                        decision.actions.push({"agent": evt.agentid, "actions": [{"type": "HIDE", "component": operation.component}]});    
                        decision.actions.push({"agent": operation.destination, "actions": [{"type": "SHOW", "component": operation.component}]});
                    } else if(operation.type === 'DUPLICATE'){
                        decision.actions.push({"agent": operation.destination, "actions": [{"type": "SHOW", "component": operation.component}]});
                    }
                }

                // save the new accumulated action results
                if(decision.actions.length > 0) {
                    // record the decision
                    aggregated_result.push(decision);
                }

                return  decision;
            }

            return null;
        };
    };

    userprefAdaptation.__moduleName = "userpref";
    return userprefAdaptation;
});