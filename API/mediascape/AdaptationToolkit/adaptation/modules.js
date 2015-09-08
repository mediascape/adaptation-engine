/*
** Long Library Name:
**      Adaptation toolkit Module
**
** Acronym and its version:
**      Adaptation toolkit v1.0
**
** Copyright claim:
**      Copyright ( C ) 2013-2014 Vicomtech-IK4 ( http://www.vicomtech.org/ ),
**      all rights reserved.
**
** Authors (in alphabetical order):
**      Ana Dominguez <adominguez@vicomtech.org>
**      Iñigo Tamayo <itamayo@vicomteh.org>,
**      Mikel Zorrila <mzorrilla@vicomtech.org>,
**
** Description:
**      The Adaptation toolkit Module finds the modules defined in the folder
**      "UIAdaptation/" and "multiDeviceAdaptation/" and returns the objects and functions defined.
**
** Development Environment:
**      The software has-been Implemented in JavaScript, and tested in Chrome and firefox
**      browsers.
**
** Dependencies:
**      As accounts package depends on other libraries, the user must adhere to and
**      keep in place any Licencing terms of those libraries:
**              requirejs v2.1.14 (http://requirejs.org/)
**
** Licenses dependencies:
**      License Agreement for requirejs:
**              BSD 3-Clause license (http://opensource.org/licenses/BSD-3-Clause)
**              MIT license (http://opensource.org/licenses/MIT)
**
*/

define(
  [	"mediascape/AdaptationToolkit/adaptation/multiDeviceAdaptation/mdadaptation"
  ],
  function(){
    var adaptation = {};
    var moduleList   = Array.prototype.slice.apply( arguments );
    var adaptation =  function Adaptation( AdaptationToolkit, _AdaptationToolkit, config ){
      var modules = [],
      loadedModules = 0,
      readyModules = 0;

      for( var i=0; i<moduleList.length; ++i ){
        var name = moduleList[ i ].__moduleName;

        adaptation[ name ] = new moduleList[ i ]( adaptation, "gq"+i, adaptation );
        //modules.push( adaptation[ name ] );
      }
      this.__moduleName = "Adaptation";
      return adaptation;
    };
    adaptation.__moduleName = "Adaptation";
    return adaptation;

  });
