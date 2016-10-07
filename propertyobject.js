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
//We don't define writable in the descriptor because we define get
Object.defineProperty(propertyobject, 'validators', {
    enumerable: false,
    configurable: false,
    get: function(){
        return _validators;
    }
});

/**
Add a new validator.

Throws a error if the name is not valid or the method isnt one.
*/
propertyobject.addValidator = function(name, method){
    if (is.not.string(name) || name === '')
        throw new Error('Invalid name for validator: '+name);
    if (_validators.hasOwnProperty(name))
        throw new Error('The given validator name already exists: '+name);
    if (is.not.function(method))
        throw new Error('The given method was not a function: '+method);
    //Add to _validators and _validatorMethods
    Object.defineProperty(_validators, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: name
    });
    Object.defineProperty(_validatorMethods, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: method
    });
};

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
    propertyobject.addValidators('DEFAULT', function(){
        return true;
    });
    //import members of "is" as validators, excluding setRegexp and setNamespace
    var temp = {};
    for (var k in is){
        if (is.hasOwnProperty(k) && k !== 'setRegexp' && k !== 'setNamespace'){
            temp[k] = is[k];
        }
    }
    //propertyobject.addValidators('is', temp);
    //We want to make aliases of these methods, that ignores the first argument
    var methods = extractMethods('is', temp);
    var isLibMethodsKeyed = {};
    var isLibFunc = function(obj, val){
        //We define outside the loop because of the way that the scope works
        //obj.validator is guarenteed to contain a valid value.
        return isLibMethodsKeyed[obj.validator](val);
    };
    for (var x = 0; x < methods.length; x++){
        //set isLibMethodsKeyed so we can access it within isLibFunc
        isLibMethodsKeyed[methods[x].key] = methods[x].value;
        propertyobject.addValidator(methods[x].key, isLibFunc);
    }
    methods = null;
})();

/**
Defines displays property.
Read only.
Object.
Properties are also read only.
*/
var _displays = {};
var _displayMethods = {};
Object.defineProperty(propertyobject, 'displays', {
    get: function(){
        return _displays;
    }
});

/**
Add a new display.

Throws a error if the name is not valid or the method isnt one.
*/
propertyobject.addDisplay = function(name, method){
    if (is.not.string(name) || name === '')
        throw new Error('Invalid name for display: '+name);
    if (_displays.hasOwnProperty(name))
        throw new Error('The given display name already exists: '+name);
    if (is.not.function(method))
        throw new Error('The given method was not a function: '+method);
    //Add to _displays and _displayMethods
    Object.defineProperty(_displays, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: name
    });
    Object.defineProperty(_displayMethods, name, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: method
    });
};

/**
Add multiple displays from a object.
Extracts all methods, stepping into all child objects.
All methods are prefixed with prefix. If obj was
a function, then calling this will have the same effect
as propertyobject.addValidator.

Throws exceptions the same as propertyobject.addValidator
*/
propertyobject.addDisplays = function(prefix, obj){
    var methods = extractMethods(prefix, obj);
    for (var x = 0; x < methods.length; x++){
        var o = methods[x];
        propertyobject.addDisplay(o.key, o.value);
    }
};

/**
Adds the default displays.
*/
(function(){
    propertyobject.addDisplays('DEFAULT', function(prop){
        return prop.serialize();
    });
})();


