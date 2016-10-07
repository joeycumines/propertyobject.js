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
        it('shouldnt allow setting directly', function(){
            try {
                propertyobject.validators = {};
                assert(false);
            } catch (e){
                assert(true);
            }
        });
    });
    describe('displays', function(){
        
    });
});