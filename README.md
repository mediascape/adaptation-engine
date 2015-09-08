#Adaptation Engine


## Navigation
[Goals][] | [Structure][] | [Authors][] | [License][]

### Goals

As one of the core components in the MediaScape project, the adaptation engine is supposed to dynamically decide
which part of application content goes to which device, according to the current context and device capabilities.
Within the MediaScape project, application content has been abstracted as a set of web components that can be
distributed over multiple devices within a single application session. 

This deliverable includes the following two aspects: 

* API design and implementation of a distributed adaptation engine

For each agent in an MediaScape application session, it has an adaptation engine running in the background. 
The adaptation engine takes a JSON-based rule file provided by developers as its inputs, makes decisions 
about which components are to be shown or hiden on each agent according to the shared context provided by the Application Context.
After that, the decisions relevant to the current agent is forwarded to the local UI engine for displaying them properly. 

* A "hello world" example to show case how to use the APIs of the implemented multi-device adaptation engine

In this simple example we create a rule example to show how different types of rules can be defined to specify the adaptation behavior of a MediaScape application,
and how users can move or duplicate some web components from one device to another device. 
     
### Structure

  * [API](API/): The JavaScript API.
  * [helloworld](helloworld/): minimal sample code.
  * [Server](Server/): The serverside code

### Authors

- Bin Cheng (bin.cheng@neclab.eu)

### License

Copyright 2015 NEC Laboractories Europe, Heidelberg, Germany.  

under Licensed BSD 4-clause (see the "License" file)

[Goals]: #goals
[Structure]: #structure
[Authors]: #authors
[License]: #license
