/* jshint eqnull:true */
var assert = require('assert');
var propertyobject = require('../propertyobject.js');
var is = require('is_js');

describe('propertyobject', function(){
    describe('#addValidator()', function(){
        it('should fail if we try to create IS_INCREMENTED_BY_ONE with a object', function(){
            var did = null;
            try {
                propertyobject.addValidator('IS_INCREMENTED_BY_ONE', {});
                did = false;
            } catch(e){
                did = true;
            }
            assert.strictEqual(true, did);
            assert.strictEqual(true, !propertyobject.validators.hasOwnProperty('IS_INCREMENTED_BY_ONE'));
        });
        it('should allow us to create IS_INCREMENTED_BY_ONE', function(){
            propertyobject.addValidator('IS_INCREMENTED_BY_ONE', function(obj, val){
                if (obj.value + 1 === val)
                    return true;
                return false;
            });
            assert.strictEqual(true, propertyobject.validators.hasOwnProperty('IS_INCREMENTED_BY_ONE'));
        });
        it('should fail if we try to create IS_INCREMENTED_BY_ONE again', function(){
            var did = null;
            try {
                propertyobject.addValidator('IS_INCREMENTED_BY_ONE', function(obj, val){
                    if (obj.value + 1 === val)
                        return true;
                    return false;
                });
                did = false;
            } catch(e){
                did = true;
            }
            assert.strictEqual(true, did);
            assert.strictEqual(true, propertyobject.validators.hasOwnProperty('IS_INCREMENTED_BY_ONE'));
        });
    });
    describe('#addDisplay()', function(){
        it('should fail if we try to create a GET_KEY_STRING with a object', function(){
            var did = null;
            try {
                propertyobject.addDisplay('GET_KEY_STRING', {});
                did = false;
            } catch(e){
                did = true;
            }
            assert.strictEqual(true, did);
            assert.strictEqual(true, !propertyobject.displays.hasOwnProperty('GET_KEY_STRING'));
        });
        it('should allow us to create GET_KEY_STRING', function(){
            propertyobject.addDisplay('GET_KEY_STRING', function(obj){
                return obj.key.toString();
            });
            assert.strictEqual(true, propertyobject.displays.hasOwnProperty('GET_KEY_STRING'));
        });
        it('should fail if we try to create GET_KEY_STRING again', function(){
            var did = null;
            try {
                propertyobject.addDisplay('GET_KEY_STRING', function(obj){
                    return obj.key.toString();
                });
                did = false;
            } catch(e){
                did = true;
            }
            assert.strictEqual(true, did);
            assert.strictEqual(true, propertyobject.displays.hasOwnProperty('GET_KEY_STRING'));
        });
    });
    describe('validators', function(){
        it('should be init', function(){
            assert.strictEqual(true, propertyobject.validators != null);
        });
        it('should have DEFAULT', function(){
            assert.strictEqual(true, propertyobject.validators.DEFAULT === 'DEFAULT');
        });
        it('should have is.array', function(){
            assert.strictEqual(true, propertyobject.validators['is.array'] === 'is.array');
        });
        it('shouldnt have is.setRegexp', function(){
            assert.strictEqual(true, !propertyobject.validators.hasOwnProperty('is.setRegexp'));
        });
        it('shouldnt have is.setNamespace', function(){
            assert.strictEqual(true, !propertyobject.validators.hasOwnProperty('is.setNamespace'));
        });
        it('shouldnt allow setting directly', function(){
            propertyobject.validators = null;
            assert.strictEqual(true, propertyobject.validators !== null);
        });
        it('shouldnt allow setting DEFAULT', function(){
            propertyobject.validators.DEFAULT = 'asddasdasdas';
            assert.strictEqual(propertyobject.validators.DEFAULT, 'DEFAULT');
        });
    });
    describe('displays', function(){
        it('should be init', function(){
            assert.strictEqual(true, propertyobject.displays != null);
        });
        it('should have DEFAULT', function(){
            assert.strictEqual(true, propertyobject.displays.DEFAULT === 'DEFAULT');
        });
        it('shouldnt allow setting directly', function(){
            propertyobject.displays = null;
            assert.strictEqual(true, propertyobject.displays !== null);
        });
        it('shouldnt allow setting DEFAULT', function(){
            propertyobject.displays.DEFAULT = 'asddasdasdas';
            assert.strictEqual(propertyobject.displays.DEFAULT, 'DEFAULT');
        });
    });
    describe('PropertyObject', function(){
        describe('key', function(){
            it('should be set to null by default', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                assert.strictEqual(true, prop.hasOwnProperty('key'));
                assert.strictEqual(prop.key, null);
            });
            it('should be able to be set to a string', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                prop.key = 'TESTING VALUE';
                assert.strictEqual(prop.key, 'TESTING VALUE');
            });
            it('should fail to set if not editable', function(){
                var prop = new propertyobject.PropertyObject();
                var did = null;
                try {
                    prop.key = 'test val';
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(did, true);
                assert.strictEqual(prop.key, null);
            });
        });
        describe('editable', function(){
            it('should be false by default', function(){
                var prop = new propertyobject.PropertyObject();
                assert.strictEqual(true, prop.hasOwnProperty('editable'));
                assert.strictEqual(prop.editable, false);
            });
            it('should fail with exception when set to 1', function(){
                var prop = new propertyobject.PropertyObject();
                var did = null;
                try {
                    prop.editable = 1;
                    did = false;
                } catch (e){
                    did = true;
                }
                assert.strictEqual(true, did);
                assert.strictEqual(prop.editable, false);
            });
            it('should be able to be set to true then to false', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                assert.strictEqual(true, prop.editable);
                prop.editable = false;
                assert.strictEqual(true, !prop.editable);
            });
        });
        describe('validator', function(){
            it('should default to DEFAULT', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                assert.strictEqual(prop.validator, propertyobject.validators.DEFAULT);
            });
            it('should fail on non existant validator', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                var did = null;
                try {
                    prop.validator = 'this validator doesnt exist';
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(true, did);
                assert.strictEqual(prop.validator, propertyobject.validators.DEFAULT);
            });
            it('should allow setting to is.not.boolean and will work correctly', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                assert.strictEqual(prop.validator, propertyobject.validators.DEFAULT);
                prop.validator = propertyobject.validators['is.not.boolean'];
                assert.strictEqual(prop.validator, propertyobject.validators['is.not.boolean']);
                var did = null;
                //Fail on true
                did = null;
                try {
                    prop.value = true;
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(true, did);
                assert.strictEqual(prop.value, null);
                
                //fail on false
                did = null;
                try {
                    prop.value = false;
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(true, did);
                assert.strictEqual(prop.value, null);
                
                //Succeed on 1
                prop.value = 1;
                assert.strictEqual(prop.value, 1);
                //succeed on 'hello'
                prop.value = 'hello';
                assert.strictEqual(prop.value, 'hello');
            });
            it('should allow setting to is.array and will work correctly', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                assert.strictEqual(prop.validator, propertyobject.validators.DEFAULT);
                prop.validator = propertyobject.validators['is.array'];
                assert.strictEqual(prop.validator, propertyobject.validators['is.array']);
                var did = null;
                //Fail on string
                did = null;
                try {
                    prop.value = 'A string val';
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(true, did);
                assert.strictEqual(prop.value, null);
                
                //fail on object
                did = null;
                try {
                    prop.value = {};
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(true, did);
                assert.strictEqual(prop.value, null);
                
                //Succeed on arrays
                prop.value = [];
                assert.deepStrictEqual(prop.value, []);
                prop.value = ['one', 2, 'THREE'];
                assert.deepStrictEqual(prop.value, ['one', 2, 'THREE']);
            });
            it('should fail to set if not editable', function(){
                var prop = new propertyobject.PropertyObject();
                var did = null;
                try {
                    prop.validator = propertyobject.validators.DEFAULT;
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(did, true);
                assert.strictEqual(prop.validator, propertyobject.validators.DEFAULT);
            });
        });
        describe('value', function(){
            it('should default to null', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                assert.strictEqual(prop.value, null);
            });
            it('should work correctly with IS_INCREMENTED_BY_ONE', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                prop.value = 1;
                prop.validator = propertyobject.validators.IS_INCREMENTED_BY_ONE;
                assert.strictEqual(prop.validator, 'IS_INCREMENTED_BY_ONE');
                prop.value = 2;
                assert.strictEqual(prop.value, 2);
                var did = null;
                try {
                    prop.value = 4;
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(true, did);
                assert.strictEqual(prop.value, 2);
            });
            it('should fail to set if not editable', function(){
                var prop = new propertyobject.PropertyObject();
                var did = null;
                try {
                    prop.value = 'a test value';
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(did, true);
                assert.strictEqual(prop.value, null);
            });
        });
        describe('display', function(){
            it('should default to DEFAULT', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                assert.strictEqual(prop.display, propertyobject.displays.DEFAULT);
            });
            it('should allow us to set it to GET_KEY_STRING', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                prop.display = propertyobject.displays.GET_KEY_STRING;
                assert.strictEqual(prop.display, propertyobject.displays.GET_KEY_STRING);
            });
            it('should fail on non existant display value', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                var did = null;
                try {
                    prop.display = 'This display does not exist';
                    did = false;
                } catch (e){
                    did = true;
                }
                assert.strictEqual(did, true);
                assert.strictEqual(prop.display, propertyobject.displays.DEFAULT);
            });
            it('should fail if set to not editable', function(){
                var prop = new propertyobject.PropertyObject();
                var did = null;
                try {
                    prop.display = propertyobject.displays.DEFAULT;
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(did, true);
                assert.strictEqual(prop.value, null);
            });
        });
        describe('logs', function(){
            it('should default to an empty array', function(){
                var prop = new propertyobject.PropertyObject();
                assert.deepStrictEqual(prop.logs, []);
            });
            it('should throw a error if you try to set it', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                var did = null;
                try {
                    prop.logs = ['test'];
                    did = false;
                } catch(e){
                    did = true;
                }
                assert.strictEqual(did, true);
                assert.deepStrictEqual(prop.logs, []);
            });
        });
    });
});