(function() {
	'use strict';

	/**
	 * This function is responsible for capturing data (based on mappings.js) and sending data (with use of DataReporter class).
	 *
	 * @name init
	 */
	function init () {
        var Mapper = classes.Mapper,
                mapperInstance;
        
        mapperInstance = new Mapper();
    
        mapperInstance.mapAndReport(mappings);    
	}
    
	document.addEventListener('DOMContentLoaded', init, false);
    
}());
