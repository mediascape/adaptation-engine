#Server

This folder contains the backend for the Application-Context library developed for [MediaScape project](http://mediascapeproject.eu/).
The backend provides a connection for the MappingService and the Sharedstate which provide the underlying functions for the Application-Context.


## Navigation
[Installation][] | [Configuration][] | [Authentication & Redirect][]


## Installation
Before you can start:
* Install node.js and npm
* Install mongodb
* start mongodb
* download this package
* run `node setup.js`or adapt the `config.js` to your needs

To install all needed dependencies run
```bash
npm install
```
next to the `package.json`. Then simply run
```bash
node index.js
```
to start the server.

## Configuration (config.js)
`config.auth.*` contains the needed parts for the authentication:
* `useAuthentication`: true/false - authentication enabled (change it to false in this example)
* `GOOGLE_CLIENT_ID`: obtain from [Google Dev Console](https://console.developers.google.com/project)
* `GOOGLE_CLIENT_SECRET`: obtain from [Google Dev Console](https://console.developers.google.com/project)
* `GOOGLE_CALLBACK_URL`: your domain + /auth/google/callback

`config.mongoose.uri`: contains the uri of the database  

`config.express.port`: the port used by express (http-server)

## Authentication & redirect
If the authentication is enabled, you need to logon before you can use the mapping/sharedstate. To do so, point your browser to `http://yourdomain.xy/auth/google`. If you want to use another service to host the website its also possible to redirect after authentication. To do so, you can link from anywhere to `http://yourdomain.xy/auth/google?redirectMS=http://www.whereToRedirect.xy` and after authentication the server will redirect to `http://www.whereToRedirect.xy`


[Installation]: #installation
[Configuration]: #configuration-configjs
[Authentication & Redirect]: #authentication--redirect