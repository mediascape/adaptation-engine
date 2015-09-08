### ApplicationContext
#### Constructor
Returns a ApplicationContext Object
```js
var appContext = mediascape.applicationContext(url, options);
```
param: {string} [url=window.location] The url where the mappingService Server is located  
param: {Object} [options]  
param: {string} [options.userId] If the backend is without authentication, you have to set the userId  
param: {string} [options.agentid] The AgentID to use. If not supplied a random one will be used  
param: {Boolean} [options.autoClean=false] If true, data from unknown agents will get deleted in a regular base  
returns: {Object} ApplicationContext

---
#### .on()
Registers an Eventhandler
```js
appContext.on(what, foo);
```
param: {string} what : Name of the Event, possible value: 'agentchange'  
param: {function} foo : The function which should get called 

---
#### .off()
Removes an Eventhandler
```js
appContext.off(what, foo);
```
param: {string} what : Name of the Event, possible value: 'agentchange'  
param: {function} foo : The function which should get removed  

---
#### .getAgents()
Returns a map of known remoteAgents, including .self
```js
appContext.getAgents();
```
returns: {Object} remoteAgents

---
### remoteAgents
#### .agentid
The agentid of this agent. read-only
```js
remoteAgent.agentid
```
---
#### .on()
Registers an Eventhandler
```js
remoteAgent.on(what, foo);
```
param: {string} what : Name of the Event, possible values are all available contextual parameters ('geolocation', 'screenSize', ...)  
param: {function} foo : The function which should get called 

---
#### .off()
Removes an Eventhandler
```js
remoteAgent.off(what, foo);
```
param: {string} what : Name of the Event, possible values are all available contextual parameters ('geolocation', 'screenSize', ...)  
param: {function} foo : The function which should get removed  

---
#### .keys()
Returns a list of all available contextual parameters
```js
remoteAgent.keys();
```
returns: {Array} contextParameter

---
#### .setItem()
Set or add a parameter
```js
remoteAgent.setItem(what, value);
```
param: {string} what : Name of the parameter to set.  
param: {string|Object} value : The value which should be set

---
#### .capabilities()
Returns a list of capabilities
```js
remoteAgent.capabilities();
```
returns: {Array} agentCapabilities