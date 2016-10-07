# propertyobject.js
propertyobject.js is boilerplate to simplify the management and display of mutable settings, within a database or other type of storage.
These settings are generalized as any value that can be set and viewed by the user, for example project settings, user settings,
or settings within a task based object (I wrote this for bookingHint and it's reminder messages).

PropertyObject provides a serialize() method, which will convert it to a writable object, and can be constructed from serialized objects.

## The PropertyObject definition
```
PropertyObject:
  description: |
    These objects represent specific fields within a object or similar,
    providing reusable utilities, such as how to display, and what kind of
    value is used.
  type: object
  properties:
    key:
      description: |
        The key this property is stored under. This can be used in conjunection
        with database code, to serialize to and from databases.
      type: string
    value:
      description: |
        The value of the field currently, can be any valid type.
    validator:
      description: |
        The kind of validator used by this property. Refer to the docs.
      type: string
    editable:
      description: |
        Whether this property will accept changes or not.
      type: boolean
    display:
      description: |
        The kind of display that this field is best suited to. Refer to the
        docs.
      type: string
    logs:
      description: |
        An array of log items. This property is not writeable.
      type: array
      items:
        $ref: "#/definitions/PropertyLogItem"
```

### PropertyLogItem definition
```
PropertyLogItem:
  description: |
    A row representing a action that was performed on a PropertyObject.
  type: object
  properties:
    timestamp:
      description: |
        The timestamp (ms) indicating when this item was logged.
      type: integer
      format: int64
    message:
      description: |
        The message that was provided to be logged.
      type: string
```

### key
The property key can be set to any value, and isn't used internally. It should instead be
used as an identifier externally, or for logging purposes.

Default: null

### editable
The property editable can be set with a boolean value, indicating if the value can be changed.
If editable is false, then setting value will fail with an exception. The editable flag controls
all of the properties except editable; setting any of the values while editable is false 
will throw a new Error.

Default: false

### value
The property value can be get and set, and is validated as part of the set process. The type of
validator depends on the value of the validator field.

Default: null

### validator
The property validator is a key, indicating the type of validator that is used for the value field.
The valid types are explained further down.

Default: 'DEFAULT' (propertyobject.validators.DEFAULT)

### display
The property display is a key, indicating the type of display that can be used. The valid types
are explained further down. runDisplay() will run the method associated with the display string.

Default: 'DEFAULT' (propertyobject.displays.DEFAULT)

### logs
The logs property is an array of log items for this PropertyObject. New log items can be added
by calling PropertyObject.log('message goes here'). The logs property is immutable by direct access.

Default: []

### log(message)
Log a new message to logs.

### serialize()
Returns a serialized version of this object.

### toString()
Returns JSON.stringify(this.serialize())

### runDisplay()
Returns the value of the display method, given this as a parameter.

### Constructing new PropertyObjects
To create a new property object do
```
var propertyobject = require('propertyobject');

var prop = new propertyobject.PropertyObject();
```
or
```
var propertyobject = require('propertyobject');

var prop = new propertyobject.PropertyObject(serializedObjectFromDatabase());
```

## Using validator and display
Validator and display are keys that refer to methods that are part of the library, or loaded in. They will
throw a new Error if you attempt to set them to a key that doesnt exist.

### Default validators
#### DEFAULT
This validator will always pass.
#### is.*
Any validator string starting with is. will automatically be run on https://github.com/arasatasaygin/is.js
config methods are, for obvious reasons, excluded from this. These will still fail to set if the
method doesn't exist. The method signature in the validator string will be run with with the new value
as the only parameter, for that reason the is.all.* and is.any.* interfaces may not work correctly.

#### Accessing
The DEFAULT validator and any user defined validators and their respective strings are accessible through
propertyobject.validators, for example:
```
var propertyobject = require('propertyobject');

//Get a property from the database and set its validator to default
var prop = new propertyobject.PropertyObject(serializedObjectFromDatabase());
prop.validator = propertyobject.validators.DEFAULT;
//Write out here
```

### Default displays
#### DEFAULT
This is the only allowable value by default, unless you create your own. The display returns
the PropertyObject.serialize() result.

#### Accessing
The DEFAULT display and any user defined displays and their respective strings are accessible through
propertyobject.displays, for example:
```
var propertyobject = require('propertyobject');

//Get a property from the database and set its display to default
var prop = new propertyobject.PropertyObject(serializedObjectFromDatabase());
prop.display = propertyobject.displays.DEFAULT;
//Write out here
```

## Creating new validators using addValidator()
Validators must be functions that take two parameters, the PropertyObject, and the new value.
The result returned must be true or false.

Example:
```
var propertyobject = require('propertyobject');

propertyobject.addValidator('IS_INCREMENTED_BY_ONE', function(obj, val){
    if (obj.value + 1 === val)
        return true;
    return false;
});

var prop = new propertyobject.PropertyObject();
prop.value = 1;

//these should pass / not throw exceptions
prop.validator = propertyobject.validators.IS_INCREMENTED_BY_ONE;

assert.equal(prop.validator, 'IS_INCREMENTED_BY_ONE');
prop.value = 2;
assert.equal(prop.value, 2);

try {
    //This will throw an exception
    prop.value = 4;
    assert(false);
} catch(e){}

assert.equal(prop.value, 2);

```

## Creating new displays using addDisplay()
Displays must be functions that take one parameter, the PropertyObject.
The result returned by the function can be any type.

Example:
```
var propertyobject = require('propertyobject');
propertyobject.addDisplay('GET_KEY_STRING', function(obj){
    return obj.key.toString();
});

var prop = new propertyobject.PropertyObject();
prop.key = 'the key';

//these should pass / not throw exceptions
prop.display = propertyobject.displays.GET_KEY_STRING;

assert.equal(prop.display, 'GET_KEY_STRING');
assert.equal(prop.runDisplay(), 'the key');
```