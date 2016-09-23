(function () {
	'use strict';

    var dataReporter = new classes.DataReporter();        

     //Credit: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    function validateEmail(email) {
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
    }

    //Credit: https://goo.gl/QuVJ2s (UK Mobile Phone Number)
    function validatePhoneNumber(phoneNumber) {
          var re = /^(\+44?7\d{3}|\(?07\d{3}\)?)?\d{3}?\d{3}$/;
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
    
    function callReportMethod(map, elem){
        switch(map.attribute){
                 case 'text':
                    reportTextOrValue(map.id, elem.innerHTML, map.isEmail, map.isPhoneNumber ); 
                    break;
                case 'value':
                    reportTextOrValue(map.id, elem.value, map.isEmail, map.isPhoneNumber );
                    break;                        
                case 'radio':
                    reportRadio(map.id, elem.value, elem.checked);                   
                    break;
                case 'checkbox':
                    reportCheckbox(map.id, elem.checked);                            
                break;
        }
    }
    
	/**
	 * This function is responsible for capturing data (based on mappings.js) and sending data (with use of DataReporter class).
	 *
	 * @name init
	 */
	function init () {
        mappings.forEach((map)=>{
            //@TODO: Parse selector to use concrete methods instead of querySelectorAll() to gain speed
            var elements = document.querySelectorAll(map.selector);
            var parsedEvent = map.event.replace("on",'').toLowerCase();
            
            //There always can be multiple element with the same selector
            elements.forEach((elem)=>{
                var isOnLoad = parsedEvent === 'load';
                if(isOnLoad){
                    callReportMethod(map, elem);
                } else {
                    elem.addEventListener(parsedEvent, function(){
                        callReportMethod(map, elem);
                    }, false);
                }     
            });
        });
	}
    
	document.addEventListener('DOMContentLoaded', init, false);

}());
