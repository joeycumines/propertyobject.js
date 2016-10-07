/* jshint eqnull:true */
var assert = require('assert');
var propertyobject = require('../propertyobject.js');
var is = require('is_js');

describe('propertyobject', function(){
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
    });
});