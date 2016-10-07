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
            assert(did);
            assert(!propertyobject.validators.hasOwnProperty('IS_INCREMENTED_BY_ONE'));
        });
        it('should allow us to create IS_INCREMENTED_BY_ONE', function(){
            propertyobject.addValidator('IS_INCREMENTED_BY_ONE', function(obj, val){
                if (obj.value + 1 === val)
                    return true;
                return false;
            });
            assert(propertyobject.validators.hasOwnProperty('IS_INCREMENTED_BY_ONE'));
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
            assert(did);
            assert(propertyobject.validators.hasOwnProperty('IS_INCREMENTED_BY_ONE'));
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
            assert(did);
            assert(!propertyobject.displays.hasOwnProperty('GET_KEY_STRING'));
        });
        it('should allow us to create GET_KEY_STRING', function(){
            propertyobject.addDisplay('GET_KEY_STRING', function(obj){
                return obj.key.toString();
            });
            assert(propertyobject.displays.hasOwnProperty('GET_KEY_STRING'));
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
            assert(did);
            assert(propertyobject.displays.hasOwnProperty('GET_KEY_STRING'));
        });
    });
    describe('validators', function(){
        it('should be init', function(){
            assert(propertyobject.validators != null);
        });
        it('should have DEFAULT', function(){
            assert(propertyobject.validators.DEFAULT === 'DEFAULT');
        });
        it('should have is.array', function(){
            assert(propertyobject.validators['is.array'] === 'is.array');
        });
        it('shouldnt have is.setRegexp', function(){
            assert(!propertyobject.validators.hasOwnProperty('is.setRegexp'));
        });
        it('shouldnt have is.setNamespace', function(){
            assert(!propertyobject.validators.hasOwnProperty('is.setNamespace'));
        });
        it('shouldnt allow setting directly', function(){
            propertyobject.validators = null;
            assert(propertyobject.validators !== null);
        });
        it('shouldnt allow setting DEFAULT', function(){
            propertyobject.validators.DEFAULT = 'asddasdasdas';
            assert.equal(propertyobject.validators.DEFAULT, 'DEFAULT');
        });
    });
    describe('displays', function(){
        it('should be init', function(){
            assert(propertyobject.displays != null);
        });
        it('should have DEFAULT', function(){
            assert(propertyobject.displays.DEFAULT === 'DEFAULT');
        });
        it('shouldnt allow setting directly', function(){
            propertyobject.displays = null;
            assert(propertyobject.displays !== null);
        });
        it('shouldnt allow setting DEFAULT', function(){
            propertyobject.displays.DEFAULT = 'asddasdasdas';
            assert.equal(propertyobject.displays.DEFAULT, 'DEFAULT');
        });
    });
    describe('PropertyObject', function(){
        describe('key', function(){
            it('should be set to null by default', function(){
                var prop = new propertyobject.PropertyObject();
                assert(prop.hasOwnProperty('key'));
                assert.equal(prop.key, null);
            });
            it('should be able to be set to a string', function(){
                var prop = new propertyobject.PropertyObject();
                prop.key = 'TESTING VALUE';
                assert.equal(prop.key, 'TESTING VALUE');
            });
        });
        describe('editable', function(){
            it('should be false by default', function(){
                var prop = new propertyobject.PropertyObject();
                assert(prop.hasOwnProperty('editable'));
                assert.equal(prop.editable, false);
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
                assert(did);
                assert.equal(prop.editable, false);
            });
            it('should be able to be set to true then to false', function(){
                var prop = new propertyobject.PropertyObject();
                prop.editable = true;
                assert(prop.editable);
                prop.editable = false;
                assert(!prop.editable);
            });
        });
        describe('validator', function(){
            it('should default to DEFAULT', function(){
                var prop = new propertyobject.PropertyObject();
                assert.equal(prop.validator, propertyobject.validators.DEFAULT);
            });
            it('should fail on non existant validator', function(){
                var prop = new propertyobject.PropertyObject();
                var did = null;
                try {
                    prop.validator = 'this validator doesnt exist';
                    did = false;
                } catch(e){
                    did = true;
                }
                assert(did);
                assert.equal(prop.validator, propertyobject.validators.DEFAULT);
            });
            it('should allow setting to is.not.boolean and will work correctly', function(){
                var prop = new propertyobject.PropertyObject();
                assert.equal(prop.validator, propertyobject.validators.DEFAULT);
                prop.validator = propertyobject.validators['is.not.boolean'];
                assert.equal(prop.validator, propertyobject.validators['is.not.boolean']);
                var did = null;
                //Fail on true
                did = null;
                try {
                    prop.value = true;
                    did = false;
                } catch(e){
                    did = true;
                }
                assert(did);
                assert.equal(prop.value, null);
                
                //fail on false
                did = null;
                try {
                    prop.value = false;
                    did = false;
                } catch(e){
                    did = true;
                }
                assert(did);
                assert.equal(prop.value, null);
                
                //Succeed on 1
                prop.value = 1;
                assert.equal(prop.value, 1);
                //succeed on 'hello'
                prop.value = 'hello';
                assert.equal(prop.value, 'hello');
            });
        });
        describe('value', function(){
            it('should default to null', function(){
                var prop = new propertyobject.PropertyObject();
                assert.equal(prop.value, null);
            });
            it('should work correctly with IS_INCREMENTED_BY_ONE', function(){
                var prop = new propertyobject.PropertyObject();
                prop.value = 1;
                prop.validator = propertyobject.validators.IS_INCREMENTED_BY_ONE;
                assert.equal(prop.validator, 'IS_INCREMENTED_BY_ONE');
                prop.value = 2;
                assert.equal(prop.value, 2);
                var did = null;
                try {
                    prop.value = 4;
                    did = false;
                } catch(e){
                    did = true;
                }
                assert(did);
                assert.equal(prop.value, 2);
            });
        });
    });
});