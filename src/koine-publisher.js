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

    Koine.Publisher.prototype.publish = function (type, data, context) {
        var subscriptions = this._subscriptions[type] || [];
        context = context || this;

        subscriptions.forEach(function (callback) {
            callback.call(context, data);
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

        className.prototype.trigger = function (eventName, data) {
            this.getPublisher().publish(eventName, data, this);

            return this;
        };

        className.prototype.off = function (eventName, callback) {
            this.getPublisher().unsubscribe(eventName, callback);

            return this;
        };
    };

})(typeof(exports) === "undefined" ? (this.Koine || (this.Koine = {})) : exports);
