# web-sql-database

+ ```javascript
	/**
	 * @param  {Object}
	 * name {String} 数据库名称
	 * version {String} 数据库版本号
	 * desc {String} 数据库的描述
	 * capacity {Number} 数据库容量
	 * callback {Function} 创建或者打开数据库成功的回调
	 * @return {Object} 创建或者打开的数据库对象
	 */
```
` openDb(options) `

+ ```javascript 
/**
	 * @description 创建数据表
	 * @param {String} tableName 要创建的数据表名称
	 * @param {Object} options 描述字段
	 * @param {Function} success 成功的回调
	 * @param {Function} fail 执行失败的回调
	 * @return {Undefined} 不返回结果
	 * @example
	 * createTable('student',{id:'INTEGER UNIQUE PRIMARY KEY',name:'TEXT'})
	 * -----------------------
	 * id        | name 
	 * -----------------------
	 */
```	
` createTable(tableName, options, success, fail) `

+ ```javascript 
/**
	 * @param {String} tableName 要创建的数据表名称
	 * @param  {Object} data 插入的数据字段
	 * @param {Function} success 成功的回调
	 * @param {Function} fail 执行失败的回调
	 * @return {Undefined} 无返回结果
	 * @example
	 * insert('student',{id:1,name:'author'})
	 * -----------------------
	 * id        | name 
	 * 1		 | author
	 * ----------------------- 
	 */
```
` insert(tableName, data, success, fail) `

+ ```javascript 
/**
	 * @param {String} tableName 要创建的数据表名称
	 * @param  {Array} options 要查询的字段
	 * @param {Function} success 成功的回调
	 * @param {Function} fail 执行失败的回调
	 * @return {Undefined} 无返回结果
	 * @example
	 * query('student','id')
	 * -----------
	 * id        
	 * 1		 
	 * -----------
	 */
```
` query(tableName, options, success, fail) `

+ ```javascript 
/**
	 * @param {String} tableName 要创建的数据表名称
	 * @param  {Object} options 要更新的字段以及对应的值
	 * @param  {Object} 要更新的查找字段[单条数据]
	 * @param {Function} success 成功的回调
	 * @param {Function} fail 执行失败的回调
	 * @return {Undefined} 无返回结果
	 * @example
	 * update('student',{name:'AUTHOR'},{name:'id',value:1})
	 * -----------------------
	 * id        | name 
	 * 1		 | AUTHOR
	 * -----------------------  
	 */
```
` update(tableName, options, where, success, fail) `

+ ```javascript 
/**
	 * @param {String} tableName 要创建的数据表名称
	 * @param  {Object} 要删除的查找字段[单条数据]
	 * @param {Function} success 成功的回调
	 * @param {Function} fail 执行失败的回调
	 * @return {Undefined} 无返回结果
	 * @example
	 * deleteItem('student',{name:'id',value:1})
	 * -----------------------
	 * id        | name 
	 * ----------------------- 
	 */
```
` deleteItem(tableName, where, success, fail) `

+ ```javascript 
/**
	 * @param  {String} tableName 要删除的数据表名称
	 * @param  {Function} 删除成功的回调
	 * @param  {Function} 删除失败后的回调
	 * @return {Undefined} 无返回结果
	 * @example
	 * dropTable('student')
	 * -------------------
	 * -------------------
	 */
```
` dropTable(tableName, success, fail) `

+ ```javascript 
/**
	 * @description 自己手动执行的sql
	 * @param  {String} sql语句
	 * @param  {Array||String} 需要的数据
	 * @param  {Function} 成功执行后的回调
	 * @param  {Function} 执行失败的回调
	 * @return {Undefined} 无返回结果
	 * @example
	 * var sql = 'create table if not exists student (id INTEGER NOT NULL PRIMARY KEY,name TEXT)';
	 * manualTransaction(sql);
	 * -----------------------
	 * id 		   | name
	 * -----------------------
	 */
```
` manualTransaction(sql, values, success, fail) `