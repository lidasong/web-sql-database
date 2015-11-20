(function(root, factory) {
    if (tyeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.IndexDB = factory();
    }
})(this, function() {
    'use strict';

    if (!'indexedDB' in window) {
        return null;
    }

    function IndexDB() {
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        this.db = null;
        this.storeObjects = {};
    }

    IndexDB.prototype = {
    	createDb:create,
    	createStore:createStore
    };

    function create(dbName, version, options) {
        version = version || 1;
        var openRequest = this.indexedDB.open(dbName, version);
        if (options) {
            for (var key in options) {
                openRequest.addEventListener(key, options[key]);
            }
        }
        if (!options.success) {
            openRequest.onsuccess = function(evt) {
                this.db = evt.target.result;
            }
        }
        if (!options.error) {
            openRequest.onerror = function(evt) {
                console.log('open IndexDB Error');
            }
        }
        return openRequest;
    }

    function createStore(storeName, options) {
    	var store;
        if (this.db.objectStoreNames.contain(storeName)) {
            return 'the store ' + storeName ' has created';
        }
        store = this.db.createObjectStore(storeName, options);
        this.storeObjects[storeName] = new StoreObject(this.db,storeName,store)
        return this.storeObjects[storeName];
    }


    function StoreObject(db, storeName,store) {
        this.storeName = storeName;
        this.db = db;
        this.store = store;
    }

    StoreObject.prototype = {
    	createIndex:createIndex,
    	add:add,
    	get:get,
    	put:put,
    	delete:delete
    };
    
    function createIndex(options){
    	var indexName = options.indexName,
    		indexAttr = options.attribute,
    		unique = options.unique;
    	this.store.createIndex(indexName,indexAttr,{unique:unique});
    }

    function add(options) {
        var transction, storeName,store,request;
        storeName = [this.storeName];
        transction = this.db.transaction(storeName, 'readwrite');
        store = transction.objectStore(this.storeName);
        request = store.add(options.data);
        request.onsuccess = options['success'].call(this);
        request.onerror = options['error'].call(this);
    }

    function get(key,options){
    	var transaction,storeName,store,request;
    	storeName= [this.storeName];
    	transaction = this.db.transaction(storeName,'readonly');
    	store = transaction.objectStore(this.storeName);
    	if(options.index){
    		request = store.index(options.index).get(key);
    	}else{
    		request = store.get(key);
    	}
    	request.onsuccess = function(){
    		options['success'].call(null,request.result);
    	}
    	request.onerror = options['error'];
    }

    function getAll(options){
    	_getSection(options);
    }

    function getRange(options){
    	var lower,lowerOpen,upper,upperOpen,
    		isLower,isUpper,isSection,range;
    	isLower = !!options.lower;
    	isUpper = !!options.upper;
    	isSection = isLower && isUpper;
    	if(options.lower){
	    	lower = options.lower.value,
    		lowerOpen = options.lower.open,
    	}
    	if(options.upper){
    		upper = options.upper.value,
    		upperOpen = options.upper.open;
    	}
    	if(isSection){
    		range = IDBKeyRange.bound(upper,lower,upperOpen,lowerOpen);
    	}else if(isLower){
    		range = IDBKeyRange.lowerBound(lower,lowerOpen);
    	}else{
    		range = IDBKeyRange.upperBound(upper,upperOpen);
    	}
    	_getSection(options,range);
    }

    function _getSection(options,range){
    	var transaction,storeName,store,result = [];
    	storeName = [this.storeName];
    	transaction = this.db.transaction(storeName,'readonly');
    	store = transaction.objectStore(this.storeName);
    	store.openCursor(range).onsuccess = function(evt){
    		var cursor = evt.target.result;
    		if(cursor){
    			result.push(cursor);
    		}else{
    			options['success'].call(null,result)
    		}
    	};
    }

    function delete(key,options){
		var transaction,storeName,store,request;
		storeName= [this.storeName];
		transaction = this.db.transaction(storeName,'readwrite');
		store = transaction.objectStore(this.storeName);
		request = store.delete(key);
		request.onsuccess = options['success']();
		request.onerror = options['error']();
    }

    function put (key,options) {
    	var transaction,storeName,store,request;
    	storeName= [this.storeName];
    	transaction = this.db.transaction(storeName,'readwrite');
    	store = transaction.objectStore(this.storeName);
    	request = store.put(options.data,key);
    	request.onsuccess = options['success'];
    	request.onerror = options['error'];
    }


    function operateStore(options){
    	var type = options.type;
    	switch(type){
    		case 'add':
		    	this.add(options.key,options);
		    	break;
    		case 'get':
    			this.get(options.key,options)
    			break;
    		case 'getAll':
    			this.getAll(options);
    		case 'delete':
    			this.delete(options.key,options);
    			break;
    		case 'put':
    			this.put(options.key,options);
    			break;
    		default:
    			break;
    	}
    }

});
