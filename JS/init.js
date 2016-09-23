(function () {
	'use strict';

    var dataReporter = new classes.DataReporter();        

     //Credit: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    function validateEmail(email) {
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
    }

    //Credit: https://goo.gl/QuVJ2s (Modified UK Phone Number)
    function validatePhoneNumber(phoneNumber) {
          var re = /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
          return re.test(phoneNumber);
    }
    
    function reportTextOrValue(id, data, isEmail, isPhoneNumber){
        if(isEmail === true && validateEmail(data) === false){
            return 0;
        } else if(isPhoneNumber === true && validatePhoneNumber(data) === false){
            return 0;
        } else{
            dataReporter.send(id, data);
        }
    };
    
    function reportRadio(id, data, isChecked){
        if(isChecked === true){
            dataReporter.send(id, data);
        }
    }
   
    function reportCheckbox(id, isChecked){
        if(isChecked === true){
            dataReporter.send(id, "Checked");
        } else{
           dataReporter.send(id, "Unchecked"); 
        }
    }
    
	/**
	 * This function is responsible for capturing data (based on mappings.js) and sending data (with use of DataReporter class).
	 *
	 * @name init
	 */
	function init () {
    
        mappings.forEach((map)=>{
            //@TODO: Parse selector to use concrete method instead of querySelectorAll() to gain speed
            var elements = document.querySelectorAll(map.selector);
            var parsedEvent = map.event.replace("on",'').toLowerCase();
            
            //There always can be multiple element with the same selector
            elements.forEach((elem)=>{
                var isOnLoad = parsedEvent === 'load';
                switch(map.attribute){
                        case 'text':
                            if(isOnLoad){
                                reportTextOrValue(map.id, elem.innerHTML, map.isEmail, map.isPhoneNumber );
                            } else {
                                elem.addEventListener(parsedEvent, function(){
                                    reportTextOrValue(map.id, elem.innerHTML, map.isEmail, map.isPhoneNumber);
                                });
                            }
                            break;
                        case 'value':
                            if(isOnLoad){
                                reportTextOrValue(map.id, elem.value, map.isEmail, map.isPhoneNumber );
                            } else {
                                elem.addEventListener(parsedEvent, function(){
                                    reportTextOrValue(map.id, elem.value, map.isEmail, map.isPhoneNumber);
                                });
                            }
                            break;                        
                        case 'radio':
                            if(isOnLoad){
                                reportRadio(map.id, elem.value, elem.checked);
                            } else {
                                elem.addEventListener(parsedEvent, function(){
                                    reportRadio(map.id, elem.value, elem.checked);
                                });
                            }                        
                            break;
                        case 'checkbox':
                            if(isOnLoad){
                                reportCheckbox(map.id, elem.checked);
                            } else {
                                elem.addEventListener(parsedEvent, function(){
                                    reportCheckbox(map.id, elem.checked);
                                });
                            }                               
                        break;
                }                 
            });
        });
        
        alert("so far so good");
	}
    
	document.addEventListener('DOMContentLoaded', init, false);

}());
