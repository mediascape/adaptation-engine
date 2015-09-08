define( ["jquery","namedwebsockets"], function($,namedWebSockets) {
	var networkWS=null;
	var Discovery = function() {
				this.connectNWS = function(serviceName) {
					var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								//console.log("connection namedWebSockets");
								networkWS = NetworkWebSocket(serviceName);
								networkWS.peersIds = [];

								// Start
								networkWS.onopen = function(evt) {
									console.log("* Named WebSockets connection established.");
									console.log('Connected to "' + serviceName + '" as peer [' + networkWS.id + ']');
									console.log("NetworkWebSocket");
									console.log(networkWS);
									console.log("Event");
									console.log(evt);
								};

								networkWS.onconnect = function (event) {
									console.log("connect");
									var peerWebSocket = event.detail.target;
									console.log('Peer [' + peerWebSocket.id + '] connected');
									networkWS.peersIds.push(peerWebSocket.id);
								};

								/*networkWS.ondisconnect = function (event) {
									var peerWebSocket = event.detail.target;
									console.log(peerWebSocket);
									console.log('Peer [' + peerWebSocket.id + '] disconnected');
								};

								networkWS.onmessage = function(evt) {
									//networkWS.shareState = event.detail.target;
								};*/

								networkWS.onclose = function(evt) {
									console.log("closed");
									networkWS.peersIds = [];
									networkWS.close();
									networkWS=null;
								};

								setTimeout(function () {
									resolve(networkWS);
								}, 500);
							});
					return p1;
				}
				/**
				 * isPresent
				 *
				 * The isPresent function returns the presence of the technology passed as a parameter.
				 *
				 * @return {Promise<JSON|Error>} The Promise wiht the device capabilities presence or error message.
				 *
				 */

				this.isPresent = function(technology){
					//console.log(technology);
					if(technology){
						if(technology.toLowerCase().indexOf("namedwebsockets")!=-1){
							return namedwebsocketsPresence();
						}else if(technology.toLowerCase().indexOf("battery")!=-1){
								return batteryPresence();
							}else if(technology.toLowerCase().indexOf("bluetooth")!=-1){
									return bluetoothPresence();
								}else if(technology.toLowerCase().indexOf("camera")!=-1){
										return cameraPresence();
									}else if(technology.toLowerCase().indexOf("audio")!=-1){
											return audioPresence();
										}else if(technology.toLowerCase().indexOf("deviceproximity")!=-1){
												return deviceProximityPresence();
											}else if(technology.toLowerCase().indexOf("geolocation")!=-1){
													return geolocationPresence();
												}else if(technology.toLowerCase().indexOf("language")!=-1){
														return languagePresence();
													}else if(technology.toLowerCase().indexOf("orientation")!=-1){
															return orientationPresence();
														}else if(technology.toLowerCase().indexOf("screensize")!=-1){
																return screenSizePresence();
															}else if(technology.toLowerCase().indexOf("touchscreen")!=-1){
																	return touchscreenPresence();
																}else if(technology.toLowerCase().indexOf("upnp")!=-1){
																		return upnpPresence();
																	}else if(technology.toLowerCase().indexOf("userproximity")!=-1){
																			return userProximityPresence();
																		}else if(technology.toLowerCase().indexOf("vibration")!=-1){
																				return vibrationPresence();
																			}else if(technology.toLowerCase().indexOf("connection")!=-1){
																					return connectionPresence();
																				}else if(technology.toLowerCase().indexOf("devicetype")!=-1){
																						return deviceTypePresence();
																					}else {
																						var p1= new Promise(
																							function(resolve,reject){
																								var deferred = $.Deferred();
																								resolve(JSON.parse('{"presence":false}'));
																							});
																						return p1;
																					}
					}else{
						return agentPresence();
					};

					function namedwebsocketsPresence(){
						console.log("namedwebsocketsPresence");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var networkWS = NetworkWebSocket("presence");

								networkWS.onopen = function (event) {
									networkWS.close();
									networkWS=null;
									resolve(JSON.parse('{"presence":true}'));
								};

								networkWS.onerror = function (event) {
									resolve(JSON.parse('{"presence":false}'));
								};
							});
						return p1;
					};

					function batteryPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.battery || navigator.webkitBattery || navigator.mozBattery || window.navigator.msBattery || navigator.getBattery){
									resolve(JSON.parse('{"presence":true}'));
								} else {
									var url="http://localhost:8182/discoveryagent/battery/presence";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "presenceBattery"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
											else resolve(JSON.parse('{"presence":false}'));
										});
								}
							});
						return p1;
					};

					function bluetoothPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var url="http://localhost:8182/discoveryagent/bluetooth/presence";
								var promise = $.ajax({
										url: url,
										dataType: "jsonp",
										crossDomain: true,
										jsonp: "callback",
										jsonpCallback: "presenceBluetooth"
									})
									.done(function(data, textStatus, jqXHR) {resolve(data)})
									.fail(function(jqXHR, textStatus, errorThrown) {
										if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
										else resolve(JSON.parse('{"presence":false}'));
									});
							});
						return p1;
					};

					function cameraPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if((navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)){
									if (typeof MediaStreamTrack === 'undefined'){
										resolve(JSON.parse('{"presence":false}'));
									} else {
										if(MediaStreamTrack.toString() == 'function MediaStreamTrack() { [native code] }'){
											MediaStreamTrack.getSources(function (media_sources) {
												var kop=0;
												for (var i = 0; i < media_sources.length; i++) {
													if(media_sources[i].kind== 'video') kop++;
												}
												if(kop>0) resolve(JSON.parse('{"presence":true}'));
												else{
													var url="http://localhost:8182/discoveryagent/camera/presence";
													var promise = $.ajax({
															url: url,
															dataType: "jsonp",
															crossDomain: true,
															jsonp: "callback",
															jsonpCallback: "presenceCamera"
														})
														.done(function(data, textStatus, jqXHR) {resolve(data)})
														.fail(function(jqXHR, textStatus, errorThrown) {
															if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
															else resolve(JSON.parse('{"presence":false}'));
														});
												}
											});
										}else{
											var url="http://localhost:8182/discoveryagent/camera/presence";
											var promise = $.ajax({
													url: url,
													dataType: "jsonp",
													crossDomain: true,
													jsonp: "callback",
													jsonpCallback: "presenceCamera"
												})
												.done(function(data, textStatus, jqXHR) {resolve(data)})
												.fail(function(jqXHR, textStatus, errorThrown) {
													if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
													else resolve(JSON.parse('{"presence":false}'));
												});
										}
									}
								} else {
									var url="http://localhost:8182/discoveryagent/camera/presence";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "presenceCamera"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
											else resolve(JSON.parse('{"presence":false}'));
										});
								}
							});
						return p1;
					};

					function audioPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia){
									if(MediaStreamTrack.toString() == 'function MediaStreamTrack() { [native code] }'){
										MediaStreamTrack.getSources(function (media_sources) {
											var kop=0;
											for (var i = 0; i < media_sources.length; i++) {
												if(media_sources[i].kind == 'audio') kop++;
											}
											if(kop>0) resolve(JSON.parse('{"presence":true}'));
											else resolve(JSON.parse('{"presence":false}'));
										});
									}else{
										resolve(JSON.parse('{"presence":false}'));
									}
								}
							});
						return p1;
					};

					function deviceProximityPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(window.DeviceProximityEvent){
									resolve(JSON.parse('{"presence":true}'));
								} else {
									resolve(JSON.parse('{"presence":false}'));
								}
							});
						return p1;
					};

					function geolocationPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.geolocation) {
									resolve(JSON.parse('{"presence":true}'));
								} else {
									var url="http://localhost:8182/discoveryagent/geolocation/presence";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "presenceGeolocation"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
											else resolve(JSON.parse('{"presence":false}'));
										});
									return promise;
								}
							});
						return p1;
					};

					function languagePresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.language){
									resolve(JSON.parse('{"presence":true}'));
								} else {
									resolve(JSON.parse('{"presence":false}'));
								}
							});
						return p1;
					};

					function orientationPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(screen.orientation || screen.msorientation || screen.mozOrientation) {
									resolve(JSON.parse('{"presence":true}'));
								} else {
									var url="http://localhost:8182/discoveryagent/orientation/presence";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "presenceOrientation"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
											else resolve(JSON.parse('{"presence":false}'));
										});
								}
							});
						return p1;
					};

					function screenSizePresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(screen){
									resolve(JSON.parse('{"presence":true}'));
								} else {
									var url="http://localhost:8182/discoveryagent/screen/presence";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "presenceScreen"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
											else resolve(JSON.parse('{"presence":false}'));
										});
								}
							});
						return p1;
					};

					function touchscreenPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if("ontouchstart" in window){
									resolve(JSON.parse('{"presence":true}'));
								} else {
									var url="http://localhost:8182/discoveryagent/touchscreen/presence";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "presenceTouchscreen"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
											else resolve(JSON.parse('{"presence":false}'));
										});
								}
							});
						return p1;
					};

					function upnpPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var url='http://localhost:8182/discoveryagent/upnp/presence';
								$.ajax({
									url: url,
									dataType: 'jsonp',
									crossDomain: true,
									jsonp: 'callback',
									jsonpCallback: 'presenceUpnp'
								})
								.done(function(data, textStatus, jqXHR) {resolve(data)})
								.fail(function(jqXHR, textStatus, errorThrown) {
									if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
									else resolve(JSON.parse('{"presence":false}'));
								});
							});
						return p1;
					};

					function userProximityPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(window.UserProximityEvent){
									resolve(JSON.parse('{"presence":true}'));
								} else {
									var url="http://localhost:8182/discoveryagent/userProximity/presence";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "presenceUserProximity"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data);})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
											else resolve(JSON.parse('{"presence":false}'));
										});
								}
							});
						return p1;
					};

					function vibrationPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate ){
									resolve(JSON.parse('{"presence":true}'));
								} else {
									var url="http://localhost:8182/discoveryagent/vibration/presence";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "presenceVibration"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
											else resolve(JSON.parse('{"presence":false}'));
										});
								}
							});
						return p1;
					};

					function agentPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var url="http://localhost:8182/discoveryagent/agent/presence";
								var promise = $.ajax({
										url: url,
										dataType: "jsonp",
										crossDomain: true,
										jsonp: "callback",
										jsonpCallback: "presenceAgent"
									})
									.done(function(data, textStatus, jqXHR) {
										console.log(data);
										resolve(JSON.parse('{"presence":true}'));
									})
									.fail(function(jqXHR, textStatus, errorThrown) {
										if(jqXHR.status==404) resolve(JSON.parse('{"presence":"Service Not Working"}'));
										else resolve(JSON.parse('{"presence":false}'));
									});
							});
						return p1;
					};

					function connectionPresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.onLine || navigator.connection || navigator.mozConnection || navigator.webkitConnection){
									if(navigator.connection || navigator.mozConnection || navigator.webkitConnection){
										resolve(JSON.parse('{"presence":true}'));
									}else resolve(JSON.parse('{"presence":false}'));
								}else{
									resolve(JSON.parse('{"presence":false}'));
								}
							});
						return p1;
					};

					function deviceTypePresence(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.userAgent){
									resolve(JSON.parse('{"presence":true}'));
								}else{
									resolve(JSON.parse('{"presence":false}'));
								}
							});
						return p1;
					};
				}

				/**
				 * getExtra
				 *
				 * The getExtra function returns the capabilities of the device using Promise.
				 *
				 * @return {Promise<JSON|Error>} The Promise wiht the device capabilities or error message.
				 *
				 */

				this.getExtra = function(technology){
					//console.log(technology);
					if(technology){
						if(technology.toLowerCase().indexOf("battery")!=-1){
							return batteryGetExtra();
						}else if(technology.toLowerCase().indexOf("bluetooth")!=-1){
								return bluetoothGetExtra();
							}else if(technology.toLowerCase().indexOf("camera")!=-1){
									return cameraGetExtra();
								}else if(technology.toLowerCase().indexOf("audio")!=-1){
										return audioGetExtra();
									}else if(technology.toLowerCase().indexOf("deviceproximity")!=-1){
											return deviceProximityGetExtra();
										}else if(technology.toLowerCase().indexOf("geolocation")!=-1){
												return geolocationGetExtra();
											}else if(technology.toLowerCase().indexOf("language")!=-1){
													return languageGetExtra();
												}else if(technology.toLowerCase().indexOf("orientation")!=-1){
														return orientationGetExtra();
													}else if(technology.toLowerCase().indexOf("screensize")!=-1){
															return screenSizeGetExtra();
														}else if(technology.toLowerCase().indexOf("upnp")!=-1){
																return upnpGetExtra();
															}else if(technology.toLowerCase().indexOf("userproximity")!=-1){
																	return userProximityGetExtra();
																}else if(technology.toLowerCase().indexOf("connection")!=-1){
																		return connectionGetExtra();
																	}else if(technology.toLowerCase().indexOf("devicetype")!=-1){
																			return deviceTypeGetExtra();
																		}else{
																			var p1= new Promise(
																				function(resolve,reject){
																					var deferred = $.Deferred();
																					resolve(JSON.parse('{"extra":false}'));
																				});
																			return p1;
																		}
					}else{
						return agentGetExtra();
					};

					function batteryGetExtra(){
						//console.log("batteryGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.battery || navigator.webkitBattery || navigator.mozBattery || window.navigator.msBattery || navigator.getBattery){
									if(navigator.getBattery){
										navigator.getBattery().then(function(battery){
											resolve(JSON.parse('{"extra":{"level":"'+Math.floor(battery.level * 100)+'%","charging":"'+battery.charging+'"}}'));
										});
									}else{
										resolve(JSON.parse('{"extra":{"level":"'+Math.floor(navigator.battery.level * 100)+'%","charging":"'+navigator.battery.charging+'"}}'));
									}
								} else {
									var url="http://localhost:8182/discoveryagent/battery/extra";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "extraBattery"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"extra":"Service Not Working"}'));
											else resolve(JSON.parse('{"extra":false}'));
										});
								}
							});
						return p1;
					};

					function bluetoothGetExtra(){
						//console.log("bluetoothGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var url="http://localhost:8182/discoveryagent/bluetooth/extra";
								var promise = $.ajax({
										url: url,
										dataType: "jsonp",
										crossDomain: true,
										jsonp: "callback",
										jsonpCallback: "extraBluetooth"
									})
									.done(function(data, textStatus, jqXHR) {resolve(data)})
									.fail(function(jqXHR, textStatus, errorThrown) {
										if(jqXHR.status==404) resolve(JSON.parse('{"extra":"Service Not Working"}'));
										else resolve(JSON.parse('{"extra":false}'));
									});
							});
						return p1;
					};

					function cameraGetExtra(){
						//console.log("cameraGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if((navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)){
									if (typeof MediaStreamTrack === 'undefined'){
										resolve(JSON.parse('{"extra":{"cameras":false}}'));
									} else {
										if(MediaStreamTrack.toString() == 'function MediaStreamTrack() { [native code] }'){
											MediaStreamTrack.getSources(function (media_sources) {
												var kop=0;
												for (var i = 0; i < media_sources.length; i++) {
													if(media_sources[i].kind== 'video') kop++;
												}
												if(kop>0) resolve(JSON.parse('{"extra":{"cameras":"'+kop+'"}}'));
												else resolve(JSON.parse('{"extra":{"cameras":false}}'));
											});
										}else resolve(JSON.parse('{"extra":{"cameras":false}}'));
									}
								} else {
									var url="http://localhost:8182/discoveryagent/camera/extra";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "extraCamera"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"extra":"Service Not Working"}'));
											else resolve(JSON.parse('{"extra":false}'));
										});
								}
							});
						return p1;
					};

					function audioGetExtra(){
						//console.log("audioGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia){
									if(MediaStreamTrack.toString() == 'function MediaStreamTrack() { [native code] }'){
										MediaStreamTrack.getSources(function (media_sources) {
											var kop=0;
											for (var i = 0; i < media_sources.length; i++) {
												if(media_sources[i].kind== 'audio') kop++;
											}
											resolve(JSON.parse('{"extra":{"audio":"'+kop+'"}}'));
										});
									}else{
										resolve(JSON.parse('{"extra":{"audio":false}}'));
									}
								}else resolve(JSON.parse('{"extra":{"audio":false}}'));
							});
						return p1;
					};

					function deviceProximityGetExtra(){
						//console.log("deviceProximityGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(window.DeviceProximityEvent){
									window.addEventListener('deviceproximity', function(event) {
										if (event.value) {
											// The maximum distance the sensor covers (in cm).
											var max = event.max;
											// The minimum distance the sensor covers (in cm).
											var min = event.min;
											// The device proximity (in cm).
											var proximity = event.value;
											resolve(JSON.parse('{"extra":{"deviceProximity":"'+event.value+'"}}'));
										}else{
											resolve(JSON.parse('{"extra":false}'));
										}
									});
								} else {
									resolve(JSON.parse('{"extra":false}'));
								}
							});
						return p1;
					};

					function geolocationGetExtra(){
						//console.log("geolocationGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.geolocation) {
									navigator.geolocation.getCurrentPosition(function(position) {
										resolve(JSON.parse('{"extra":[{"latitude":"'+position.coords.latitude+'"},{"longitude":"'+position.coords.longitude+'"}]}'));
									},function(error){
										var url="http://localhost:8182/discoveryagent/geolocation/extra";
										var promise = $.ajax({
												url: url,
												dataType: "jsonp",
												crossDomain: true,
												jsonp: "callback",
												jsonpCallback: "extraGeolocation"
											})
											.done(function(data, textStatus, jqXHR) {resolve(data)})
											.fail(function(jqXHR, textStatus, errorThrown) {
												if(jqXHR.status==404) resolve(JSON.parse('{"extra":"Service Not Working"}'));
												else resolve(JSON.parse('{"extra":false}'));
											});
									});
								} else {
									var url="http://localhost:8182/discoveryagent/geolocation/extra";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "extraGeolocation"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"extra":"Service Not Working"}'));
											else resolve(JSON.parse('{"extra":false}'));
										});
									}
								});
						return p1;
					};

					function languageGetExtra(){
						//console.log("languageGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.language){
									resolve(JSON.parse('{"extra":{"language":"'+navigator.language+'"}}'));
								} else {
									resolve(JSON.parse('{"extra":false}'));
								}
							});
						return p1;
					};

					function orientationGetExtra(){
						//console.log("orientationGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(screen.orientation || screen.msorientation || screen.mozOrientation) {
									if(screen.orientation){
										// you're in PORTRAIT mode
										if(screen.orientation.angle==180) resolve(JSON.parse('{"extra":{"orientation":"reverse portrait"}}'));
										else if(screen.orientation.angle==0) resolve(JSON.parse('{"extra":{"orientation":"portrait"}}'));
										// you're in LANDSCAPE mode
										else if(screen.orientation.angle==-90||screen.orientation.angle==270) resolve(JSON.parse('{"extra":{"orientation":"reverse landscape"}}'));
										else if(screen.orientation.angle==90)resolve(JSON.parse('{"extra":{"orientation":"landscape"}}'));
									}else if(screen.msorientation || screen.mozOrientation){
											// you're in PORTRAIT mode
											if(screen.mozOrientation=="portrait-secondary") resolve(JSON.parse('{"extra":{"orientation":"reverse portrait"}}'));
											else if(screen.mozOrientation=="portrait-primary") resolve(JSON.parse('{"extra":{"orientation":"portrait"}}'));
											// you're in LANDSCAPE mode
											else if(screen.mozOrientation=="landscape-secondary") resolve(JSON.parse('{"extra":{"orientation":"reverse landscape"}}'));
											else if(screen.mozOrientation=="landscape-primary")resolve(JSON.parse('{"extra":{"orientation":"landscape"}}'));
										}
								} else {
									var url="http://localhost:8182/discoveryagent/orientation/extra";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "extraOrientation"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"extra":"Service Not Working"}'));
											else resolve(JSON.parse('{"extra":false}'));
										});
								}
							});
						return p1;
					};

					function screenSizeGetExtra(){
						//console.log("screenSizeGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(screen){
									var widthPx;
									var heightPx;
									if (parseInt(navigator.appVersion)>3) {
										 widthPx = screen.width;
										 heightPx = screen.height;
									}
									else if (navigator.appName == "Netscape"
										&& parseInt(navigator.appVersion)==3
										&& navigator.javaEnabled()
										) {
											var jToolkit = java.awt.Toolkit.getDefaultToolkit();
											var jScreenSize = jToolkit.getScreenSize();
											widthPx = jScreenSize.width;
											heightPx = jScreenSize.height;
										}

									document.body.insertAdjacentHTML( 'beforeend', '<div id="dpi" style="height: 1in; width: 1in; left: 100%; position: absolute; top: 100%;"></div>' );
									var dpi_x = document.getElementById('dpi').offsetWidth;
									var dpi_y = document.getElementById('dpi').offsetHeight;
									var width = (screen.width/window.devicePixelRatio) / dpi_x;
									var height = (screen.height/window.devicePixelRatio) / dpi_y;
									document.getElementById('dpi').remove();
									resolve(JSON.parse('{"extra":[{"width":"'+widthPx+'","height":"'+heightPx+'"},{"screenX":"'+width+'","screenY":"'+height+'"}]}'));
								} else {
									var url="http://localhost:8182/discoveryagent/screen/extra";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "extraScreen"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data)})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"extra":"Service Not Working"}'));
											else resolve(JSON.parse('{"extra":false}'));
										});
								}
							});
						return p1;
					};

					function upnpGetExtra(elementNumber, elementType){
						//console.log("upnpGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var dato={
									elementNumber: elementNumber,
									elementType: elementType
								};
								var url='http://localhost:8182/discoveryagent/upnp/extra';
								var promise = $.ajax({
									url: url,
									data: dato,
									dataType: 'jsonp',
									crossDomain: true,
									jsonp: 'callback',
									jsonpCallback: 'extraUpnp'
								})
								.done(function(data, textStatus, jqXHR) {resolve(data)})
								.fail(function(jqXHR, textStatus, errorThrown) {
									if(jqXHR.status==404) resolve(JSON.parse('{"extra":"Service Not Working"}'));
									else resolve(JSON.parse('{"extra":false}'));
								});
							});
						return p1;
					};

					function userProximityGetExtra(){
						//console.log("userProximityGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(window.UserProximityEvent){
									window.addEventListener('userproximity', function(event) {
										if (event.near) {
											resolve(JSON.parse('{"extra":{"userProximity":"'+event.value+'"}}'));
										}else{
											resolve(JSON.parse('{"extra":false}'));
										}
									});
								}else{
									var url="http://localhost:8182/discoveryagent/userProximity/extra";
									var promise = $.ajax({
											url: url,
											dataType: "jsonp",
											crossDomain: true,
											jsonp: "callback",
											jsonpCallback: "extraUserProximity"
										})
										.done(function(data, textStatus, jqXHR) {resolve(data);})
										.fail(function(jqXHR, textStatus, errorThrown) {
											if(jqXHR.status==404) resolve(JSON.parse('{"extra":"Service Not Working"}'));
											else resolve(JSON.parse('{"extra":false}'));
										});
								}
							});
						return p1;
					};

					function connectionGetExtra(){
						//console.log("connectionGetExtra");
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.onLine || navigator.connection || navigator.mozConnection || navigator.webkitConnection){
									var connection, connectionSpeed;
									// create a custom object if navigator.connection isn't available
									connection = navigator.connection || {'type':'0'};
									// set connectionSpeed
									switch(connection.type) {
										case connection.CELL_3G:
											// 3G
											connectionSpeed = 'mediumbandwidth';
											break;
										case connection.CELL_2G:
											// 2G
											connectionSpeed = 'lowbandwidth';
											break;
										default:
											// WIFI, ETHERNET, UNKNOWN
											connectionSpeed = 'highbandwidth';
											break;
									}
									if(connectionSpeed!=undefined) resolve(JSON.parse('{"extra":{"connection":"'+connectionSpeed+'"}}'));
									else resolve(JSON.parse('{"extra":false}'));
								}else{
									resolve(JSON.parse('{"extra":false}'));
								}
							});
						return p1;
					}

					function deviceTypeGetExtra(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(navigator.userAgent){
									if(navigator.userAgent.toLowerCase().indexOf("mobile")!=-1){
										//mobiles + ipad
										if(navigator.userAgent.toLowerCase().indexOf("ipad")!=-1){
											resolve(JSON.parse('{"extra":{"deviceType":"tablet"}}'));
										}else resolve(JSON.parse('{"extra":{"deviceType":"mobile"}}'));
									}else{
										//computers + tablets + tv
										if((navigator.userAgent.toLowerCase().indexOf("x11")!=-1)||(navigator.userAgent.toLowerCase().indexOf("macintosh")!=-1)||(navigator.userAgent.toLowerCase().indexOf("windows nt")!=-1)){
											//computers
											resolve(JSON.parse('{"extra":{"deviceType":"computer"}}'));
										}else if((navigator.userAgent.toLowerCase().indexOf("hbbtv")!=-1)||(navigator.userAgent.toLowerCase().indexOf("rk3066")!=-1)){
												//tvs
												resolve(JSON.parse('{"extra":{"deviceType":"tv"}}'));
											}else if(navigator.userAgent.toLowerCase().indexOf("android")!=-1){
												//tablets
												resolve(JSON.parse('{"extra":{"deviceType":"tablet"}}'));
											}
									}
								}
							});
						return p1;
					}

					function agentGetExtra(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var url="http://localhost:8182/discoveryagent/agent/capabilities";
								var promise = $.ajax({
										url: url,
										dataType: "jsonp",
										crossDomain: true,
										jsonp: "callback",
										jsonpCallback: "capabilities"
									})
									.done(function(data, textStatus, jqXHR) {
										if((navigator.battery || navigator.webkitBattery || navigator.mozBattery || window.navigator.msBattery || navigator.getBattery) &&(!data.capabilities[0].batteryPresence)){
											if(navigator.getBattery){
												navigator.getBattery().then(function(battery){
													data.capabilities[0].batteryPresence=true;
													data.capabilities[1].batteryExtra=JSON.parse('{"level":"'+Math.floor(battery.level * 100)+'%","charging":"'+battery.charging+'"}');
												});
											} else {
												data.capabilities[0].batteryPresence=true;
												data.capabilities[1].batteryExtra=JSON.parse('[{"level":"'+Math.floor(navigator.battery.level * 100)+'%","charging":"'+navigator.battery.charging+'"}]');
											}
										}
										if((navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)&&(!data.capabilities[2].cameraPresence)){
											if(MediaStreamTrack.toString() == 'function MediaStreamTrack() { [native code] }'){
												MediaStreamTrack.getSources(function (media_sources) {
													var kop=0;
													for (var i = 0; i < media_sources.length; i++) {
														if(media_sources[i].kind== 'video') kop++;
													}
													data.capabilities[2].cameraPresence=true;
													data.capabilities[3].cameraExtra=kop;
												});
											}
										}
										if(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia){
											if(MediaStreamTrack.toString() == 'function MediaStreamTrack() { [native code] }'){
												MediaStreamTrack.getSources(function (media_sources) {
													var kop=0;
													for (var i = 0; i < media_sources.length; i++) {
														if(media_sources[i].kind== 'audio') kop++
													}
													if(kop>0){
														var text = '{"audioPresence":true}';
														var obj = JSON.parse(text);
														data.capabilities.push(obj);
														var text1 = '{"audioExtra":'+kop+'}';
														var obj1 = JSON.parse(text1);
														data.capabilities.push(obj1);
													}else{
														var text = '{"audioPresence":false}';
														var obj = JSON.parse(text);
														data.capabilities.push(obj);
														var text1 = '{"audioExtra":false}';
														var obj1 = JSON.parse(text1);
														data.capabilities.push(obj1);
													}
												});
											}else{
												var text = '{"audioPresence":false}';
												var obj = JSON.parse(text);
												data.capabilities.push(obj);
												var text1 = '{"audioExtra":false}';
												var obj1 = JSON.parse(text1);
												data.capabilities.push(obj1);
											}
										}
										if((screen)&&(!data.capabilities[4].orientationPresence)) {
											var widthPx;
											var heightPx;
											data.capabilities[4].screenSizePresence=true;
											if (parseInt(navigator.appVersion)>3) {
												 widthPx = screen.width;
												 heightPx = screen.height;
											}
											else if (navigator.appName == "Netscape"
												&& parseInt(navigator.appVersion)==3
												&& navigator.javaEnabled()
												){
													var jToolkit = java.awt.Toolkit.getDefaultToolkit();
													var jScreenSize = jToolkit.getScreenSize();
													widthPx = jScreenSize.width;
													heightPx = jScreenSize.height;
												}
											document.body.insertAdjacentHTML( 'beforeend', '<div id="dpi" style="height: 1in; width: 1in; left: 100%; position: absolute; top: 100%;"></div>' );
											var dpi_x = document.getElementById('dpi').offsetWidth;
											var dpi_y = document.getElementById('dpi').offsetHeight;
											var width = (screen.width/window.devicePixelRatio) / dpi_x;
											var height = (screen.height/window.devicePixelRatio) / dpi_y;
											document.getElementById('dpi').remove();
											data.capabilities[5].screenSizeExtra=JSON.parse('[{"width":"'+widthPx+'","height":"'+heightPx+'"},{"screenX":"'+width+'","screenY":"'+height+'"}]');
										}
										if((window.UserProximityEvent)&&(!data.capabilities[6].userProximityPresence)) {
											window.addEventListener('userproximity', function(event) {
												if (event.near) {
													data.capabilities[6].userProximityPresence=true;
													data.capabilities[7].userProximityExtra=event.value;
												}
											});
										}
										if((navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate )&&(!data.capabilities[8].vibrationPresence)) {
											data.capabilities[8].vibrationPresence = true;
										}
										if(("ontouchstart" in window)&&(!data.capabilities[9].touchscreenPresence)) {
											data.capabilities[9].touchScreenPresence=true;
										}
										if((screen.orientation|| screen.msorientation || screen.mozOrientation)&&(!data.capabilities[10].orientationPresence)) {
											if(screen.orientation){
												data.capabilities[10].orientationPresence = true;
												// you're in PORTRAIT mode
												if(screen.orientation.angle==0) data.capabilities[11].orientationExtra = "portrait";
												else if(screen.orientation.angle==180) data.capabilities[11].orientationExtra = "reverse portrait";
												// you're in LANDSCAPE mode
												else if(screen.orientation.angle==90) data.capabilities[11].orientationExtra = "landscape";
												else if(screen.orientation.angle==-90||screen.orientation.angle==270) data.capabilities[11].orientationExtra = "reverse landscape";
											} else if(screen.msorientation || screen.mozOrientation){
													data.capabilities[10].orientationPresence = true;
													// you're in PORTRAIT mode
													if(screen.orientation=="portrait-primary") data.capabilities[11].orientationExtra = "portrait";
													else if(screen.orientation=="portrait-secondary") data.capabilities[11].orientationExtra = "reverse portrait";
													// you're in LANDSCAPE mode
													else if(screen.orientation=="landscape-primary") data.capabilities[11].orientationExtra = "landscape";
													else if(screen.orientation=="landscape-secondary") data.capabilities[11].orientationExtra = "reverse landscape";
												}
										}
										if((navigator.geolocation)&&(!data.capabilities[12].geolocationPresence)) {
											navigator.geolocation.getCurrentPosition(function(position) {
												data.capabilities[12].geolocationPresence=true;
												data.capabilities[13].geolocationExtra=JSON.parse('[{"latitude":"'+position.coords.latitude+'"},{"longitude":"'+position.coords.longitude+'"}]');
											});
										}
										if(navigator.language){
											var text = '{"languagePresence":true}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"languageExtra":"'+navigator.language+'"}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										else{
											var text = '{"languagePresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"languageExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										if(window.DeviceProximityEvent){
											window.addEventListener('deviceproximity', function(event) {
												if (event.value) {
													var text = '{"deviceProximityPresence":true}';
													var obj = JSON.parse(text);
													data.capabilities.push(obj);
													var text1 = '{"deviceProximityExtra":'+event.value+'}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}else{
													var text = '{"deviceProximityPresence":false}';
													var obj = JSON.parse(text);
													data.capabilities.push(obj);
													var text1 = '{"deviceProximityExtra":false}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}
											});
										} else {
											var text = '{"deviceProximityPresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"deviceProximityExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										if(navigator.onLine || navigator.connection || navigator.mozConnection || navigator.webkitConnection){
											var connection, connectionSpeed;
											// create a custom object if navigator.connection isn't available
											connection = navigator.connection || {'type':'0'};
											// set connectionSpeed
											switch(connection.type) {
												case connection.CELL_3G:
													// 3G
													connectionSpeed = 'mediumbandwidth';
													break;
												case connection.CELL_2G:
													// 2G
													connectionSpeed = 'lowbandwidth';
													break;
												default:
													// WIFI, ETHERNET, UNKNOWN
													connectionSpeed = 'highbandwidth';
											}
											if(connectionSpeed!=undefined){
												var text = '{"connectionPresence":true}';
												var obj = JSON.parse(text);
												data.capabilities.push(obj);

												var text1 = '{"connectionExtra":"'+connectionSpeed+'"}';
												var obj1 = JSON.parse(text1);
												data.capabilities.push(obj1);
											}else{
												var text = '{"connectionPresence":false}';
												var obj = JSON.parse(text);
												data.capabilities.push(obj);
												var text1 = '{"connectionExtra":false}';
												var obj1 = JSON.parse(text1);
												data.capabilities.push(obj1);
											}
										}else{
											var text = '{"connectionPresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"connectionExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										if(navigator.userAgent){
											var text = '{"deviceTypePresence":true}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											if(navigator.userAgent.toLowerCase().indexOf("mobile")!=-1){
												//mobiles + ipad
												if(navigator.userAgent.toLowerCase().indexOf("ipad")!=-1){
													//resolve(JSON.parse('{"extra":{"deviceType":"tablet"}}'));
													var text1 = '{"deviceType":"tablet"}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}else {
													//resolve(JSON.parse('{"extra":{"deviceType:"mobile"}}'));
													var text1 = '{"deviceType":"mobile"}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}
											}else{
												//computers + tablets + tv
												if((navigator.userAgent.toLowerCase().indexOf("x11")!=-1)||(navigator.userAgent.toLowerCase().indexOf("macintosh")!=-1)||(navigator.userAgent.toLowerCase().indexOf("windows nt")!=-1)){
													//computers
													//resolve(JSON.parse('{"extra":{"deviceType":"computer"}}'));
													var text1 = '{"deviceType":"computer"}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}else if((navigator.userAgent.toLowerCase().indexOf("hbbtv")!=-1)||(navigator.userAgent.toLowerCase().indexOf("rk3066")!=-1)){
														//tvs
														//resolve(JSON.parse('{"extra":{"deviceType":"tv"}}'));
														var text1 = '{"deviceType":"tv"}';
														var obj1 = JSON.parse(text1);
														data.capabilities.push(obj1);
													}else if(navigator.userAgent.toLowerCase().indexOf("android")!=-1){
														//tablets
														//resolve(JSON.parse('{"extra":{"deviceType":"tablet"}}'));
														var text1 = '{"deviceType":"tablet"}';
														var obj1 = JSON.parse(text1);
														data.capabilities.push(obj1);
													}
											}
										}else{
											var text = '{"deviceTypePresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"deviceTypeExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										setTimeout(function () {resolve(data);}, 500);
									})
									.fail(function(jqXHR, textStatus, errorThrown) {
										var json='{"capabilities":[]}';
										var data = JSON.parse(json);
										if(navigator.battery || navigator.webkitBattery || navigator.mozBattery || window.navigator.msBattery || navigator.getBattery) {
											var text = '{"batteryPresence":true}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											if(navigator.getBattery){
												navigator.getBattery().then(function(battery){
													var obj1 = JSON.parse('{"batteryExtra":{"level":"'+Math.floor(battery.level * 100)+'%","charging":"'+battery.charging+'"}}');
													data.capabilities.push(obj1);
												});
											}else{
												var obj1 = JSON.parse('{"batteryExtra":{"level":"'+Math.floor(navigator.battery.level * 100)+'%","charging":"'+navigator.battery.charging+'"}}');
												data.capabilities.push(obj1);
											}
										}else{
											var text = '{"batteryPresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"batteryExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										if(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia){
											if(MediaStreamTrack.toString() == 'function MediaStreamTrack() { [native code] }'){
												MediaStreamTrack.getSources(function (media_sources) {
													var kop=0;
													for (var i = 0; i < media_sources.length; i++) {
														if(media_sources[i].kind== 'audio') kop++;
													}
													if(kop>0){
														var text = '{"audioPresence":true}';
														var obj = JSON.parse(text);
														data.capabilities.push(obj);
														var text1 = '{"audioExtra":'+kop+'}';
														var obj1 = JSON.parse(text1);
														data.capabilities.push(obj1);
													}else{
														var text = '{"audioPresence":false}';
														var obj = JSON.parse(text);
														data.capabilities.push(obj);
														var text1 = '{"audioExtra":false}';
														var obj1 = JSON.parse(text1);
														data.capabilities.push(obj1);
													}
												});
											}else{
												var text = '{"audioPresence":false}';
												var obj = JSON.parse(text);
												data.capabilities.push(obj);
												var text1 = '{"audioExtra":false}';
												var obj1 = JSON.parse(text1);
												data.capabilities.push(obj1);
											}
										}
										if(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia){
											if(MediaStreamTrack.toString() == 'function MediaStreamTrack() { [native code] }'){
												MediaStreamTrack.getSources(function (media_sources) {
													var kop=0;
													for (var i = 0; i < media_sources.length; i++) {
														if(media_sources[i].kind== 'video') kop++;
													}
													if(kop>0){
														var text = '{"cameraPresence":true}';
														var obj = JSON.parse(text);
														data.capabilities.push(obj);
														var text1 = '{"cameraExtra":'+kop+'}';
														var obj1 = JSON.parse(text1);
														data.capabilities.push(obj1);
													}else{
														var text = '{"cameraPresence":false}';
														var obj = JSON.parse(text);
														data.capabilities.push(obj);
														var text1 = '{"cameraExtra":false}';
														var obj1 = JSON.parse(text1);
														data.capabilities.push(obj1);
													}
												});
											}else{
												var text = '{"cameraPresence":false}';
												var obj = JSON.parse(text);
												data.capabilities.push(obj);
												var text1 = '{"cameraExtra":false}';
												var obj1 = JSON.parse(text1);
												data.capabilities.push(obj1);
											}
										}
										if(screen) {
											var widthPx;
											var heightPx;
											if (parseInt(navigator.appVersion)>3) {
												 widthPx = screen.width;
												 heightPx = screen.height;
											}
											else if (navigator.appName == "Netscape"
												&& parseInt(navigator.appVersion)==3
												&& navigator.javaEnabled()
												){
													 var jToolkit = java.awt.Toolkit.getDefaultToolkit();
													 var jScreenSize = jToolkit.getScreenSize();
													 widthPx = jScreenSize.width;
													 heightPx = jScreenSize.height;
												}
											document.body.insertAdjacentHTML( 'beforeend', '<div id="dpi" style="height: 1in; width: 1in; left: 100%; position: absolute; top: 100%;"></div>' );
											var dpi_x = document.getElementById('dpi').offsetWidth;
											var dpi_y = document.getElementById('dpi').offsetHeight;
											var width = (screen.width/window.devicePixelRatio) / dpi_x;
											var height = (screen.height/window.devicePixelRatio) / dpi_y;
											var text = '{"screenSizePresence":true}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											document.getElementById('dpi').remove();
											var text1 = '{"screenSizeExtra":[{"width":"'+widthPx+'","height":"'+heightPx+'"},{"screenX":"'+width+'","screenY":"'+height+'"}]}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}else{
											var text = '{"screenSizePresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"screenSizeExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										if(window.UserProximityEvent) {
											window.addEventListener('userproximity', function(event) {
												if (event.near) {
													var text = '{"userProximityPresence":true}';
													var obj = JSON.parse(text);
													data.capabilities.push(obj);
													var text1 = '{"userProximityExtra":'+evet.near+'}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}else{
													var text = '{"userProximityPresence":false}';
													var obj = JSON.parse(text);
													data.capabilities.push(obj);
													var text1 = '{"userProximityExtra":false}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}
											});
										}else{
											var text = '{"userProximityPresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"userProximityExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										if(navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate ) {
											var text = '{"vibrationPresence":true}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
										}else {
											var text = '{"vibrationPresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
										}
										if("ontouchstart" in window) {
											var text = '{"touchScreenPresence":true}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
										}else {
											var text = '{"touchScreenPresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
										}
										if(screen.orientation||screen.msorientation||screen.mozOrientation) {
											var orient;
											var text = '{"orientationPresence":true}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											if(screen.orientation){
												// you're in PORTRAIT mode
												if(screen.orientation.angle==0)orient = "portrait";
												else if(screen.orientation.angle==180) orient = "reverse portrait";
												// you're in LANDSCAPE mode
												else if(screen.orientation.angle==90) orient = "landscape";
												else if(screen.orientation.angle==-90||screen.orientation.angle==270) orient = "reverse landscape";
												var text1 = '{"orientationExtra":"'+orient+'"}';
												var obj1 = JSON.parse(text1);
												data.capabilities.push(obj1);
											}else if(screen.msorientation||screen.mozOrientation) {
													// you're in PORTRAIT mode
													if(screen.orientation=="portrait-primary")orient = "portrait";
													else if(screen.orientation=="portrait-secondary") orient = "reverse portrait";
													// you're in LANDSCAPE mode
													else if(screen.orientation=="landscape-primary") orient = "landscape";
													else if(screen.orientation=="landscape-secondary") orient = "reverse landscape";
													var text1 = '{"orientationExtra":"'+orient+'"}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}
										}else{
											var text = '{"orientationPresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"orientationExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										if(navigator.geolocation) {
											navigator.geolocation.getCurrentPosition(function(position) {
												if(position){
													var text = '{"geolocationPresence":true}';
													var obj = JSON.parse(text);
													data.capabilities.push(obj);
													var text1 = '{"geolocationExtra":[{"latitude":"'+position.coords.latitude+'"},{"longitude":"'+position.coords.longitude+'"}]}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}else{
													var text = '{"geolocationPresence":false}';
													var obj = JSON.parse(text);
													data.capabilities.push(obj);
													var text1 = '{"geolocationExtra":false}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}
											});
										}else{
											var text = '{"geolocationPresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"geolocationExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										if(navigator.language){
											var text = '{"languagePresence":true}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"languageExtra":"'+navigator.language+'"}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										else{
											var text = '{"languagePresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"languageExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										if(window.DeviceProximityEvent){
											window.addEventListener('deviceproximity', function(event) {
												if (event.value) {
													var text = '{"deviceProximityPresence":true}';
													var obj = JSON.parse(text);
													data.capabilities.push(obj);
													var text1 = '{"deviceProximityExtra":'+event.value+'}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}else{
													var text = '{"deviceProximityPresence":false}';
													var obj = JSON.parse(text);
													data.capabilities.push(obj);
													var text1 = '{"deviceProximityExtra":false}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}
											});
										} else {
											var text = '{"deviceProximityPresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"deviceProximityExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										var text = '{"bluetoothPresence":false}';
										var obj = JSON.parse(text);
										data.capabilities.push(obj);
										if(navigator.onLine || navigator.connection || navigator.mozConnection || navigator.webkitConnection){
											var connection, connectionSpeed;
											// create a custom object if navigator.connection isn't available
											connection = navigator.connection || {'type':'0'};
											// set connectionSpeed
											switch(connection.type) {
												case connection.CELL_3G:
													// 3G
													connectionSpeed = 'mediumbandwidth';
													break;
												case connection.CELL_2G:
													// 2G
													connectionSpeed = 'lowbandwidth';
													break;
												default:
													// WIFI, ETHERNET, UNKNOWN
													connectionSpeed = 'highbandwidth';
											}
											if(connectionSpeed!=undefined){
												var text = '{"connectionPresence":true}';
												var obj = JSON.parse(text);
												data.capabilities.push(obj);
												var text1 = '{"connectionExtra":"'+connectionSpeed+'"}';
												var obj1 = JSON.parse(text1);
												data.capabilities.push(obj1);
											}else{
												var text = '{"connectionPresence":false}';
												var obj = JSON.parse(text);
												data.capabilities.push(obj);
												var text1 = '{"connectionExtra":false}';
												var obj1 = JSON.parse(text1);
												data.capabilities.push(obj1);
											}
										}else{
											var text = '{"connectionPresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"connectionExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										if(navigator.userAgent){
											var text = '{"deviceTypePresence":true}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											if(navigator.userAgent.toLowerCase().indexOf("mobile")!=-1){
												//mobiles + ipad
												if(navigator.userAgent.toLowerCase().indexOf("ipad")!=-1){
													//resolve(JSON.parse('{"extra":{"deviceType":"tablet"}}'));
													var text1 = '{"deviceType":"tablet"}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}else {
													//resolve(JSON.parse('{"extra":{"deviceType:"mobile"}}'));
													var text1 = '{"deviceType":"mobile"}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}
											}else{
												//computers + tablets + tv
												if((navigator.userAgent.toLowerCase().indexOf("x11")!=-1)||(navigator.userAgent.toLowerCase().indexOf("macintosh")!=-1)||(navigator.userAgent.toLowerCase().indexOf("windows nt")!=-1)){
													//computers
													//resolve(JSON.parse('{"extra":{"deviceType":"computer"}}'));
													var text1 = '{"deviceType":"computer"}';
													var obj1 = JSON.parse(text1);
													data.capabilities.push(obj1);
												}else if((navigator.userAgent.toLowerCase().indexOf("hbbtv")!=-1)||(navigator.userAgent.toLowerCase().indexOf("rk3066")!=-1)){
														//tvs
														//resolve(JSON.parse('{"extra":{"deviceType":"tv"}}'));
														var text1 = '{"deviceType":"tv"}';
														var obj1 = JSON.parse(text1);
														data.capabilities.push(obj1);
													}else if(navigator.userAgent.toLowerCase().indexOf("android")!=-1){
														//tablets
														//resolve(JSON.parse('{"extra":{"deviceType":"tablet"}}'));
														var text1 = '{"deviceType":"tablet"}';
														var obj1 = JSON.parse(text1);
														data.capabilities.push(obj1);
													}
											}
										}else{
											var text = '{"deviceTypePresence":false}';
											var obj = JSON.parse(text);
											data.capabilities.push(obj);
											var text1 = '{"deviceTypeExtra":false}';
											var obj1 = JSON.parse(text1);
											data.capabilities.push(obj1);
										}
										setTimeout(function () {resolve(data);}, 500);
									});
							});
						return p1;
					}
				};

				/**
				 * getDevices
				 *
				 * The getDevices function returns the list of devices using Promise.
				 *
				 * @return {Promise<JSON|Error>} The Promise wiht the list of devices or error message.
				 *
				 */

				this.getDevices = function(technology){
					if(technology){
						if(technology.toLowerCase().indexOf("upnp")!=-1){
							return upnpGetDevices();
						}else if(technology.toLowerCase().indexOf("bluetooth")!=-1){
								return bluetoothGetDevices();
							}else if(technology.toLowerCase().indexOf("namedwebsockets")!=-1){
								return namedwebsocketsGetDevices();
							}
					}
					function bluetoothGetDevices(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var url="http://localhost:8182/discoveryagent/bluetooth/devices";
								var promise = $.ajax({
									url: url,
									dataType: "jsonp",
									crossDomain: true,
									jsonp: "callback",
									jsonpCallback: "devicesBluetooth"
								})
								.done(function(data, textStatus, jqXHR) {resolve(data)})
								.fail(function(jqXHR, textStatus, errorThrown) {
									if(jqXHR.status==404) resolve(JSON.parse('{"devices":"Service Not Working"}'));
									else resolve(JSON.parse('{"devices":false}'));
								});
							});
						return p1;
					};

					function upnpGetDevices() {
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var url='http://localhost:8182/discoveryagent/upnp/devices';
								var promise = $.ajax({
									url: url,
									dataType: 'jsonp',
									crossDomain: true,
									jsonp: 'callback',
									jsonpCallback: 'devicesUpnp',
								})
								.done(function(data, textStatus, jqXHR) {resolve(data)})
								.fail(function(jqXHR, textStatus, errorThrown) {
									if(jqXHR.status==404) resolve(JSON.parse('{"devices":"Service Not Working"}'));
									else resolve(JSON.parse('{"devices":false}'));
								});
							});
						return p1;
					};

					function namedwebsocketsGetDevices(){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								if(networkWS!=null){
									var jsonArr = [];
									//console.log(networkWS);
									jsonArr.push({"id":networkWS.id});
									for (var i = 0; i < networkWS.peers.length; i++) {
										jsonArr.push({"id":networkWS.peers[i].id});
									}

									if(jsonArr.length!=0) resolve(JSON.parse('{"devices":'+JSON.stringify(jsonArr)+'}'));
									else resolve(JSON.parse('{"devices":false}'));
								}else resolve(JSON.parse('{"devices":false}'));
							});
						return p1;
					};
				};

				/**
				 * getServices
				 *
				 * The getDevices function returns the list of devices using Promise.
				 *
				 * @return {Promise<JSON|Error>} The Promise wiht the list of devices or error message.
				 *
				 */

				this.getServices = function(technology,device){
					if(technology){
						if(technology.toLowerCase().indexOf("upnp")!=-1){
							return upnpGetServices(device);
						}else if(technology.toLowerCase().indexOf("bluetooth")!=-1){
								return bluetoothGetServices(device);
							}
					}
					function bluetoothGetServices(device){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var dato={
									device: device
								};
								var url="http://localhost:8182/discoveryagent/bluetooth/services";
								var promise = $.ajax({
									url: url,
									data: dato,
									dataType: "jsonp",
									crossDomain: true,
									jsonp: "callback",
									jsonpCallback: "servicesBluetooth"
								})
								.done(function(data, textStatus, jqXHR) {resolve(data)})
								.fail(function(jqXHR, textStatus, errorThrown) {
									if(jqXHR.status==404) resolve(JSON.parse('{"services":"Service Not Working"}'));
									else resolve(JSON.parse('{"services":false}'));
								});
							});
						return p1;
					};

					function upnpGetServices(device) {
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var dato={
									device: device
								};
								var url='http://localhost:8182/discoveryagent/upnp/services';
								var promise = $.ajax({
									url: url,
									data: dato,
									dataType: 'jsonp',
									crossDomain: true,
									jsonp: 'callback',
									jsonpCallback: 'servicesUpnp',
								})
								.done(function(data, textStatus, jqXHR) {resolve(data)})
								.fail(function(jqXHR, textStatus, errorThrown) {
									if(jqXHR.status==404) resolve(JSON.parse('{"services":"Service Not Working"}'));
									else resolve(JSON.parse('{"services":false}'));
								});
							});
						return p1;
					};
				};

				/**
				 * getActions
				 *
				 * The getActions function returns the list of actions using Promise.
				 *
				 * @return {Promise<JSON|Error>} The Promise wiht the list of actions or error message.
				 *
				 */

				this.getActions = function(technology, device, service){
					if(technology){
						if(technology.toLowerCase().indexOf("upnp")!=-1){
							return upnpGetActions(device, service);
						}else if(technology.toLowerCase().indexOf("bluetooth")!=-1){
								return bluetoothGetActions(device, service);
							}
					}
					function bluetoothGetActions(device, service){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var dato={
									device: device,
									service: service
								};
								var url="http://localhost:8182/discoveryagent/bluetooth/actions";
								var promise = $.ajax({
									url: url,
									data: dato,
									dataType: "jsonp",
									crossDomain: true,
									jsonp: "callback",
									jsonpCallback: "actionsBluetooth"
								})
								.done(function(data, textStatus, jqXHR) {resolve(data)})
								.fail(function(jqXHR, textStatus, errorThrown) {
									if(jqXHR.status==404) resolve(JSON.parse('{"actions":"Service Not Working"}'));
									else resolve(JSON.parse('{"actions":false}'));
								});
							});
						return p1;
					};

					function upnpGetActions(device, service) {
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var dato={
									device: device,
									service: service
								};
								var url='http://localhost:8182/discoveryagent/upnp/actions';
								var promise = $.ajax({
									url: url,
									data: dato,
									dataType: 'jsonp',
									crossDomain: true,
									jsonp: 'callback',
									jsonpCallback: 'actionsUpnp',
								})
								.done(function(data, textStatus, jqXHR) {resolve(data)})
								.fail(function(jqXHR, textStatus, errorThrown) {
									if(jqXHR.status==404) resolve(JSON.parse('{"actions":"Service Not Working"}'));
									else resolve(JSON.parse('{"actions":false}'));
								});
							});
						return p1;
					};
				};

				/**
				 * getParameters
				 *
				 * The getActions function returns the list of actions using Promise.
				 *
				 * @return {Promise<JSON|Error>} The Promise wiht the list of actions or error message.
				 *
				 */

				this.getParameters = function(technology, device, service, action){
					if(technology){
						if(technology.toLowerCase().indexOf("upnp")!=-1){
							return upnpGetParameters(device, service, action);
						}else if(technology.toLowerCase().indexOf("bluetooth")!=-1){
								return bluetoothGetParameters(device, service, action);
							}
					}
					function bluetoothGetParameters(device, service, action){
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var dato={
									device: device,
									service: service,
									action: action
								};
								var url="http://localhost:8182/discoveryagent/bluetooth/parameters";
								var promise = $.ajax({
									url: url,
									data: dato,
									dataType: "jsonp",
									crossDomain: true,
									jsonp: "callback",
									jsonpCallback: "parametersBluetooth"
								})
								.done(function(data, textStatus, jqXHR) {resolve(data)})
								.fail(function(jqXHR, textStatus, errorThrown) {
									if(jqXHR.status==404) resolve(JSON.parse('{"actions":"Service Not Working"}'));
									else resolve(JSON.parse('{"actions":false}'));
								});
							});
						return p1;
					};

					function upnpGetParameters(device, service, action) {
						var p1= new Promise(
							function(resolve,reject){
								var deferred = $.Deferred();
								var dato={
									device: device,
									service: service,
									action: action
								};
								var url='http://localhost:8182/discoveryagent/upnp/parameters';
								var promise = $.ajax({
									url: url,
									data: dato,
									dataType: 'jsonp',
									crossDomain: true,
									jsonp: 'callback',
									jsonpCallback: 'parametersUpnp',
								})
								.done(function(data, textStatus, jqXHR) {resolve(data)})
								.fail(function(jqXHR, textStatus, errorThrown) {
									if(jqXHR.status==404) resolve(JSON.parse('{"actions":"Service Not Working"}'));
									else resolve(JSON.parse('{"actions":false}'));
								});
							});
						return p1;
					};
				};
	};
	Discovery.__moduleName = "discovery";

	return Discovery;
});
