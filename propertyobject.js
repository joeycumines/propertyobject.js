/* jshint eqnull:true */

var propertyobject = module.exports = {};
var is = require('is_js');

/**
Defines validators property.
Read only.
Object.
Properties are also read only.
*/
var _validators = {};
var _validatorMethods = {};
Object.defineProperty(propertyobject, 'validators', {
    get: function(){
        return _validators;
    }
});

/**
Add a new validator.

Throws a error if the name is not valid or the method isnt one.
*/
propertyobject.addValidator = function(name, method){
    if (is.not.string(name) || name == '')
        throw new Error('Invalid name for validator: '+name);
    if (_validators.hasOwnProperty(name))
        throw new Error('The given validator name already exists: '+name);
    if (is.not.function(method))
        throw new Error('The given method was not a function: '+method);
    //Add to _validators and _validatorMethods
    _validators[name] = name;
    _validatorMethods[name] = method;
};

/**
Little helper method to step into nested objects, until we reach a function.
Returns an array of objects
{
    key,
    value
}
*/
function extractMethods(prefix, input){
    if (is.not.string(prefix))
        prefix = '';
    var result = [];
    if (is.object(input)){
        for(var k in input){
            if (input.hasOwnProperty(k)){
                var p = prefix;
                if (p !== '')
                    p = p + '.';
                p = p + k;
                result = result.concat(extractMethods(p, input[k]));
            }
        }
    } else if (is.function(input)) {
        result.push({
            'key': prefix,
            'value': input
        });
    }
    return result;
}

/**
Add multiple validators from a object.
Extracts all methods, stepping into all child objects.
All methods are prefixed with prefix. If obj was
a function, then calling this will have the same effect
as propertyobject.addValidator.

Throws exceptions the same as propertyobject.addValidator
*/
propertyobject.addValidators = function(prefix, obj){
    var methods = extractMethods(prefix, obj);
    for (var x = 0; x < methods.length; x++){
        var o = methods[x];
        propertyobject.addValidator(o.key, o.value);
    }
};

/**
Adds the default validators.
*/
(function(){
    propertyobject.addValidator('DEFAULT', function(){
        return true;
    });
    //import members of "is" as validators, excluding setRegexp and setNamespace
    var temp = {};
    for (var k in is){
        if (is.hasOwnProperty(k) && k !== 'setRegexp' && k !== 'setNamespace'){
            temp[k] = is[k];
        }
    }
    propertyobject.addValidators('is', temp);
})();