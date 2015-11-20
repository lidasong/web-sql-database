(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.IndexDB = factory();
    }
})(this, function() {
    'use strict';

    if (!'indexedDB' in window) {
        return null;
    }
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    function IndexDB() {
        this.db = null;
        this.storeObjects = {};
    }

    IndexDB.prototype = {
        createDb: create,
        createStore: createStore
    };

    function create(dbName, version, upgradeneed) {
        var self = this,
            openRequest = indexedDB.open(dbName, version);
        if (upgradeneed && typeof upgradeneed == 'function') {
            openRequest.onupgradeneeded = function(evt) {
                self.db = evt.target.result;
                upgradeneed.call(self);
            }
        }
        openRequest.onsuccess = function(evt) {
            var storeNames;
            self.db = evt.target.result;
            storeNames = self.db.objectStoreNames;
            for (var i = 0; i < storeNames.length; i++) {
                var storeName = storeNames[i];
                self.storeObjects[storeName] = new StoreObject(self.db, storeName)
            }
        }
        openRequest.onerror = function(evt) {
            console.log('open IndexDB Error');
        }
        return openRequest;
    }

    function createStore(storeName, options) {
        var store;
        if (this.db.objectStoreNames.contains(storeName)) {
            console.log('the store ' + storeName + ' has created');
        }
        store = this.db.createObjectStore(storeName, options);
        this.storeObjects[storeName] = new StoreObject(this.db, storeName, store)
        alert('创建store');
        return this.storeObjects[storeName];
    }


    function StoreObject(db, storeName, store) {
        this.storeName = storeName;
        this.db = db;
        this.store = store;
    }

    StoreObject.prototype = {
        createIndex: createIndex,
        add: add,
        get: get,
        getAll: getAll,
        getRange: getRange,
        put: put,
        delete: remove,
        operateStore: operateStore
    };

    function createIndex(options) {
        var indexName = options.indexName,
            indexAttr = options.attribute,
            unique = options.unique;
        this.store.createIndex(indexName, indexAttr, {
            unique: unique
        });
    }

    function add(options) {
        var storeName, request;
        storeName = [this.storeName];
        request = this.db.transaction(storeName, 'readwrite')
            .objectStore(this.storeName)
            .add(options.data);
        request.onsuccess = options['success'].bind(this);
        request.onerror = options['error'].bind(this);
    }

    function get(key, options) {
        var storeName, store, request;
        options ? '' : options = {};
        storeName = [this.storeName];
        store = this.db.transaction(storeName, 'readonly')
            .objectStore(this.storeName);
        if (options.index) {
            request = store.index(options.index).get(key);
        } else {
            request = store.get(key);
        }
        request.onsuccess = function() {
            options['success'] = options['success'] || function(result) {
                return result;
            };
            return options['success'].call(null, request.result);
        }
        options['error'] = options['error'] || function(result) {
            console.log('error to get indexedDB data');
        };
        request.onerror = options['error'];
    }

    function getAll(options) {
        _getSection.call(this, options);
    }

    function getRange(options) {
        var lower, lowerOpen, upper, upperOpen,
            isLower, isUpper, isSection, range;
        isLower = !!options.lower;
        isUpper = !!options.upper;
        isSection = isLower && isUpper;
        if (options.lower) {
            lower = options.lower.value;
            lowerOpen = options.lower.open;
        }
        if (options.upper) {
            upper = options.upper.value;
            upperOpen = options.upper.open;
        }
        if (isSection) {
            range = IDBKeyRange.bound(upper, lower, upperOpen, lowerOpen);
        } else if (isLower) {
            range = IDBKeyRange.lowerBound(lower, lowerOpen);
        } else {
            range = IDBKeyRange.upperBound(upper, upperOpen);
        }
        _getSection.call(this, options, range);
    }

    function _getSection(options, range) {
        var request, storeName, store, result = [];
        storeName = [this.storeName];
        request = this.db.transaction(storeName, 'readonly')
            .objectStore(this.storeName)
            .openCursor(range);
        request.onsuccess = function(evt) {
            var cursor = evt.target.result;
            if (cursor) {
                result.push(cursor.value);
                cursor.continue();
            } else {
                options['success'].call(null, result)
            }
        };
        request.onerror = options['error'] || function() {
            console.log('get indexedDb data causes error');
        };
    }

    function remove(key, options) {
        var storeName, request;
        storeName = [this.storeName];
        request = this.db.transaction(storeName, 'readwrite')
            .objectStore(this.storeName)
            .delete(key);
        request.onsuccess = options['success'];
        request.onerror = options['error'];
    }

    function put(options) {
        var transaction, storeName, store, request;
        storeName = [this.storeName];
        request = this.db.transaction(storeName, 'readwrite')
            .objectStore(this.storeName)
            .put(options.data);
        request.onsuccess = options['success'] || validFunc;
        request.onerror = options['error'] || validFunc;
    }


    function operateStore(options) {
        var type = options.type;
        switch (type) {
            case 'add':
                this.add(options.key, options);
                break;
            case 'get':
                this.get(options.key, options)
                break;
            case 'getAll':
                this.getAll(options);
            case 'delete':
                this.delete(options.key, options);
                break;
            case 'put':
                this.put(options);
                break;
            default:
                break;
        }
    }

    function validFunc() {
        return;
    }
    return IndexDB;
});
