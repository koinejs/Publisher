(function (Koine) {
    "use strinct";

    Koine.Publisher = function () {
        this.clearSubscriptions();
    };

    Koine.Publisher.prototype.subscribe = function (type, callback) {
        this._subscriptions[type] = this._subscriptions[type] || [];
        this._subscriptions[type].push(callback);

        return this;
    };

    Koine.Publisher.prototype.publish = function (e) {
        if (!(e instanceof Koine.Publisher.EventType)) {
            throw new Error("Event must be instance of Koine.Publisher.EventType");
        }

        var subscriptions = this._subscriptions[e.type] || [];

        subscriptions.forEach(function (callback) {
            callback.call(e.target, e);
        });

        return this;
    };


    Koine.Publisher.prototype.clearSubscriptions = function () {
        this._subscriptions = {};
    };

    Koine.Publisher.prototype.unsubscribe = function (type, callback) {
        if (callback) {
            var callbacks = this._subscriptions[type] || [];
            var index = 1;

            while (index >= 1) {
                index = callbacks.indexOf(callback);

                if (index >= 0) {
                    callbacks.splice(index, 1);
                }
            }
        } else if(type) {
            this._subscriptions[type] = [];
        }

        return this;
    };

    Koine.Publisher.wrap = function (className) {

        className.prototype.getPublisher = function () {
            this._publisher = this._publisher || new Koine.Publisher();
            return this._publisher;
        };

        className.prototype.on = function (eventName, callback) {
            this.getPublisher().subscribe(eventName, callback);

            return this;
        };

        className.prototype.trigger = function (e) {
            e.target = e.target || this;
            this.getPublisher().publish(e);

            return this;
        };

        className.prototype.off = function (eventName, callback) {
            this.getPublisher().unsubscribe(eventName, callback);

            return this;
        };
    };

    Koine.Publisher.EventType = function (type, target) {
        if (typeof type !== "string") {
            throw new Error("Type must be provided");
        }

        this.target = target;

        this.type = type;
    };

})(typeof(exports) === "undefined" ? (this.Koine || (this.Koine = {})) : exports);
