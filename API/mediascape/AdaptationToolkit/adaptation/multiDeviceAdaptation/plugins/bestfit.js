define([""],
function(){
    var bestfitAdaptation = function (){
        console.log("=============bestfitAdaptation====================");
        
        var rule = {};  
		
		// a reference to the shared context which is maintained by the hybrid adaptation engine		
        var context = {}; 	
		
        // initialize the adaptation plugin
        this.init = function(rl, ctx) {
			console.log("=============bestfit=== [init]=================");
			console.log(rl);	
			
			rule = rl;
			context = ctx;
        };  		
		
        this.onChange = function( evt, ctx ) {
            context = ctx;
            
			var decision = {priority: 1, actions: []};
			
            return decision;
        };
    };

    bestfitAdaptation.__moduleName = "bestfit";
    return bestfitAdaptation;
});
