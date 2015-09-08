var APP_ID = '517725432172992162';	
var userID = 'test';
var AgentID = (Math.random() * 999999999).toFixed(0);
	
var init = function () {	
    // Connect the application context to the UserApp mapping
    var map = mediascape.mappingService("", {
        userId: userID
    });
	
	// perform the decision made by the hybrid adaptation engine
	var applyActions = function(result) {
		console.log('result ============');
		console.log(result);
		
		for(var i=0; i<result.actions.length; i++){
			var action = result.actions[i];
			if(action.type == 'SHOW'){
				console.log('show up ' + action.component);
				$('#' + action.component).fadeIn();
			} else if(action.type == 'HIDE') {
                console.log('hide ' + action.component);
                $('#' + action.component).fadeOut();
            }
		}
	};
	
    map.getUserMapping(APP_ID, ['userApp']).then(function (data) {	
        var appContext = mediascape.applicationContext(data.userApp, {
            agentid: AgentID,
            autoClean: true,
            userId: userID
        });
		
		// initialize the adaptation engine
		var rulefile = 'rules.json';
		var AE = mediascape.AdaptationToolkit.Adaptation.multiDeviceAdaptation;
        AE.init(rulefile, appContext);             
		AE.on('actionchange', applyActions);  

    }).catch(function (error) {
		console.log('error occurred when initializing the adaptation engine');
		console.log(error);
    });
}

document.addEventListener('mediascape-ready', init);

