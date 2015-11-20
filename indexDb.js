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

    /**
     * @description IndexedDB的构造函数接口
     * @constructor IndexDB 
     */

    function IndexDB() {
        this.db = null;
        this.storeObjects = {};
    }

    IndexDB.prototype = {
        createDb: create,
        createStore: createStore
    };
    /**
     * @description 使用IndexDB创建一个非关系型数据库
     * @param  {[String]} dbName      数据库名称
     * @param  {[String||Number]} version     版本号
     * @param  {[Function]} upgradeneed 监听第一次创建的回调函数(创建存储空间Store)
     * @return {[Object]}             IDBOpenDBRequest对象
     */
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
    /**
     * @description 创建数据存储空间
     * @param  {[String]} storeName 数据存储空间的名称
     * @param  {[Object]} options   创建需要的参数(比如回调，keyPath)
     * @return {[Object]}           创建的store对象
     */
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

    /**
     * @description 封装的store对象，用于的storeObject的操作
     * @constructor 存储空间的构造函数
     * @param {[Object]} db        上一步创建好的非关系型数据库
     * @param {[String]} storeName 要创建的存储空间store的名称
     * @param {[Object]} store     第一步创建时的保留的store对象，用于生成index
     */
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
    /**
     * 使用第一次创建存储空间时候的store对象生成索引
     * @param  {[Object]} options 创建索引需要的参数(索引名、索引值)
     * @return {[Undefined]}         undefined
     */
    function createIndex(options) {
        var indexName = options.indexName,
            indexAttr = options.attribute,
            unique = options.unique;
        this.store.createIndex(indexName, indexAttr, {
            unique: unique
        });
    }
    /**
     * 向存储空间storeObject对象中添加一条数据
     * @param {[Object]} options 添加数据需要的参数(数据、回调)
     */
    function add(options) {
        var storeName, request;
        storeName = [this.storeName];
        request = this.db.transaction(storeName, 'readwrite')
            .objectStore(this.storeName)
            .add(options.data);
        request.onsuccess = options['success'].bind(this);
        request.onerror = options['error'].bind(this);
    }
    /**
     * 获取存储空间中的一条数据
     * @param  {[String||Number]} key     查询所需要的keypath
     * @param  {[Object]} options 查询中的参数对象
     * @return {[Undefined]}         异步调用一般是使用回调来调用，不适用直接返回数值
     */
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
    /**
     * 获取存储空间所有数据
     * @param  {[Object]} options 查询中的参数对象
     * @return {[Undefined]}         异步调用一般是使用回调来调用，不适用直接返回数值
     */
    function getAll(options) {
        _getSection.call(this, options);
    }

    /**
     * 获取存储空间区间中的数据
     * @param  {[Object]} options 查询中的参数对象
     * @return {[Undefined]}         异步调用一般是使用回调来调用，不适用直接返回数值
     */
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
    /**
     * 获取存储空间区间中的数据，内部的静态函数
     * @param  {[Object]} options 查询中的参数对象】
     * @param {Object} range IDBKeyRange区间对象
     * @return {[Undefined]}         异步调用一般是使用回调来调用，不适用直接返回数值
     */
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
    /**
     * 删除存储空间中的数据条目
     * @param  {[String|Number]} key     keypath查询需要的key值
     * @param  {[Object]} options 删除的回调对象
     * @return {[Undefined]}         
     */
    function remove(key, options) {
        var storeName, request;
        storeName = [this.storeName];
        request = this.db.transaction(storeName, 'readwrite')
            .objectStore(this.storeName)
            .delete(key);
        request.onsuccess = options['success'];
        request.onerror = options['error'];
    }
    /**
     * 更新存储空间中的数据条目
     * @param  {[Object]} options 更新的回调对象以及数据
     * @return {[Undefined]}         
     */
    function put(options) {
        var transaction, storeName, store, request;
        storeName = [this.storeName];
        request = this.db.transaction(storeName, 'readwrite')
            .objectStore(this.storeName)
            .put(options.data);
        request.onsuccess = options['success'] || validFunc;
        request.onerror = options['error'] || validFunc;
    }

    /**
     * 所有基本操作的装饰器
     * @param  {[Object]} options 操作存储空间的所需对象
     * @return {[Undefined]}         
     */
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
