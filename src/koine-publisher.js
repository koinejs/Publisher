var exports = exports || null;

(function (Koine) {
  "use strinct";

  /**
   * Publisher/Subscriber implementation
   */
  Koine.Publisher = function () {
    this.clearSubscriptions();
  };

  Koine.Publisher.prototype = {

    /**
     * Sets the callback
     * @param string type
     * @param function callback
     * @return self
     */
    subscribe : function (type, callback) {
      this._subscriptions[type] = this._subscriptions[type] || [];
      this._subscriptions[type].push(callback);

      return this;
    },

    /**
     * Publishes an event
     * @param EventType e
     * @return self
     */
    publish : function (e) {
      if (!(e instanceof Koine.Publisher.EventType)) {
        throw new Error("Event must be instance of Koine.Publisher.EventType");
      }

      var subscriptions = this._subscriptions[e.type] || [];

      subscriptions.forEach(function (callback) {
        callback.call(e.target, e);
      });

      return this;
    },

    /**
     * Clears subscritions
     * @return self
     */
    clearSubscriptions : function () {
      this._subscriptions = {};
    },

    /**
     * Unsubscribes an event
     * @param string type
     * @param function callback
     * @return self
     */
    unsubscribe : function (type, callback) {
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
    }
  };


  /**
   * Wrapps a class. Adds event methods to it:
   *  .on()
   *  .off()
   *  .trigger()
   */
  Koine.Publisher.wrap = function (className) {

    /**
     * Get the publisher
     * @param object obj
     * @return Koine.Publisher
     */
    className.prototype.getPublisher = function () {
      this._publisher = this._publisher || new Koine.Publisher();
      return this._publisher;
    };

    /**
     * Subscribe an event
     * @param string eventName
     * @param function callback
     * @return self
     */
    className.prototype.on = function (eventName, callback) {
      this.getPublisher().subscribe(eventName, callback);

      return this;
    };

    /**
     * Unsubscribes an event
     * @param string eventName
     * @param function callback optional. If not given all the eventName types
     *  will be unsubscribed
     * @return self
     */
    className.prototype.off = function (eventName, callback) {
      this.getPublisher().unsubscribe(eventName, callback);

      return this;
    };

    /**
     * Fires an event
     * @param Koine.Publisher.EventType e
     * @return self
     */
    className.prototype.trigger = function (e) {
      e.target = e.target || this;
      this.getPublisher().publish(e);

      return this;
    };
  };

  /**
   * Event type
   * @param string type
   * @param string target
   * @return self
   */
  Koine.Publisher.EventType = function (type, target) {
    if (typeof type !== "string") {
      throw new Error("Type must be provided");
    }

    this.target = target;

    this.type = type;
  };

})(exports ? exports :(this.Koine || (this.Koine = {})));
