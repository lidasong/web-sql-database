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

    }

    function createStore(storeName, options) {
        if (this.db.objectStoreNames.contain(storeName)) {
            return 'the store ' + storeName ' has created';
        }
        this.db.createObjectStore(storeName, options);
        this.storeObjects[storeName] = new StoreObject(this.db,storeName)
    }


    function StoreObject(db, storeName) {
        this.storeName = storeName;
        this.db = db;
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

    function get(itemName,options){
    	var transaction,storeName,store,request;
    	storeName= [this.storeName];
    	transaction = this.db.transaction(storeName,'readonly');
    	store = transaction.objectStore(this.storeName);
    	request = store.get(itemName);
    	request.onsuccess = options['success'];
    	request.onerror = options['error'];
    }

    function delete(key,options){
		var transaction,storeName,store,request;
		storeName= [this.storeName];
		transaction = this.db.transaction(storeName,'readwrite');
		store = transaction.objectStore(this.storeName);
		request = store.delete(key);
		request.onsuccess = options['success'];
		request.onerror = options['error'];
    }

    function operateStore(options){
    	var transction, storeName,store,request,type,pattern;
    	type = options.type;
    	pattern = options.pattern;
    	storeName = [this.storeName];
    	transction = this.db.transaction(storeName, pattern);
    	store = transction.objectStore(this.storeName);
    	switch(type){
    		case 'add':
		    	request = store.add(options.data);
		    	break;
    		case 'get':
    			request = store.get(options.itemName);
    			break;
    		case 'delete':
    			request = store.delete(options.key);
    			break;
    		default:
    			break;
    	}
    	request.onsuccess = options['success'].call(this);
    	request.onerror = options['error'].call(this);
    }

});
