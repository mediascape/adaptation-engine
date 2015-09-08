### AgentContext
#### Constructor
Returns a AgentContext Object
```js
var agent = mediascape.agentContext();
```
returns: {Object} agentContext

---
#### .on()
Registers an Eventhandler
```js
agent.on(what, foo);
```
param: {string} what : Name of the Event, possible values are all available contextual parameters ('geolocation', 'screenSize', ...)  
param: {function} foo : The function which should get called    
returns: {Object} agentContext

---
#### .off()
Removes an Eventhandler
```js
agent.off(what, foo);
```
param: {string} what : Name of the Event, possible values are all available contextual parameters ('geolocation', 'screenSize', ...)  
param: {function} foo : The function which should get removed  
returns: {Object} agentContext

---
#### .keys()
Returns a list of all available contextual parameters
```js
agent.keys();
```
returns: {Array} contextParameter

---
#### .setItem()
Set or add a parameter
```js
agent.setItem(what, value);
```
param: {string} what : Name of the parameter to set.  
param: {string|Object} value : The value which should be set  
returns: {Object} agentContext

---
#### .setCapability()
Set or add a capability
```js
agent.setCapability(what, value);
```
param: {string} what : Name of the capability to set.  
param: {string|Object} value : The value which should be set (e.g. (“audio”, “supported”))  
returns: {Object} agentContext

---
#### .capabilities()
Returns a list of capabilities
```js
agent.capabilities();
```
returns: {Array} agentCapabilities
