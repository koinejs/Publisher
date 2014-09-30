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
            publisher.unpublish('event', b);

            publisher.publish('event');
            expect(output).toEqual('ac');
        });

        it("unsubscribes all callbacks from an event", function () {
            publisher.unpublish('event');

            publisher.publish('event');

            expect(output).toEqual('');
        });
    });

    describe(".wrap()", function () {
        var Class, publisher1, publisher2, storage1, storage2, counter;

        beforeEach(function () {
            Class = function() {};

            Class.prototype.doSomething = function () {
                this.trigger('class:do', counter++);
            };

            Koine.Publisher.wrap(Class);

            counter    = 0;
            storage1   = [];
            storage2   = [];
            publisher1 = new Class();
            publisher2 = new Class();

            publisher1.on('class:do', function (data) {
                storage1.push(data);
            });

            publisher2.on('class:do', function (data) {
                storage2.push(data);
            });
        });

        it("makes class behave like a publisher", function () {
            publisher1.doSomething();
            publisher2.doSomething();
            publisher1.doSomething();

            expect(storage1).toEqual([0, 2]);
            expect(storage2).toEqual([1]);
        });
    });
});
