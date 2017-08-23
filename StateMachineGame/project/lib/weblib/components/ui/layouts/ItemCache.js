BASE.require([
    "Array.prototype.asQueryable",
    "BASE.collections.Hashmap",
    "BASE.async.Future",
    "Array.prototype.orderBy"
], function () {

    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var delayAsync = BASE.async.delayAsync;
    var emptyFuture = Future.fromResult();
    var filterByValue = function (value) { return value; };
    var BACK = -1;
    var FORWARD = 1;

    BASE.namespace("components.ui.layouts");

    var ItemCache = function (cacheSize) {
        var self = this;
        var queryable = [].asQueryable();
        var itemsByIndex = new Hashmap();
        var setItemCallbacks = new Hashmap();
        var outstandingQueryableRanges = [];
        var maxThreshold = cacheSize;
        var minThreshold = cacheSize * 0.66;
        var take = 50;
        var count = null;
        var observers = {
            queryError: [],
            querySuccess: [],
            query: []
        };

        var pendingQueryableFutures = [];

        var notifyObservers = function (type) {
            var typedObservers = observers[type];
            typedObservers.forEach(function (observer) {
                observer.notify();
            });
        };

        var addPendingFuture = function (future) {
            if (pendingQueryableFutures.length > 3) {
                pendingQueryableFutures.shift().cancel();
            }
            pendingQueryableFutures.push(future);
        };

        var removePendingFuture = function (future) {
            var index = pendingQueryableFutures.indexOf(future);

            if (index > -1) {
                pendingQueryableFutures.splice(index, 1);
            }
        };

        var clearCache = {};
        clearCache[BACK] = function () {
            var cacheKeys = itemsByIndex.getKeys().orderByDesc(filterByValue);

            while (cacheKeys.length > minThreshold) {
                itemsByIndex.remove(cacheKeys.pop());
            }
        };

        clearCache[FORWARD] = function () {
            var cacheKeys = itemsByIndex.getKeys().orderBy(filterByValue);

            while (cacheKeys.length > minThreshold) {
                itemsByIndex.remove(cacheKeys.pop());
            }
        };

        self.setTake = function (value) {
            take = value;
        };

        self.setQueryable = function (value) {
            queryable = value;
        };

        self.removeItemAtIndex = function (index) {
            itemsByIndex.remove(index);
        };

        self.setItemAtIndex = function (index, item) {
            itemsByIndex.add(index, item);
        };

        self.loadItem = function (index, setItem, setToLoading, direction) {
            if (itemsByIndex.getItemCount() > maxThreshold) {
                clearCache[direction]();
            }

            if (count === 0) {
                return;
            }

            var item = itemsByIndex.get(index);
            var skip = index;

            if (item !== null) {
                setItem(item, index);
                return;
            }

            setItemCallbacks.add(index, setItem);
            setToLoading(index);

            var withinRange = outstandingQueryableRanges.some(function (range) {
                return index >= range.skip && index < range.skip + range.take;
            });

            if (withinRange) {
                return;
            }

            if (direction === BACK) {
                skip = index - take;
                skip = skip > 0 ? skip : 0;
            }

            var range = {
                skip: skip,
                take: take
            };

            outstandingQueryableRanges.push(range);

            notifyObservers("query");

            var futureArray = delayAsync(75).chain(function () {
                return queryable.skip(skip).take(take).toArray().then(function (items) {
                    items.forEach(function (item, itemIndex) {
                        var index = skip + itemIndex;
                        itemsByIndex.add(index, item);
                        var callback = setItemCallbacks.remove(index);

                        if (typeof callback === "function") {
                            callback(item, index);
                        }
                    });

                    notifyObservers("querySuccess");
                }).ifError(function () {
                    notifyObservers("queryError");
                });
            }).finally(function () {
                var rangeIndex = outstandingQueryableRanges.indexOf(range);
                if (rangeIndex > -1) {
                    outstandingQueryableRanges.splice(rangeIndex, 1);
                }

                removePendingFuture(futureArray);
            }).try();

            addPendingFuture(futureArray);
        };

        self.clear = function () {
            count = null;
            itemsByIndex = new Hashmap();
            setItemCallbacks = new Hashmap();
            outstandingQueryableRanges = [];
        };

        self.getCount = function () {

            if (count !== null) {
                return Future.fromResult(count);
            }

            var expression = queryable.getExpression();
            var skipExpression = expression.skip;
            var skip = skipExpression === null ? 0 : skipExpression.children[0].value;

            notifyObservers("query");

            return queryable.take(take).toArrayWithCount().chain(function (resultArrayWithCount) {
                var array = resultArrayWithCount.array;
                count = resultArrayWithCount.count;

                array.forEach(function (item, index) {
                    itemsByIndex.add(skip + index, item);
                });

                notifyObservers("querySuccess");

                return count;
            }).ifError(function () {
                notifyObservers("queryError");
            });

        };

        self.observe = function (type, callback) {
            if (typeof type !== "string") {
                throw new Error("type needs to be a string.");
            }

            if (typeof callback !== "function") {
                throw new Error("callback needs to be a function.");
            }

            var typeObservers = observers[type];
            var observer = {
                notify: function () {
                    callback.apply(null, arguments);
                },
                dispose: function () {
                    var index = typeObservers.indexOf(observer);
                    if (index > -1) {
                        typeObservers.splice(index, 1);
                    }
                }
            };

            typeObservers.push(observer);

            return observer;
        };


    };

    ItemCache.BACK = BACK;
    ItemCache.FORWARD = FORWARD;

    components.ui.layouts.ItemCache = ItemCache;

});