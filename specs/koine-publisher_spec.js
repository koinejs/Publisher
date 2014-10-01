if (typeof(require) === 'function') {
    var Koine = require('../src/koine-publisher.js');
}

describe("Koine.Publisher", function () {
    var publisher;

    beforeEach(function () {
        publisher = new Koine.Publisher();
    });

    it("is instanciable", function () {
        expect(publisher).toBeDefined();
    });

    it("publishes callbacks", function () {
        // prepare
        var output = null;

        publisher.subscribe('event', function (data) {
            output = 'called with: ' + data.vars.join(', ');
        });

        // executes
        var e = new Koine.Publisher.EventType("event");
        e.vars = ['a', 'b', 'c'];
        publisher.publish(e);

        // verifies
        expect(output).toEqual('called with: a, b, c');
    });

    it("throws error when tries to publish a non EventType object", function () {
        var publish = function () {
            publisher.publish({});
        };

        expect(publish).toThrow();
    });

    it("publishes callbacks with alternative contexts", function () {
        var Class = function () {
            this.getName = function () {
                return 'foo';
            };
        };

        var object = new Class();

        var storage = [];

        publisher.subscribe('event', function () {
            storage.push(this.getName());
        });

        var e = new Koine.Publisher.EventType("event", object);
        publisher.publish(e);

        expect(storage).toEqual(['foo']);
    });

    it("clears subscriptions", function () {
        var output = '';

        publisher.subscribe('event', function () {
            output = 'a';
        });

        publisher.clearSubscriptions();

        var e = new Koine.Publisher.EventType("event");
        publisher.publish(e);

        expect(output).toEqual('');
    });

    describe('.unsubscribe()', function () {
        var a, b, c;

        beforeEach(function () {
            output = '';

            a = function () { output += 'a'; };
            b = function () { output += 'b'; };
            c = function () { output += 'c'; };

            publisher.subscribe('event', a);
            publisher.subscribe('event', b);
            publisher.subscribe('event', c);
            publisher.subscribe('event', b);
        });

        it("unsubscribes single event", function () {
            publisher.unsubscribe('event', b);

            var e = new Koine.Publisher.EventType("event");
            publisher.publish(e);
            expect(output).toEqual('ac');
        });

        it("unsubscribes all callbacks from an event", function () {
            publisher.unsubscribe('event');

            var e = new Koine.Publisher.EventType("event");
            publisher.publish(e);

            expect(output).toEqual('');
        });
    });

    describe(".wrap()", function () {
        var Class, instance1, instance2, storage1, storage2, counter;

        beforeEach(function () {
            Class = function() {};

            Class.prototype.doSomething = function () {
                var e = new Koine.Publisher.EventType("class:do");
                e.data = counter++;

                this.trigger(e);
            };

            Class.prototype.sayHello = function (data) {
                return "Hello " + data;
            };

            Koine.Publisher.wrap(Class);

            counter    = 0;
            storage1   = [];
            storage2   = [];
            instance1 = new Class();
            instance2 = new Class();

            instance1.on('class:do', function (event) {
                storage1.push(event.data);
            });

            instance2.on('class:do', function (event) {
                storage2.push(event.data);
            });
        });

        it("makes class behave like a publisher", function () {
            instance1.doSomething();
            instance2.doSomething();
            instance1.doSomething();

            expect(storage1).toEqual([0, 2]);
            expect(storage2).toEqual([1]);
        });

        it("calls publish in the context of the wrapped object", function () {
            instance1.on('event', function () {
                storage1.push(this.sayHello('World'));
            });


            var e = new Koine.Publisher.EventType("event");
            instance1.trigger(e);

            expect(storage1).toEqual(['Hello World']);
        });

        it("makes possible to remove callbacks calling the .off() method on the wrapped object", function () {
            var publisher = instance1.getPublisher();

            spyOn(publisher, 'unsubscribe');

            instance1.off('class:do', 'foo');

            expect(publisher.unsubscribe).toHaveBeenCalledWith('class:do', 'foo');
        });
    });
});

describe("Koine.Publisher.EventType", function () {
    var Class, event;
    beforeEach(function () {
        Class = function() {
            Koine.Publisher.EventType.call(this, "class");
        };

        Class.prototype = Koine.Publisher.EventType.prototype;
        event = new Class();
    });

    it("is inheritable", function () {
        expect(event instanceof Koine.Publisher.EventType).toBeTruthy();
    });

    it("returns type", function () {
        expect(event.type).toEqual('class');
    });

    it("throws Error when no type is defined", function () {
        var construct = function () {
            new Koine.Publisher.EventType;
        };

        expect(construct).toThrow();
    });

    it("target is initially undefined", function () {
        expect(event.target).toBeUndefined();
    });

    it("has a settable target", function () {
        var t = "target";
        expect(new Koine.Publisher.EventType("type", t).target).toEqual(t)
    });
});
