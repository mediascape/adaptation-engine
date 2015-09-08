##Hello World Example for Adaptation Engine


## Navigation
[Installation][] | [Prerequisite][] | [Deployment][]  | [Run][]

###Installation
####Prerequisite
* Install git
* Install node.js and npm
* Install mongodb
* Install bower and three Google web components (google-chart, google-map, and google-streetview-pano)
* Start mongodb

####Deployment
Next to this file you will find a script called `deploy.sh`.  
This script will clone the git and install everything in a folder called `deploy` relative to the file itsself. It will copy the [server](../Server) and the [API](../API) including this HelloWorld sample. After preparing the files, the script will install all needed dependencies for the backend and start a small setup-script to configure it.   
Please dont execute it inside the git folder. Best practice is to download just the the `.sh` file and execute.  

### Run
After everything is set up, and the node.js server is started, you can access the demo using the url (depending on your setup): 
```
    http://localhost:8080/index.html
```
When the page is loaded, three web components will be shown. 
Once the second device joins, those web components will be distributed over two devices according to the rule file, called "rules.json". 
By changing the rules, we can play with the hybrid adaptation engine to try different adaptation behavior. 

Any time later you can start the node.js server via:

```bash
node index.js
```

[Installation]: #installation
[Prerequisite]: #prerequisite
[Deployment]: #deployment
[Run]: #run
