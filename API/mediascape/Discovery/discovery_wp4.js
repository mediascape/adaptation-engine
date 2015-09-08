define(["mediascape/Discovery/discovery","mediascape/Agentcontext/agentcontext", "shake" ], function (agentContext, Shake) {
	var DiscoveryWP4 = function () {
		// Synchronous items first
		var ac = mediascape.agentContext;
		var instruments = {};

		/****************************************************************************************************************
		*
		*	UPNP
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the upnp agent, 
		*	if the agent exists, the system sets the upnp status as supported, unless it will be set as 
		*	unsupported. Then it will initialize upnp value calling to mediascape.discovery.getDevices 
		*	and returning the list of ids of the services available to consume by upnp.
		*
		******************************************************************************************************************/
/*
		mediascape.discovery.isPresent("upnp").then(function(data){
			console.log("upnp: "+data.presence);
			if(data.presence==true){
				var instrument = {
					init: function () {
						this.setCapability("upnp", "supported");
						mediascape.discovery.getDevices("upnp").then(function(data){
							ac.setItem("upnp", data.devices);
						});
					}
				}
				ac.load({
					"upnp": instrument
				});
			}
		});

*/
		
		/****************************************************************************************************************
		*
		*	Bluetooth
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the bluetooth 
		*	agent, if the agent exists, the system sets the bluetooth status as supported, unless it will 
		*	be set as unsupported. Then it will initialize bluetooth value calling to mediascape.discovery.getDevices 
		*	and returning the list of ids of the devices available to connect by bluetooth.
		*
		******************************************************************************************************************/
/*
		mediascape.discovery.isPresent("bluetooth").then(function(data){
			console.log("Bluetooth: "+data.presence);
			if(data.presence==true){
				var instrument = {
					init: function () {
						this.setCapability("bluetooth", "supported");
						mediascape.discovery.getDevices("bluetooth").then(function(data){
							ac.setItem("bluetooth", data.devices);
						});
					}
				}
				ac.load({
					"bluetooth": instrument
				});
			}
		});
*/

		/****************************************************************************************************************
		*
		*	NamedWebSockets
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the 
		*	NamedWebSockets agent, if the agent exists, the system sets the namedwebsockets status 
		*	as supported, unless it will be set as unsupported. Then it will initialize namedwebsockets 
		*	value calling to mediascape.discovery.getDevices and returning the list of ids of the 
		*	devices connected to namedwebsockets "mediascape".
		*
		******************************************************************************************************************/

		mediascape.discovery.isPresent("namedwebsockets").then(function(data){
			console.log("namedwebsockets: "+data.presence);
			if(data.presence==true){
				var instrument = {
					init: function () {
						this.setCapability("namedwebsockets", "supported");
						mediascape.discovery.connectNWS("mediascape").then(function(e){
							//console.log(e);
							if(e!=null){
								mediascape.discovery.getDevices("namedwebsockets").then(function(data){
									ac.setItem("namedwebsockets", data.devices);
								});
							}
						});
					}
				}
				ac.load({
					"namedwebsockets": instrument
				});
			}
		});

		/****************************************************************************************************************
		*
		*	Screen Size
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the screen size 
		*	agent, if the agent exists, the system sets the screenSize status as supported, unless it will 
		*	be set as unsupported. Then it will initialize screenSize value calling to mediascape.discovery.getExtra 
		*	and returning the size of the screen of the device and will define on and off functions to 
		*	subscribe to an event. This event will return the changes hapened on the size of the screen.
		*
		******************************************************************************************************************/

		// Screen size
		mediascape.discovery.isPresent("screensize").then(function(data){
			if(data.presence){
				function listener(){
					mediascape.discovery.getExtra("screensize").then(function(data){
						ac.setItem("screenSize", [data.extra[0].width, data.extra[0].height]);
					});
				}
				var instrument = {
					init: function () {
						this.setCapability("screenSize", "supported");
						listener();
					},
					on: function () {
						window.addEventListener("resize", listener);
					},
					off: function () {
						window.onresize = null;
					}
				}
				ac.load({
					"screenSize": instrument
				});
			}
		});

		/****************************************************************************************************************
		*
		*	Language
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the language agent, 
		*	if the agent exists, the system sets the language status as supported, unless it will be set as 
		*	unsupported. Then it will initialize language value calling to mediascape.discovery.getExtra and 
		*	returning the language of the device.
		*
		******************************************************************************************************************/

		mediascape.discovery.isPresent("language").then(function(data){
			if(data.presence){
				var instrument = {
					init: function () {
						this.setCapability("language", "supported");
						mediascape.discovery.getExtra("language").then(function(data){
							ac.setItem("language", data.extra.language);
						});
					}
				}
				ac.load({
					"language": instrument
				});
			}
		});

		// Platform
		if (navigator.platform) {
			instruments.platform = {
				init: function () {
					this.setCapability("platform", "supported");
					ac.setItem("platform", navigator.platform);
				}
			}
		}

		// Product
		if (navigator.product) {
			instruments.navigatorProduct = {
				init: function () {
					this.setCapability("navigatorProduct", "supported");
					ac.setItem("navigatorProduct", navigator.product);
				}
			}
		}

		// Online?
		if (navigator.onLine) {
			instruments.onLine = {
				init: function () {
					this.setCapability("onLine", "supported");
					ac.setItem("onLine", navigator.onLine);
				}
			}
		}

		/****************************************************************************************************************
		*
		*	deviceType
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the deviceType agent, 
		*	if the agent exists, the system sets the deviceType status as supported, unless it will be set as 
		*	unsupported. Then it will initialize deviceType value calling to mediascape.discovery.getExtra and 
		*	returning the type of the device.
		*
		******************************************************************************************************************/

		mediascape.discovery.isPresent("deviceType").then(function(data){
			if(data.presence){
				var instrument = {
					init: function () {
						this.setCapability("deviceType", "supported");
						mediascape.discovery.getExtra("deviceType").then(function(data){
							ac.setItem("deviceType", data.extra.deviceType);
						});
					}
				}
				ac.load({
					"deviceType": instrument
				});
			}
		});

		/****************************************************************************************************************
		*
		*	User Proximity
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the geolocation 
		*	agent, if the agent exists, the system sets the geolocation status as supported, unless it will 
		*	be set as unsupported.Then it will initialize geolocation value calling to mediascape.discovery.getExtra 
		*	and returning the state of the geolocation senson of the device and will define on and off functions 
		*	to subscribe to an event. This event will return the changes hapened on the geolocation sensor.
		*
		******************************************************************************************************************/

		// Geolocation
		mediascape.discovery.isPresent("geolocation").then(function(data){
			if(data.presence){
				// TODO: check if geolocation actually returns something (seems to not do it on my non-gps enabled desktop)
				var wid;
				var instrument = {
					init: function () {
						this.setCapability("geolocation", "supported");
						mediascape.discovery.getExtra("geolocation").then(function(data){
							ac.setItem("geolocation", data.extra);
						});
					},
					on: function () {
						if (navigator.geolocation) {
							wid = navigator.geolocation.watchPosition(function (position) {
								ac.setItem("geolocation",[{"latitude":position.coords.latitude},{"longitude":position.coords.longitude}]);
							});
						}
					},
					off: function () {
						navigator.geolocation.clearWatch(wid);
					}
				}
				ac.load({
					"geolocation": instrument
				});
			}
		});

		/****************************************************************************************************************
		*
		*	User Proximity
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the user proximity 
		*	agent, if the agent exists, the system sets the userProximity status as supported, unless it will 
		*	be set as unsupported.Then it will initialize userProximity value calling to mediascape.discovery.getExtra 
		*	and returning the state of the user proximity senson of the device and will define on and off functions 
		*	to subscribe to an event. This event will return the changes hapened on the user proximity sensor.
		*
		******************************************************************************************************************/

		// UserProximity
		mediascape.discovery.isPresent("userProximity").then(function(data){
			if(data.presence){
				function listener() {
					mediascape.discovery.getExtra("userProximity").then(function(data){
						ac.setItem("userProximity", data.extra.userProximity);
					});
				}
				var instrument = {
					init: function () {
						this.setCapability("userProximity", "supported");
					},
					on: function () {
						window.addEventListener("userProximity", listener);
						listener();
					},
					off: function () {
						window.removeEventListener("userProximity", listener);
					}
				}
				ac.load({
					"userProximity": instrument
				});
			}
		});

		/****************************************************************************************************************
		*
		*	Device Proximity
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the device proximity 
		*	agent, if the agent exists, the system sets the deviceProximity status as supported, unless it will 
		*	be set as unsupported.Then it will initialize deviceProximity value calling to mediascape.discovery.getExtra 
		*	and returning the state of the device proximity senson of the device and will define on and off functions 
		*	to subscribe to an event. This event will return the changes hapened on the device proximity sensor.
		*
		******************************************************************************************************************/

		// DeviceProximity
		mediascape.discovery.isPresent("deviceProximity").then(function(data){
			if(data.presence){
				function listener() {
					mediascape.discovery.getExtra("deviceProximity").then(function(data){
						ac.setItem("deviceProximity", data.extra.deviceProximity);
					});
				}
				var instrument = {
					init: function () {
						this.setCapability("deviceProximity", "supported");
					},
					on: function () {
						window.addEventListener("deviceProximity", listener);
						listener();
					},
					off: function () {
						window.removeEventListener("deviceProximity", listener);
					}
				}
				ac.load({
					"deviceProximity": instrument
				});
			}
		});

		/****************************************************************************************************************
		*
		*	Touch Screen
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the touchScreen 
		*	agent, if the agent exists, the system sets the touchScreen status as support, unless it will be set 
		*	as unsupported.
		*
		******************************************************************************************************************/

		mediascape.discovery.isPresent("touchscreen").then(function(data){
			if(data.presence){
				var instrument = {
					init: function () {
						this.setCapability("touchScreen", "supported");
					}
				}
				ac.load({
					"touchScreen": instrument
				});
			}
		});

		/****************************************************************************************************************
		*
		*	Vibration
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the vibration agent, if 
		*	the agent exists, the system sets the vibration status as maybe, unless it will be set as unsupported.
		*
		******************************************************************************************************************/

		// Vibration
		mediascape.discovery.isPresent("vibration").then(function(data){
			if(data.presence){
				var instrument = {
					init: function () {
						this.setCapability("vibrate", "maybe") // Chrome on my desktop believes it can vibrate, even returns true to vibrate(time)...
					}
				}
				ac.load({
					"vibration": instrument
				});
			}
		});

		// Device orientation
		if (window.DeviceOrientationEvent) {
			// TODO: Downsample, convert to something more useful?
			var events = [];
			var last_report = 0;

		 	function average(dataset, key) {
				var count = 0;
				var val = 0.0;
				for (var i in dataset) {
					val += dataset[i][key];
					count++;
				}
				return val / count;
			}

			function orientationHandler(e) {
				var event = {
					alpha: e.alpha,
					beta: e.beta,
					gamma: e.gamma
				}
				events.push(event);
				var now = new Date();
				if (now - last_report > 150) {
					// Average
					var event = {
						alpha: average(events, "alpha"),
						beta: average(events, "beta"),
						gamma: average(events, "gamma")
					};
					ac.setItem("deviceOrientation", event);
					events = [];
					last_report = now;
				}
			}

			instruments.deviceOrientation = {
				init: function () {
					var t = this;
					this.setCapability("deviceOrientation", "unsupported");

					function test(e) {
						window.ondeviceorientation = null;
						if (e.gamma == null && e.beta == null && e.alpha == null) {
							t.setCapability("deviceOrientation", "unsupported");
						} else {
							t.setCapability("deviceOrientation", "supported");
						}
					}
					window.ondeviceorientation = test;
				},
				on: function () {
					window.addEventListener("deviceorientation", orientationHandler);
				},
				off: function () {
					window.removeEventListener("deviceorientation", orientationHandler);
				}
			}
		}

		/****************************************************************************************************************
		*
		*	Screen Orientation
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the screen orientation 
		*	agent, if the agent exists, the system sets the orientation status as supported, unless it will be set 
		*	as unsupported. Then it will initialize orientation value calling to mediascape.discovery.getExtra and 
		*	returning the orientation of the device and will define on and off functions to subscribe to the events. 
		*	This events will return the changes hapened on orientation.
		*
		******************************************************************************************************************/

		mediascape.discovery.isPresent("orientation").then(function(data){
			if(data.presence){
				function handler() {
					mediascape.discovery.getExtra("orientation").then(function(data){
						ac.setItem("orientation", data.extra.orientation);
					});
				}
				var instrument = {
					init: function () {
						this.setCapability("orientation", "supported");
						handler();
					},
					on: function () {
						if(screen.orientation) window.addEventListener("orientationchange", handler);
						else if(screen.msorientation || screen.mozOrientation){
							window.addEventListener("orientationchange", handler);
							window.addEventListener("MozOrientation", handler);
							//we use resize because in some products orientationchange & MozOrientation have not been implemented
							window.addEventListener("resize", handler);
						}
						// Trigger handling now
						handler();
					},
					off: function () {
						window.removeEventListener("orientationchange", handler);
						window.removeEventListener("MozOrientation", handler);
					}
				}
				ac.load({
					"orientation": instrument
				});
			}
		});

		// Device motion
		if (window.DeviceMotionEvent) {
			var motions = [];
			var last_motion_report = 0;

			function average(dataset, key) {
				var count = 0;
				var val = 0.0;
				for (var i in dataset) {
					val += dataset[i][key];
					count++;
				}
				return val / count;
			}

			// Bind to sensors
			var on_device_motion = function (event) {
				var x = event.accelerationIncludingGravity.x;
				var y = event.accelerationIncludingGravity.y;
				var z = event.accelerationIncludingGravity.z;
				var val = {
					x: x,
					y: y,
					z: z,
					xAngle: Math.atan2(y, z),
					yAngle: Math.atan2(x, z),
					zAngle: Math.atan2(x, y)
				};

				motions.push(val);
				var now = new Date();
				if (now - last_motion_report > 150) {
					// Create averages
					var v = {
						x: average(motions, "x"),
						y: average(motions, "y"),
						z: average(motions, "z"),
						xAngle: average(motions, "xAngle"),
						yAngle: average(motions, "yAngle"),
						zAngle: average(motions, "zAngle"),
					};
					ac.setItem("deviceMotion", v)
					motions = [];
					last_motion_report = now;
				}
			}

			instruments.deviceMotion = {
				init: function () {
					this.setCapability("deviceMotion", "unsupported");
					var t = this;
					motiontest = function (e) {
						window.ondevicemotion = null;
						if (e.acceleration.x == null && e.acceleration.y == null && e.acceleration.z == null) {
							t.setCapability("deviceMotion", "unsupported");
						} else {
							t.setCapability("deviceMotion", "supported");
						}
					}

					if (window.DeviceMotionEvent == undefined) {
						t.setCapability("deviceMotion", "unsupported");
					} else {
						// Can't use addEventListener as Android fails to unregister it later!
						window.ondevicemotion = motiontest;
					};
				},
				on: function () {
					window.addEventListener("devicemotion", on_device_motion, false);
				},
				off: function () {
					window.removeEventListener("devicemotion", on_device_motion);
				}
			}
		}

		// Shake - require shake.js to work
		if (Shake) {
			window.myShakeEvent = new Shake({
				threshold: 3, // optional shake strength threshold
				timeout: 100 // optional, determines the frequency of event generation
			});
		}
		if (window.DeviceMotionEvent && window.myShakeEvent) {
			instruments.shake = {
				init: function () {
					var t = this;
					this.setCapability("shake", "unsupported");
					motiontest = function (e) {
						window.ondevicemotion = null;
						if (e.acceleration.x == null && e.acceleration.y == null && e.acceleration.z == null) {
							t.setCapability("shake", "unsupported");
						} else {
							t.setCapability("shake", "supported");
							var timer;
							window.addEventListener("shake", function () {
								if (timer) {
									clearTimeout(timer);
									timer = null;
								} else {
									ac.setItem("shake", true);
								}
								timer = setTimeout(function () {
									ac.setItem("shake", false);
									timer = null;
								}, 500);
							}, false);
						}
					}
					// Can't use addEventListener as Android fails to unregister it later!
					window.ondevicemotion = motiontest;
				},
				on: function () {
					window.myShakeEvent.start();
				},
				off: function () {
					window.myShakeEvent.stop();
				}
			}
		}

		/****************************************************************************************************************
		*
		*	Connection
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the connection agent, if 
		*	the agent exists, the system sets the connection status as supported, unless it will be set as unsupported.
		*	Then it will initialize connection value calling to mediascape.discovery.getExtra and returning the type 
		*	of the connection of the device and will define on and off functions to subscribe to a event. This events 
		*	will return the changes hapened on connection type.
		*
		******************************************************************************************************************/

		mediascape.discovery.isPresent("connection").then(function(data){
			if(data.presence){
				function update() {
					mediascape.discovery.getExtra("connection").then(function(data){
						ac.setItem("connection", data.extra.connection);
					});
				}
				var instrument = {
					init: function () {
						this.setCapability("connection", "supported");
						update();
					},
					on: function () {
						navigator.connection.ontypechange = update;
					},
					off: function () {
						navigator.connection.ontypechange = null;
					}
				}
				ac.load({
					"connection": instrument
				});
			}
		});

		// Pointer function for touch screens
		if (instruments.touchScreen) {
			instruments.pointer = { // Add pointer movements @10hz max
				init: function () {
					this.setCapability("pointer", "supported");
				},
				on: function () {
					var startpos = [null, null];
					document.ontouchstart = function (event) {
						var touchobj = event.changedTouches[0];
						startpos = [touchobj.clientX, touchobj.clientY];
					}
					var last_report = 0;
					document.ontouchmove = function (event) {
						if (new Date() - last_report > 100) {
							last_report = new Date();
							var touchobj = event.changedTouches[0];
							ac.setItem("pointer", {
								x: touchobj.clientX,
								y: touchobj.clientY,
								deltaX: touchobj.clientX - startpos[0],
								deltaY: startpos[1] - touchobj.clientY
							});
						}
					};
				},
				off: function () {
					document.ontouchstart = null;
					document.ontouchmove = null;
				}
			}
		}

		// Load them
		ac.load(instruments);

		// Asynchronous items

		/****************************************************************************************************************
		*
		*	Video
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the audio agent, if 
		*	the agent exists, the system sets the video status as supported, unless it will be set as unsupported.
		*	Then it will initialize audio value calling to mediascape.discovery.getExtra and returning the number 
		*	of audio elements of the device.
		*
		******************************************************************************************************************/

		//audio
		mediascape.discovery.isPresent("audio").then(function(data){
			if(data.presence){
				var instrument = {
					init: function () {
						this.setCapability("microphone", "supported");
						mediascape.discovery.getExtra("audio").then(function(data){
							ac.setItem("microphone", data.extra.audio);
						});
					}
				}
				ac.load({
					"microphone": instrument
				});
			}
		});

		/****************************************************************************************************************
		*
		*	Camera
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of the camera agent,if 
		*	the agent exists, the system sets the camera status as supported, unless it will be set as unsupported.
		*	Then it will initialize video value calling to mediascape.discovery.getExtra and returning the number 
		*	of cameras of the device.
		*
		******************************************************************************************************************/

		mediascape.discovery.isPresent("camera").then(function(data){
			if(data.presence){
				var instrument = {
					init: function () {
						this.setCapability("camera", "supported");
						mediascape.discovery.getExtra("camera").then(function(data){
							ac.setItem("camera", data.extra.cameras);
						});
					}
				}
				ac.load({
					"camera": instrument
				});
			}
		});

		/****************************************************************************************************************
		*
		*	Battery
		*
		*		Calls mediascape.discovery.isPresent function to detect the presence of th battery agent, 
		*	if the agent exists, the system sets the battery status as supported, unless it is set as unsupported. 
		*	Then it will initialize battery value calling to mediascape.discovery.getExtra and will define on and 
		*	off functions to subscribe to different events. This events will return the changes hapened on battery 
		*	level changes, on battery charging changes on battery discharging time changes.
		*
		******************************************************************************************************************/

		mediascape.discovery.isPresent("battery").then(function(data){
			if(data.presence){
				function updateBattery() {
					mediascape.discovery.getExtra("battery").then(function(data){
						var state = {
							"level": data.extra.level,
							"charging": data.extra.charging,
							"dischargeTime": data.extra.dischargeTime
						};
						ac.setItem("battery", state);
					});
				}
				var instrument = {
					init: function () {
						this.setCapability("battery", "supported");
						updateBattery();
					},
					on: function () {
						if (navigator.getBattery) {
							navigator.getBattery().then(function (battery) {
								battery.onlevelchange = function () {
									updateBattery();
								};
								battery.onchargingchange = function () {
									updateBattery();
								};
								battery.ondischargingtimechange = function () {
									updateBattery();
								};
							});
						}else if (navigator.battery) {
								navigator.battery.onlevelchange = function () {
									updateBattery();
								};
								navigator.battery.onchargingchange = function () {
									updateBattery();
								};
								navigator.battery.ondischargingtimechange = function () {
									updateBattery();
								};
							}
					},
					off: function () {
						if (navigator.getBattery) {
							navigator.getBattery().then(function (battery) {
								battery.onlevelchange = undefined;
								battery.onchargingchange = undefined;
								battery.ondischarchingtimechange = undefined;
							});
						}else if (navigator.battery) {
								navigator.battery.onlevelchange = undefined;
								navigator.battery.onchargingchange = undefined;
								navigator.battery.ondischarchingtimechange = undefined;
							}
					}
				};
				ac.load({
					"battery": instrument
				});
			}
		});
	};

	DiscoveryWP4.__moduleName = "discovery_wp4";

	return DiscoveryWP4;
});
