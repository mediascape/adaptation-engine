### MappingService
#### Constructor
Returns a mappingService Object
```js
var map = mediascape.mappingService(url, options);
```
param: {string} [url=window.location] The url where the mappingService Server is located  
param: {Object} [options]  
param: {string} [options.userId] If the backend is without authentication, you have to set the userId  
returns: {Object} mappingService

---
#### .on()
Registers an Eventhandler
```js
map.on(what, foo);
```
param: {string} what : Name of the Event, possible values: 'readystatechange'  
param: {function} foo : The function which should get called  
returns: {Object} mappingService

---
#### .off()
Removes an Eventhandler
```js
map.off(what, foo);
```
param: {string} what : Name of the Event, possible values: 'readystatechange'  
param: {function} foo : The function which should get removed  
returns: {Object} mappingService

---
#### .getUserMapping()
Returns the requested scopes for this userId and appId
```js
var userMapping = map.getUserMapping(appId, scopeList);
```
param: {string} appId : ID of the application  
param: {Array} scopeList : The requested Scopes, possible values 'user', 'userApp' and 'app'  
returns: {Object} Promise : returns the requested scopes

---
#### .getGroupMapping()
Returns the requested scope for a groupId
```js
var groupMapping = map.getGroupMapping(groupId);
```
param: {string} groupId : ID of the group  
returns: {Object} Promise : returns the requested scopes

---
#### Example
```js
var map = mediascape.mappingService();
map.getUserMapping(APP_ID, ['user', 'app', 'userApp']).then(function (data) {
 var sharedstate = mediascape.sharedState(data.user);
 ...
})

```