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

    Koine.Publisher.prototype.publish = function (type, data) {
        var subscriptions = this._subscriptions[type] || [];

        subscriptions.forEach(function (callback) {
            callback(data);
        });

        return this;
    };


    Koine.Publisher.prototype.clearSubscriptions = function () {
        this._subscriptions = {};
    };

    Koine.Publisher.prototype.unpublish = function (type, callback) {
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

})(typeof(exports) === "undefined" ? (this.Koine || (this.Koine = {})) : exports);
