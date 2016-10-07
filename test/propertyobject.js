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
});