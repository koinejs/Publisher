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
        publisher.publish('event', { vars: ['a', 'b', 'c']});

        // verifies
        expect(output).toEqual('called with: a, b, c');
    });

    it("clears subscriptions", function () {
        var output = '';

        publisher.subscribe('event', function () {
            output = 'a';
        });

        publisher.clearSubscriptions();

        publisher.publish('event');

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

            publisher.publish('event');
            expect(output).toEqual('ac');
        });

        it("unsubscribes all callbacks from an event", function () {
            publisher.unsubscribe('event');

            publisher.publish('event');

            expect(output).toEqual('');
        });
    });

    describe(".wrap()", function () {
        var Class, instance1, instance2, storage1, storage2, counter;

        beforeEach(function () {
            Class = function() {};

            Class.prototype.doSomething = function () {
                this.trigger('class:do', counter++);
            };

            Koine.Publisher.wrap(Class);

            counter    = 0;
            storage1   = [];
            storage2   = [];
            instance1 = new Class();
            instance2 = new Class();

            instance1.on('class:do', function (data) {
                storage1.push(data);
            });

            instance2.on('class:do', function (data) {
                storage2.push(data);
            });
        });

        it("makes class behave like a publisher", function () {
            instance1.doSomething();
            instance2.doSomething();
            instance1.doSomething();

            expect(storage1).toEqual([0, 2]);
            expect(storage2).toEqual([1]);
        });

        it("makes possible to remove callbacks calling the .off() method on the wrapped object", function () {
            var publisher = instance1.getPublisher();

            spyOn(publisher, 'unsubscribe');

            instance1.off('class:do', 'foo');

            expect(publisher.unsubscribe).toHaveBeenCalledWith('class:do', 'foo');
        });
    });
});
