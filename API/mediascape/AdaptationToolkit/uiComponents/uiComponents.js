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
**      All UI Components helpers are defined in this file. Notification components, compònents Menu
**      etc.
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
  ["jquery", "ui", "bootstrap"
  ],
  function($){

    uiComponents = function uiComponents(atk,i,atk){

        this.componentsMenu = function (){
      //Console.log();
        }
        this.actionMenu = function (){
      //Console.log();
        }
        this.customPanel = function(callback1,callback2,callback3){

          var customizePanel=document.createElement('div');
          customizePanel.style.width='220px';
          customizePanel.style.display='-webkit-flex';
          customizePanel.style.display='flex';
          customizePanel.style.flexDirection='row';
          customizePanel.id='customizePanel';
          
           var onoff=function(){
            currentvalue = document.getElementById('enableButton').value;
            if(currentvalue == "Off"){
              document.getElementById("enableButton").value="On";
              callback1.call();              
              EnableButton.innerHTML='DISABLE';
              var resize=document.createElement('img');
              resize.src='../resources/images/disable.png';
              resize.style.height='20px';
              resize.style.width='20px';
              EnableButton.appendChild(resize);
            }else{
              document.getElementById("enableButton").value="Off";
              callback2.call();
              EnableButton.innerHTML='ENABLE ';
              var resize=document.createElement('img');
              resize.src='../resources/images/resize.png';
              resize.style.height='20px';
              resize.style.width='20px';
              EnableButton.appendChild(resize);
            }

          }                

          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = '.enableButton:hover{border-color: #666 #aaa #bbb #888;  border-width:4px 3px 3px 4px;background-image:radial-gradient(circle,#CCFFFF,#66CCFF);#CCFFFF;  color:#000;} ';
          document.getElementsByTagName('head')[0].appendChild(style);
          var EnableButton=document.createElement('div');     
          EnableButton.id='enableButton';
          EnableButton.className='EnableButton';
          EnableButton.value='Off';
          EnableButton.innerHTML='ENABLE ';
          EnableButton.onclick=onoff;

          EnableButton.style.transition='opacity .1s cubic-bezier(0.4, 0.0, 1, 1), color .1s cubic-bezier(0.4, 0.0, 1, 1)';
          EnableButton.style.height='100%';
          EnableButton.style.margin='0 12px';
          EnableButton.style.width='110px';
          EnableButton.style.textAlign='center';
          EnableButton.style.cursor='pointer';
          EnableButton.style.lineHeight='24px';
          var resize=document.createElement('img');
          resize.src='../resources/images/resize.png';
          resize.style.height='20px';
          resize.style.width='20px';
          EnableButton.appendChild(resize);

          customizePanel.appendChild(EnableButton);

         

          var register=function(){
            callback3.call();
            EnableButton.value='Off';
            EnableButton.innerHTML='ENABLE ';
            var resize=document.createElement('img');
            resize.src='../resources/images/resize.png';
            resize.style.height='20px';
            resize.style.width='20px';
            EnableButton.appendChild(resize);
          }

          var SaveButton=document.createElement('div');     
          //DisableButton.id='disableButton';
          SaveButton.innerHTML='REGISTER';
          SaveButton.onclick=register;
          SaveButton.className='enableButton';
          SaveButton.style.transition='opacity .1s cubic-bezier(0.4, 0.0, 1, 1), color .1s cubic-bezier(0.4, 0.0, 1, 1)';
          SaveButton.style.height='100%';
          SaveButton.style.margin='0 12px';
          SaveButton.style.width='110px';
          SaveButton.style.textAlign='center';
          SaveButton.style.cursor='pointer';
          SaveButton.style.lineHeight='24px';
          var save=document.createElement('img');
          save.src='../resources/images/save.png';
          save.style.height='20px';
          save.style.width='20px';
          SaveButton.appendChild(save);

          customizePanel.appendChild(SaveButton);

          customizePanel.style.position="absolute";
          customizePanel.style.top=0;
          customizePanel.style.right=20;
          customizePanel.style.height='48px';
          customizePanel.style.zIndex="999";
          customizePanel.style.boxShadow='0px 3px 2px rgba(0, 0, 0, 0.2)';
          customizePanel.style.fontFamily='RobotoDraft, "Helvetica Neue", Helvetica, Arial';
          customizePanel.style.backgroundColor='#66CCFF';
          customizePanel.style.color='#fff';
          document.body.appendChild(customizePanel);

          //web component
          /*
          var customizePanel=document.createElement('paper-tabs');

          customizePanel.selected='0';

          enableButton=document.createElement('paper-tab');
          enableButton.innerHTML='ENABLE';
          enableButton.onclick=callback1;

          disableButton=document.createElement('paper-tab');
          disableButton.innerHTML='DISABLE';
          disableButton.onclick=callback2;

          saveButton=document.createElement('paper-tab');
          saveButton.innerHTML='SAVE';
          saveButton.onclick=callback3;

          customizePanel.appendChild(enableButton);
          customizePanel.appendChild(disableButton);
          customizePanel.appendChild(saveButton);

          customizePanel.style.backgroundColor='#66CCFF';
          customizePanel.style.color='#fff';
          customizePanel.style.boxShadow='0px 3px 2px rgba(0, 0, 0, 0.2)';
          customizePanel.style.fontFamily='RobotoDraft, "Helvetica Neue", Helvetica, Arial';
          customizePanel.style.position='absolute';
          customizePanel.style.top=0;
          customizePanel.style.right=20;
          customizePanel.style.zIndex="999";

          document.body.appendChild(customizePanel);
          */




               
        }
        this.infoPanel = function (_title,content,width,x,y){
            var infopanel = document.createElement('div');
            var title = document.createElement('div');
            title.innerHTML=_title;
            title.style.textAlign="center";
            title.style.background="url(../resources/images/TitleBackground.png)";
            title.style.color = "white";
            infopanel.style.width = width;
            var contentdiv = document.createElement('div');
            contentdiv.style.background ="url(../resources/images/PaneBackground.png)";
            contentdiv.innerHTML=content;
            contentdiv.style.color="white";
            contentdiv.style.padding="5px";
            infopanel.style.position="absolute";
            infopanel.style.top=y;
            infopanel.style.left=x;
            infopanel.style.zIndex="999";
            infopanel.appendChild(title);
            infopanel.appendChild(contentdiv);
            document.body.appendChild(infopanel);
            setTimeout(function(){
              document.body.removeChild(infopanel);
            },6500);
        }
        this.notification=function(_title,message,time){
            var panel = document.createElement('div');
            var title = document.createElement('div');

            var icon=document.createElement('img');
            icon.src='../resources/images/notification.png';
            icon.style.width='12%';
            icon.style.height='3%';
            icon.style.position='relative';
            icon.style.cssFloat="left";

            title.appendChild(icon);
            title.innerHTML=title.innerHTML+"<span>"+_title+"</span>";
            title.style.textAlign="center";
            title.style.background="url(../resources/images/TitleBackground.png)";
            title.style.color = "white";
            panel.style.width = '200px';
            var contentdiv = document.createElement('div');
            contentdiv.style.background ="url(../resources/images/PaneBackground.png)";
            contentdiv.innerHTML=message;
            contentdiv.style.color="white";
            contentdiv.style.padding="5px";
            panel.style.position="absolute";
            panel.style.bottom='5%';
            panel.style.right='5%';
            panel.style.zIndex="999";
            panel.appendChild(title);
            panel.appendChild(contentdiv);
            document.body.appendChild(panel);
            setTimeout(function(){
              document.body.removeChild(panel);
            },time);
        }
        this.addMovablePanel = function (cmp){
          console.log("HEMEEEENNNNN");
          var panel = document.createElement('div');
          var title = document.createElement('div');

          var icon=document.createElement('img');
          var icondiv =document.createElement('span');
          //icondiv.style.position="relative";
          var timer = 0;

          if (mediascape.Agent.data['touchable']){
            Polymer.addEventListener(cmp,'touchend',function(event){
                /** chrome beta sends touchend instead of mouseup **/
                var mouseupEvent = document.createEvent ('MouseEvents');
                mouseupEvent.initEvent ('mouseup', true, true);
                cmp.dispatchEvent(mouseupEvent);
                console.log('mouseup');
            },false);
            console.log("barrruan2");
          Polymer.addEventListener(cmp,'holdpulse',function(event){
              console.log("HOLDPULSE");

              if (event.holdTime>1600){
              var agents = mediascape.Communication.getAgents();
              var panel = document.createElement('div');
              panel.style.backgroundColor="white";
              panel.style.opacity="0.85";
              panel.style.color="grey";
              panel.style.top=cmp.offsetTop;
              panel.style.left=cmp.offsetLeft;
              panel.style.width=cmp.clientWidth;
              panel.style.height=cmp.clientHeight;
              panel.style.zIndex="1001";
              panel.style.position="absolute";
              panel.id="movablediv";
              var p = document.createElement('p');
              p.innerHTML = 'Move to: close';
              p.style.background="grey";
              p.style.color="white";
              p.style.marginTop="20%";
              p.style.marginLeft="20%";
              p.style.marginRight="20%";
              p.style.fontSize="120%";
              p.addEventListener('tap',function(e){document.body.removeChild(panel);})
              panel.appendChild(p);
              agents.forEach(function(ag,i,ar){
                  var p = document.createElement('p');
                  p.id = ag.agentid;
                  if (ar.length ===1){
                    p.innerHTML ='no target';
                    p.style.padding="10px";
                    p.style.color='black';
                    p.style.marginLeft="20%";
                    p.style.testAlign="center";
                  }else{
                    if (ag.agentid !=mediascape.Agent.agentId)
                      {
                        p.innerHTML ='client:'+ag.agentid;
                        p.style.padding="10px";
                        p.style.marginLeft="20%";
                        p.style.cursor="pointer";
                        p.style.opacity="1.0";
                        p.addEventListener('click',function(e){
                          //e.preventDefault();
                          //e.stopPropagation();
                          var agenttomoveid =e.srcElement.id;
                          console.log(agenttomoveid);
                          document.body.removeChild(panel);
                          mediascape.AdaptationToolkit.Adaptation.multiDeviceAdaptation.setComponentToAgent(agenttomoveid,cmp);

                        },false);
                      }
                  }
                  panel.appendChild(p);
              });
              document.body.appendChild(panel);
              setTimeout(function(){ document.body.removeChild(panel);},3500);
            }
            return true;
        },false);
      }
      else {
          console.log("barrruan");
          Polymer.addEventListener(cmp,'holdpulse',function(e){


             // e.stopPropagation();
             if (event.holdTime>2000){
              timer=0;
              var agents = mediascape.Communication.getAgents();
              var panel = document.createElement('div');
              panel.style.backgroundColor="white";
              panel.style.opacity="0.85";
              panel.style.color="grey";
              panel.style.top=cmp.offsetTop;
              panel.style.left=cmp.offsetLeft;
              panel.style.width=cmp.clientWidth;
              panel.style.height=cmp.clientHeight;
              panel.style.zIndex="1001";
              panel.style.position="absolute";
              var p = document.createElement('p');
              p.innerHTML = 'Move to: ';
              p.style.background="grey";
              p.style.color="white";
              p.style.marginTop="20%";
              p.style.marginLeft="20%";
              p.style.marginRight="20%";
              p.style.fontSize="120%";
              panel.appendChild(p);
              agents.forEach(function(ag,i,ar){
                  var p = document.createElement('p');
                  p.id = ag.agentid;
                  if (ar.length ===1){
                    p.innerHTML ='no target';
                    p.style.padding="10px";
                    p.style.color='black';
                    p.style.marginLeft="20%";
                    p.style.testAlign="center";
                  }else{
                    if (ag.agentid !=mediascape.Agent.agentId)
                      {
                        p.innerHTML ='client:'+ag.agentid;
                        p.style.padding="10px";
                        p.style.marginLeft="20%";
                        p.style.cursor="pointer";
                        p.style.opacity="1.0";
                        p.addEventListener('click',function(e){
                          e.stopPropagation();
                          var agenttomoveid =e.srcElement.id;
                          console.log(agenttomoveid);
                          mediascape.AdaptationToolkit.Adaptation.multiDeviceAdaptation.setComponentToAgent(agenttomoveid,cmp);
                          document.body.removeChild(panel);
                        },false);
                      }
                  }
                  panel.appendChild(p);
              });
              document.body.appendChild(panel);
              setTimeout(function(){ document.body.removeChild(panel);},3500);
            }
        },true);
      }// NOT TOUCHABLE

      }
      this.resizable = function (cmp){
            console.log("test");
            $('div').resizable();
      }
      this.addAssociationPanel = function (url){
          var associationPanel = document.createElement('span');

          associationPanel.id ="associationPanel";
          associationPanel.style.width="15px";
          associationPanel.style.height='100%';
          associationPanel.style.backgroundColor='rgba(0,128,255,0.6)';
          associationPanel.style.position="absolute";
          associationPanel.style.top="0px";
          associationPanel.style.left="0px";
          associationPanel.style.zIndex="9999";
          associationPanel.style.transition="width 1.5s";
          var arrowPanel = document.createElement('img');
          arrowPanel.style.position="fixed";
          arrowPanel.src="../resources/images/arrow.png";
          arrowPanel.style.marginTop="30%";
          arrowPanel.style.marginLeft="4px";
          arrowPanel.width="30";
          arrowPanel.height="30";
          var arrowoffPanel = document.createElement('img');
          arrowoffPanel.style.position="fixed";
          arrowoffPanel.src="../resources/images/arrow.png";
          arrowoffPanel.style.marginTop="30%";
          arrowoffPanel.style.marginLeft="4px";
          arrowoffPanel.width="30";
          arrowoffPanel.height="30";
          arrowoffPanel.style.display="none";
          arrowoffPanel.style.transform="rotate(180deg)";

          arrowPanel.onclick = function (){
            var width=window.innerWidth ||document.documentElement.clientWidth ||document.body.clientWidth;
            associationPanel.style.height=window.innerHeight ||document.documentElement.clientHeight ||document.body.clientHeight;
            associationPanel.style.width=width;
            arrowPanel.style.display="none";
             var callback = function(e){
              arrowoffPanel.style.display="block";
              if (!associationPanel.querySelector('div'))
              mediascape.association.createQRcode(url,associationPanel,(30*width/100),(30*width/100),'',(35*width/100),50);
              associationPanel.removeEventListener('webkitTransitionEnd',callback,false);
            }
            var transitionFinished=associationPanel.addEventListener('webkitTransitionEnd', callback);



          }
          arrowoffPanel.onclick = function (){
            associationPanel.style.width="15px";
            arrowPanel.style.display="block";
            arrowoffPanel.style.display="none";
            associationPanel.removeChild(associationPanel.querySelector('div'));
          }

          associationPanel.appendChild(arrowPanel);
          associationPanel.appendChild(arrowoffPanel);
          document.body.appendChild(associationPanel);

      }
      this.hideAssociationPanel = function (){
         try {
         var associationPanel_ = document.querySelector("#associationPanel");
         if (associationPanel_ && associationPanel_.querySelector('div')){
            var arrowPanel = associationPanel_.querySelectorAll('img')[0];
            var arrowoffPanel = associationPanel_.querySelectorAll('img')[1];
            arrowPanel.style.display="block";
            arrowoffPanel.style.display="none";
            associationPanel_.removeChild(associationPanel_.querySelector('div'));
            associationPanel_.style.width="15px";

          }
        }catch (e){console.log(e);}
      }
      
		// add the button to trigger the dialog for selecting which components to move/duplicate
		this.addMultiDeviceButtonPanel = function(clickfunc) {
			console.log('========adding button on top+++++++++');
			
            var buttonpanel = document.createElement('div');
            
            buttonpanel.setAttribute('id', 'AEOperationButton');
            buttonpanel.style['position'] = 'fixed';		            
            buttonpanel.style['cursor'] = 'hand';		            
            buttonpanel.style['top'] = '4px';		            
            buttonpanel.style['left'] = '4px';		                
            buttonpanel.style['z-index'] = '100';            
         
			var image = document.createElement('img');			
			image.setAttribute('src', 'images/icon-multi-device.png'); 
            image.style['border'] = 'solid 6px transparent';
            image.style['width'] = '48px';
            image.style['height'] = '48px';

			image.onclick = clickfunc;
			
			buttonpanel.appendChild(image);			
            document.body.appendChild(buttonpanel);				            
		}
        
        // show the dialog to allow the user to decide which component to copy/move to which device
        this.showOperationDialog = function(devices, components, func) {
             console.log('be ready to pop up the dialog===========');
             console.log(devices);             
             console.log(components);
             console.log('be ready to pop up the dialog===========e');
            
            var dialogpanel = document.getElementById("AEOperationDialog");
            if( !dialogpanel) {
                // create the modal dialog if the dialog element does not exist
                var dialogpanel = document.createElement('div');            
                dialogpanel.setAttribute('id', "AEOperationDialog");
                dialogpanel.setAttribute('class', "modal fade");
                dialogpanel.setAttribute('role', "dialog");    

                // construct the innerHTML dynamically
                var innerHTML = '<div class="modal-dialog"> ' + 
                            '<div id="dialogcontent" class="modal-content">' + 
                                '<h3>please specify your actions:</h3>' + 
                                '<div id="multi-device-behavior-table-content">' + 
                                '</div>' +
                                '<div class="modal-footer">' + 
                                    '<button type="button" class="btn btn-default" id="cancel">Cancel</button>' +
                                    '<button type="button" class="btn btn-primary" id="confirm">Confirm</button>' + 
                                '</div>' +                                                                
                            '</div>' + 
                            '</div>';
            
                dialogpanel.innerHTML = innerHTML;                
            
                document.body.appendChild(dialogpanel);            
                $('#dialogcontent').css('padding', '10px');      

                // show up the dialog
                $('#AEOperationDialog').find('#confirm').click( function(e) {
                    console.log('confirmed');
    
                    // inform the adaptation engine about this operation done by the user   
                    var actions = [];                
                    for(var i=0; i<components.length; i++){
                        for(var j=0; j<devices.length; j++){
                            var checkboxD = document.getElementById(components[i].componentId + '+' + devices[j].id + 'D');
                            if(checkboxD.checked) {
                                actions.push({"type": 'DUPLICATE', "component": components[i].componentId, "destination": devices[j].id});    
                            }                        
                                                    
                            var checkboxM = document.getElementById(components[i].componentId + '+' + devices[j].id + 'M');                        
                            if(checkboxM.checked) {
                                actions.push({"type": 'MOVE', "component": components[i].componentId, "destination": devices[j].id});    
                            }
                        }
                    }              
                
                    func(actions);                
                
                    $('#AEOperationDialog').modal('hide');     
                });
                
                $('#AEOperationDialog').find('#cancel').click( function(e) {
                    console.log('canceled');
                    // inform the adaptation engine about this operation done by the user
                    $('#AEOperationDialog').modal('hide');     
                });                              
            }
         
            // constructe the header of the table
            var tHeader = '<th><strong>devices</strong></th>';
            for(var i=0; i<devices.length; i++) {
                var path = 'images/' + devices[i].type + '.png';
                tHeader += '<th><img width="40px" height="40px" src="' + path + '"><br>' + devices[i].id + '</th>';
            }
            
            // constructe the body of the table
            var tBody = '';
            for(var i=0; i<components.length; i++){
                tBody += "<tr>"
                tBody += '<td><strong>' + components[i].componentId + '</strong></td>';
                for(var j=0; j<devices.length; j++){
                    tBody += '<td><input type="checkbox" id="' + (components[i].componentId + '+' + devices[j].id + 'D') + '">duplicate' + 
                             '<br><input type="checkbox" id="' + (components[i].componentId + '+' + devices[j].id + 'M') + '">move</td>';        
                }              
                tBody += "</tr>"                
            }                                                            
                       
            // update the innerHTML of the table
            var innerHTML = '<table class="table table-condensed">' + 
                                        '<thead>' + 
                                            '<tr>' + tHeader + '</tr>' + 
                                        '</thead>' + 
                                        '<tbody>' + tBody + 
                                        '</tbody>' +                                         
                            '</table>';            
            $('#multi-device-behavior-table-content').html(innerHTML);            
            
            $('#AEOperationDialog').modal('show');
        };        
        
   }
    uiComponents.__moduleName = "uiComponents";
    return uiComponents;

  });
