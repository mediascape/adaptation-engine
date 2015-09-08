### SharedState
#### Constructor
Returns a SharedState Object
```js
var sharedState = mediascape.sharedState(url, options);
```
param: {string} [url=window.location] The url where the mappingService Server is located  
param: {Object} [options]  
param: {string} [options.userId] If the backend is without authentication, you have to set the userId  
param: {string} [options.agentid] The AgentID to use. If not supplied a random one will be used  
param: {Boolean} [options.autoPresence=true] If true, the presence is set to "online" when connected  
returns: {Object} SharedState  

---
#### .readyState
The current status of the connection. read-only
```js
sharedState.readyState
```
---
#### .agentid
The agentid used for this connection. read-only
```js
sharedState.agentid
```
---
#### .setPresence()
Sets the presence to value
```js
sharedState.setPresence(value);
```
param: {string} value : The value which should get set as presence (e.g. 'online', 'busy', 'disconnecting')  
returns: {Object} SharedState 

---
#### .on()
Registers an Eventhandler
```js
sharedState.on(what, foo);
```
param: {string} what : Name of the Event, possible values: 'readystatechange', 'presence', 'change', 'remove'  
param: {function} foo : The function which should get called  
returns: {Object} SharedState

---
#### .off()
Removes an Eventhandler
```js
sharedState.off(what, foo);
```
param: {string} what : Name of the Event, possible values: 'readystatechange', 'presence', 'change', 'remove'  
param: {function} foo : The function which should get removed   
returns: {Object} SharedState

---
#### .keys()
Returns an Array of the currenty keys in the sharedstate
```js
sharedState.keys();
```
returns: {Array} keys

---
#### .getItem()
Returns the value of an item in the sharedstate  
```js
sharedState.getItem(what);
```
param: {string} what : Name of the Item  
returns: {Object} value 

---
#### .setItem()
Sets an item in the sharedstate to value
```js
sharedState.setItem(what, value);
```
param: {string} what : Name of the Item  
param: {Object} value : The value to set to, can be any object which can be "stringified"  
returns: {Object} SharedState 

---
#### .removeItem()
Removes an item from sharedstate
```js
sharedState.removeItem(what);
```
param: {string} what : Name of the Item  
returns: {Object} SharedState

---
#### .request()
Starts a chainable request. All "setItem, removeItem" between .request() and .send() will be send as one transaction to the sharedState
```js
sharedState.request();
```
returns: {Object} SharedState

---
#### .send()
Stops and sends a chain of requests.
```js
sharedState.send();
```
returns: {Object} SharedState