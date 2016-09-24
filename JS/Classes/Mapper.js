(function(){
    'use strict';
    
    
        function Mapper(){
            this.dataReporter = new classes.DataReporter();
        }
        
       //Credit: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        Mapper.prototype.validateEmail = function(email) {
              var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return re.test(email);
        }
        

        //Credit: https://goo.gl/QuVJ2s (UK Mobile Phone Number)
        //As the input is type=number we don't accept spaces in the regex
        Mapper.prototype.validatePhoneNumber = function(phoneNumber) {
              var re = /^(\+44?7\d{3}|\(?07\d{3}\)?)?\d{3}?\d{3}$/;
              return re.test(phoneNumber);
        }

        Mapper.prototype.reportTextOrValue = function(id, data, isEmail, isPhoneNumber){
          if(isEmail === true && this.validateEmail(data) === false){
                return 0;
            } else if(isPhoneNumber === true && this.validatePhoneNumber(data) === false){
                return 0;
            } else{
                this.dataReporter.send(id, data);
            }  
        };

        Mapper.prototype.reportRadio = function(id, data, isChecked){
            if(isChecked === true){
                this.dataReporter.send(id, data);
            }
        }

        Mapper.prototype.reportCheckbox = function(id, isChecked){
            if(isChecked !== undefined){
               if(isChecked === true){
                    this.dataReporter.send(id, "Checked");
                } else{
                   this.dataReporter.send(id, "Unchecked"); 
                }  
            }    
        }
        
        Mapper.prototype.callReportMethod = function(map, elem){
            if(map && elem){
              switch(map.attribute){
                     case 'text':
                        this.reportTextOrValue(map.id, elem.innerHTML, map.isEmail, map.isPhoneNumber ); 
                        break;
                    case 'value':
                        this.reportTextOrValue(map.id, elem.value, map.isEmail, map.isPhoneNumber );
                        break;                        
                    case 'radio':
                        this.reportRadio(map.id, elem.value, elem.checked);                   
                        break;
                    case 'checkbox':
                        this.reportCheckbox(map.id, elem.checked);                            
                    break;
                }  
            }
        }
        
        Mapper.prototype.mapAndReport = function(maps){
            if(maps){
                maps.forEach((map)=>{ 
                    
                    //Assure that the event is defined to be ready for the parser
                    map.event = map.event || "onLoad";
                    //Parse event
                    var parsedEvent = map.event.replace("on",'').toLowerCase();

                     //@TODO: Parse selector to use concrete methods instead of querySelectorAll() to gain speed
                    var elements = document.querySelectorAll(map.selector);

                    //There always can be multiple element with the same selector
                    elements.forEach((elem)=>{
                        var isOnLoad = parsedEvent === 'load';
                        if(isOnLoad){
                            this.callReportMethod(map, elem);
                        } else {
                            elem.addEventListener(parsedEvent, ()=>{
                                this.callReportMethod(map, elem);
                            }, false);
                        }     
                    });
                });
            }
            
        }
    
 
    classes.Mapper = Mapper;
    
}());