/**
PropertyObject definition, as per readme spec.
*/
propertyobject.PropertyObject = function(serialized){
    /**
        Helper function that isnt exposed.
    */
    var errorIfNotEditable = function(){
        if (!this.editable)
            throw new Error('The editable flag is false, error attempting to edit.');
    }.bind(this);
    
    var editableValue = false;
    Object.defineProperty(this, 'editable', {
        enumerable: false,
        configurable: false,
        get: function(){
            return deepCopy(editableValue);
        },
        set: function(value){
            if (is.boolean(value)){
                editableValue = value;
            } else {
                throw new Error('Unable to set editable to something other then a boolean: '+value);
            }
        }
    });
    
    var keyValue = null;
    Object.defineProperty(this, 'key', {
        enumerable: false,
        configurable: false,
        get: function(){
            return deepCopy(keyValue);
        },
        set: function(value){
            errorIfNotEditable();
            keyValue = value;
        }
    });
    
    var validatorValue = propertyobject.validators.DEFAULT;
    Object.defineProperty(this, 'validator', {
        enumerable: false,
        configurable: false,
        get: function(){
            return deepCopy(validatorValue);
        },
        set: function(value){
            errorIfNotEditable();
            //value must be in propertyobject.validators
            if (!propertyobject.validators.hasOwnProperty(value)){
                throw new Error('The validator key does not exist: '+value);
            }
            validatorValue = value;
        }
    });
    
    var valueValue = null;
    Object.defineProperty(this, 'value', {
        enumerable: false,
        configurable: false,
        get: function(){
            return deepCopy(valueValue);
        },
        set: function(value){
            errorIfNotEditable();
            //we must validate, else throw error
            if (!(_validatorMethods[this.validator])(this, value)){
                throw new Error('Your value failed to validate: '+value);
            }
            valueValue = value;
        }.bind(this)
    });
    
    var displayValue = propertyobject.displays.DEFAULT;
    Object.defineProperty(this, 'display', {
        enumerable: false,
        configurable: false,
        get: function(){
            return deepCopy(displayValue);
        },
        set: function(value){
            errorIfNotEditable();
            //value must be in propertyobject.displays
            if (!propertyobject.displays.hasOwnProperty(value)){
                throw new Error('The display key does not exist: '+value);
            }
            displayValue = value;
        }
    });
    
    var logsValue = [];
    Object.defineProperty(this, 'logs', {
        enumerable: false,
        configurable: false,
        get: function(){
            return deepCopy(logsValue);
        },
        set: function(value){
            throw new Error('You cannot set the logs directly, use PropertyObject.log(message).');
        }
    });
    
    /**
        Logs a new message to the logsValue array.
        
        Throws a error if message is not a string.
    */
    this.log = function(message){
        if (is.not.string(message)){
            throw new Error('Message must be a string: '+message);
        }
        var l = {};
        l.timestamp = Date.now();
        l.message = message;
        logsValue.push(l);
    };
};
/**
    Serialize the object.
*/
propertyobject.PropertyObject.prototype.serialize = function(){
    var result = {};
    result.key = this.key;
    result.value = this.value;
    result.validator = this.validator;
    result.editable = this.editable;
    result.display = this.display;
    result.logs = this.logs;
};


/*
-----------------------------------------------------------------
|                        Helper Methods                         |
-----------------------------------------------------------------
*/

/**
Step into nested objects, until we reach a function.
Returns an array of objects where key is the prefix
built, and value is the function.
{
    key,
    value
}
*/
function extractMethods(prefix, input){
    if (is.not.string(prefix))
        prefix = '';
    var result = [];
    if (is.function(input)) {
        result.push({
            'key': prefix,
            'value': input
        });
    } else if (is.object(input)){
        for(var k in input){
            if (input.hasOwnProperty(k)){
                var p = prefix;
                if (p !== '')
                    p = p + '.';
                p = p + k;
                result = result.concat(extractMethods(p, input[k]));
            }
        }
    }
    return result;
}

/**
Make a deep copy of an array, object, or string.
*/
function deepCopy(obj) {
    var result = obj;
    if (is.array(obj)) {
        result = [];
        for (var x = 0; x < obj.length; x++)
            result.push(deepCopy(obj[x]));
    } else if (is.object(obj)) {
        result = {};
        for (var k in obj) {
            if (obj.hasOwnProperty(k))
                result[k] = deepCopy(obj[k]);
        }
    } else if (is.string(obj)){
        result = (' ' + obj).slice(1);
    }
    return result;
};