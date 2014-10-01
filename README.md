Koine Publisher
-----------------

Publisher/Subscriber implemenation

Code information:

[![Build Status](https://travis-ci.org/koinejs/Publisher.png?branch=master)](https://travis-ci.org/koinejs/Publisher)
[![Coverage Status](https://coveralls.io/repos/koinejs/Publisher/badge.png?branch=master)](https://coveralls.io/r/koinejs/Publisher?branch=master)
[![Code Climate](https://codeclimate.com/github/koinejs/Publisher.png)](https://codeclimate.com/github/koinejs/Publisher)

Package information:

[![Dependency Status](https://gemnasium.com/koinejs/Publisher.png)](https://gemnasium.com/koinejs/Publisher)


### Usage

In order to create a validator, extend the ```executeValidation``` method:

```javascript
var publisher = new Koine.Publisher();

var callback = function (event) {
    var oldName = event.data.oldName;

    console.log('Changed name of user from "' + oldName + '" to "' + this.name + '"');
}

publisher.subscribe('change:username', callback);

user.updateName = function (name) {
    var oldName = this.name;

    if (oldName === name) {
        return;
    }

    publisher.publish({
        target: user,
        type: 'change:username',
        data: { oldName: oldName }
    });
};


publisher.clearSubscriptions();                     // remove all subscriptions
publisher.unsubscribe('change:userame');            // all the change:username callbakcs
publisher.unsubscribe('change:username', callback); // only the given callback
```
Enabling triggers on Objects

```javascript
var MyClass = function () {};
MyClass.prototype.sayHello = function () {};

Koine.Publisher.wrap(MyClass);

var object = new MyClass();

object.on('sayHello', function (e.type) {
    alert(['Hello', e.name].join(' '), '!');
});

object.trigger('sayHello', 'World'); // alert('Hello World !')
object.trigger({ type: 'sayHello', name: 'World' })
```

### Installing

@TODO

### Issues/Features proposals

[Here](https://github.com/koinejs/Publisher/issues) is the issue tracker.

## Contributing

Please refer to the [contribuiting guide](https://github.com/koinejs/Publisher/blob/master/CONTRIBUTING.md).

### Lincense
[MIT](MIT-LICENSE)

### Authors

- [Marcelo Jacobus](https://github.com/mjacobus)
