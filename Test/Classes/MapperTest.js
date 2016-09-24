(function(classes){
    'use strict';
    
    describe('Mapper', function(){
        var Mapper = classes.Mapper, 
                mapperInstance;
        
        beforeEach(function(){
                mapperInstance = new Mapper();
        });

        describe('constructor', function(){

            it('initializes the mappers DataReporter object', function(){
               expect(mapperInstance.dataReporter).toBeDefined(); 
            });

        });

        describe('validateEmail', function(){
           it('validates a valid email as correct', function(){
               expect(mapperInstance.validateEmail("recruitment@veinteractive.com")).toEqual(true);
           });
           it('validates an invalid email as incorrect', function(){
               expect(mapperInstance.validateEmail("recruitment@.com")).toEqual(false);
           });
           it('validates an undefined email as incorrect', function(){
               var undef;
               expect(mapperInstance.validateEmail(undef)).toEqual(false);
           });
        }); 

        describe('validatePhoneNumber', function(){
           it('validates a valid phone number as correct', function(){
               expect(mapperInstance.validatePhoneNumber("07222555555")).toEqual(true);
           });
           it('validates a valid phone with an space number as incorrect, because we use a numeric input', function(){
               expect(mapperInstance.validatePhoneNumber("07222 555555")).toEqual(false);
           });
           it('validates an invalid phone number as incorrect', function(){
               expect(mapperInstance.validatePhoneNumber("recruitment@.com")).toEqual(false);
           });
           it('validates an undefined phone number as incorrect', function(){
               var undef;
               expect(mapperInstance.validatePhoneNumber(undef)).toEqual(false);
           });
        }); 
        
        describe('reportingAndMapping', function(){
            beforeEach(function(){
                spyOn(mapperInstance.dataReporter, 'send');
            });
            
            describe('reportTextOrValue', function(){
                it('tries to report a valid email', function(){
                    mapperInstance.reportTextOrValue(1, "recruitment@veinteractive.com", true, false );  expect(mapperInstance.dataReporter.send).toHaveBeenCalled();
                });
                it('tries to report an invalid email', function(){
                    mapperInstance.reportTextOrValue(1, "recruitment@.com", true, false );                
                    expect(mapperInstance.dataReporter.send).not.toHaveBeenCalled();
                });
                it('tries to report an undef email', function(){
                    var undef;
                    mapperInstance.reportTextOrValue(1, undef, true, false );                
                    expect(mapperInstance.dataReporter.send).not.toHaveBeenCalled();
                });
                it('tries to report a valid phone number', function(){
                    mapperInstance.reportTextOrValue(1, "07222555555", false, true );                
                    expect(mapperInstance.dataReporter.send).toHaveBeenCalled();
                });
                it('tries to report an invalid phone number', function(){
                    mapperInstance.reportTextOrValue(1, "3424234", false, true );                
                    expect(mapperInstance.dataReporter.send).not.toHaveBeenCalled();
                });
                it('tries to report an undef phone number', function(){
                    var undef;
                    mapperInstance.reportTextOrValue(1, undef, false, true );                
                    expect(mapperInstance.dataReporter.send).not.toHaveBeenCalled();
                });
                it('report the data because we do not care if it\'s an email or a phone' , function(){
                    mapperInstance.reportTextOrValue(1, "3424234", false, false );                
                    expect(mapperInstance.dataReporter.send).toHaveBeenCalled();
                });
                it('should not send because an input cannot be both email and phone number' , function(){
                    mapperInstance.reportTextOrValue(1, "3424234", true, true );                
                    expect(mapperInstance.dataReporter.send).not.toHaveBeenCalled();
                });
                it('sends an undef text or value ' , function(){
                    var undef;
                    mapperInstance.reportTextOrValue(1, undef, false, false );                
                    expect(mapperInstance.dataReporter.send).toHaveBeenCalled();
                });
            });
            
            describe('reportRadio', function(){
                it('should send the checked radio data', function(){
                    mapperInstance.reportRadio(1, "someValue", true ); 
                    expect(mapperInstance.dataReporter.send).toHaveBeenCalled();
                });
                it('should not send the unchecked radio data', function(){
                    mapperInstance.reportRadio(1, "someValue", false ); 
                    expect(mapperInstance.dataReporter.send).not.toHaveBeenCalled();
                });
                it('should not send the radio data with undefined', function(){
                    mapperInstance.reportRadio(1, "someValue", undefined ); 
                    expect(mapperInstance.dataReporter.send).not.toHaveBeenCalled();
                });
                it('sends the radio data with undefined', function(){
                    var undef;
                    mapperInstance.reportRadio(1, undef, true ); 
                    expect(mapperInstance.dataReporter.send).toHaveBeenCalled();
                });
            });
            
            describe('reportCheckbox', function(){
                it('should send the checked checkbox data', function(){
                    mapperInstance.reportCheckbox(1, true ); 
                    expect(mapperInstance.dataReporter.send).toHaveBeenCalled();
                });
                it('should send the unchecked checkbox data', function(){
                    mapperInstance.reportCheckbox(1, false ); 
                    expect(mapperInstance.dataReporter.send).toHaveBeenCalled();
                });
                it('should treat undefined as unchecked and send it', function(){
                    mapperInstance.reportCheckbox(1, undefined ); 
                    expect(mapperInstance.dataReporter.send).toHaveBeenCalled();
                });
            });
        });
        
        describe('callReportMethod', function(){
                var map;
                var elem;
                beforeEach(function(){
                    spyOn(mapperInstance, 'reportTextOrValue');
                    spyOn(mapperInstance, 'reportRadio');
                    spyOn(mapperInstance, 'reportCheckbox');                    
                });
                
                describe('with unitialized args', function(){
                    it('should not call with both unitialized', function(){
                        mapperInstance.callReportMethod(map, elem);
                        expect(mapperInstance.reportTextOrValue).not.toHaveBeenCalled();
                        expect(mapperInstance.reportRadio).not.toHaveBeenCalled();
                        expect(mapperInstance.reportCheckbox).not.toHaveBeenCalled();
                    });
                    it('should not call with elem unitialized', function(){
                        map = {};
                        mapperInstance.callReportMethod(map, elem);
                        expect(mapperInstance.reportTextOrValue).not.toHaveBeenCalled();
                        expect(mapperInstance.reportRadio).not.toHaveBeenCalled();
                        expect(mapperInstance.reportCheckbox).not.toHaveBeenCalled();
                    });
                    it('should not call with map unitialized', function(){
                        elem = {};
                        mapperInstance.callReportMethod(map, elem);
                        expect(mapperInstance.reportTextOrValue).not.toHaveBeenCalled();
                        expect(mapperInstance.reportRadio).not.toHaveBeenCalled();
                        expect(mapperInstance.reportCheckbox).not.toHaveBeenCalled();
                    });
                })
                
                describe('withInitializedArgs', function(){
                    map = {};
                    elem= {};
                    
                    it('should call reportTextOrValue', function(){
                        map.attribute= 'text'
                        mapperInstance.callReportMethod(map, elem);
                        expect(mapperInstance.reportTextOrValue).toHaveBeenCalled();
                    });
                    it('should call reportTextOrValue', function(){
                        map.attribute= 'value'
                        mapperInstance.callReportMethod(map, elem);
                        expect(mapperInstance.reportTextOrValue).toHaveBeenCalled();
                    });
                    it('should call reportRadio', function(){
                        map.attribute= 'radio'
                        mapperInstance.callReportMethod(map, elem);
                        expect(mapperInstance.reportRadio).toHaveBeenCalled();
                    });
                    it('should call reportCheckbox', function(){
                        map.attribute= 'checkbox'
                        mapperInstance.callReportMethod(map, elem);
                        expect(mapperInstance.reportCheckbox).toHaveBeenCalled();
                    });
                    it('should not call any with map invalid attribute', function(){
                        map.attribute = "someOtherAttr";
                        mapperInstance.callReportMethod(map, elem);
                        expect(mapperInstance.reportTextOrValue).not.toHaveBeenCalled();
                        expect(mapperInstance.reportRadio).not.toHaveBeenCalled();
                        expect(mapperInstance.reportCheckbox).not.toHaveBeenCalled();
                    });
                });                
            });

        describe('mapAndReport', function(){
            var maps;
            var emptyHtml = "<html></html>";
            var filledHtml = '<input type="text" class="form-control" id="firstName" placeholder="Enter first name">';
            beforeEach(function(){
                spyOn(mapperInstance, 'callReportMethod');
            });
            
            it('should not call with undef mappings', function(){
                mapperInstance.mapAndReport(maps);
                expect(mapperInstance.callReportMethod).not.toHaveBeenCalled();
            });
            
            it('should not call with no elems to map', function(){
                maps = [{}];
                document.write(emptyHtml);
                mapperInstance.mapAndReport(maps);
                expect(mapperInstance.callReportMethod).not.toHaveBeenCalled();
            });
            
            describe('with filled HTML', function(){
                beforeEach(function(){
                    maps = [{id: '1', selector: '#firstName', attribute: 'value'}];
                    document.write(filledHtml);
                });
                
                afterEach(function(){
                    document.getElementById('firstName').remove();
                });
                
                it('should call on load with undef event', function(){
                    maps[0].event = undefined;
                    mapperInstance.mapAndReport(maps);
                    expect(mapperInstance.callReportMethod).toHaveBeenCalled();
                });
                it('should call on load with onLoad event', function(){
                    maps[0].event = 'onLoad';
                    mapperInstance.mapAndReport(maps);
                    expect(mapperInstance.callReportMethod).toHaveBeenCalled();
                });
                it('should call when changes take place', function(){
                    maps[0].event = 'onChange';
                    mapperInstance.mapAndReport(maps);
                    var input = document.getElementById("firstName");
                    var event= new Event('change');
                    input.dispatchEvent(event);
                    input.value = 'someOtherValue';
                    expect(mapperInstance.callReportMethod).toHaveBeenCalled();
                });
                it('should not call if changes do not take place', function(){
                    maps[0].event = 'onChange';
                    mapperInstance.mapAndReport(maps);
                    expect(mapperInstance.callReportMethod).not.toHaveBeenCalled();
                });
            });
           
            
            
           
            
        });
        
    });
}(classes));