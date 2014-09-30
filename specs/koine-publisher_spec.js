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
});
