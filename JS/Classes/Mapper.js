(function(){
    'use strict';
    
        /**
        * this class is handles the mappings and calls the DataReporter
        *
        * @ constructs Mapper
        */
        function Mapper(){
            this.dataReporter = new classes.DataReporter();
        }
        
       /**
        * Credit: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        * This method validates if the given param has the email ___@__.__ format
        * 
        * @name validateEmail
        * @param {string} email - the string to be validated as an email 
       */
        Mapper.prototype.validateEmail = function(email) {
              var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return re.test(email);
        }

        /**
        * Credit: https://goo.gl/QuVJ2s (UK Mobile Phone Number)
        * This method validates if the given param has the UK phone format with 11 digits.
        * As the input is type=number we don't accept spaces in the regex
        * 
        * @name validatePhoneNumber
        * @param {string} phoneNumber - the string to be validated as a phone number 
       */
        Mapper.prototype.validatePhoneNumber = function(phoneNumber) {
              var re = /^(\+44?7\d{3}|\(?07\d{3}\)?)?\d{3}?\d{3}$/;
              return re.test(phoneNumber);
        }

        /**
         * This method checks if the data given is a correct email/phone if needed, and sends it.
         * 
         * @name reportTextOrValue
         * @param {id} string - Id of the mapping
         * @param {data} string - Data to send
         * @param {isEmail} bool - Flag to tell to the method if the data has to be validated as an email
         * @param {isPhoneNumber} bool - Flag to tell to the method if the data has to be validated as a phoneNumber
         */
        Mapper.prototype.reportTextOrValue = function(id, data, isEmail, isPhoneNumber){
          if(isEmail === true && this.validateEmail(data) === false){
                return 0;
            } else if(isPhoneNumber === true && this.validatePhoneNumber(data) === false){
                return 0;
            } else{
                this.dataReporter.send(id, data);
            }  
        };

        /**
         * This method reports the data if isChecked is true
         * 
         * @name reportRadio
         * @param {id} string - Id of the mapping
         * @param {data} string - Data to send
         * @param {isChecked} bool - Flag to tell to the method if the radioButton was checked and send the data if true
         */
        Mapper.prototype.reportRadio = function(id, data, isChecked){
            if(isChecked === true){
                this.dataReporter.send(id, data);
            }
        }

        /**
         * This method reports Checked/Unchecked depending on the isChecked flag
         * 
         * @name reportCheckbox
         * @param {id} string - Id of the mapping
         * @param {isChecked} bool - Flag to see which value has to be sent
         */        
        Mapper.prototype.reportCheckbox = function(id, isChecked){
            if(isChecked === true){
                this.dataReporter.send(id, "Checked");
            } else{
                this.dataReporter.send(id, "Unchecked"); 
            }    
        }
        
        /**
         * This method calls the correct method depending of which element's attribute is wanted to be mapped.
         * 
         * @name callReportMethod
         * @param {map} string - JSON object containing the characteristics of the mapping.
         * @param {elem} HTMLElement - Element wanted to be mapped
         */  
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
        
        /**
         * This method receives a mapping configuration array an applies them to the DOM
         * 
         * @name mapAndReport
         * @param {map} string - Array of JSON objects containing the characteristics of the mappings.
         */ 
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