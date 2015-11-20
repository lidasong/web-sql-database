# web-sql-database

## 关系型数据库接口说明

+ **打开已有数据库或者创建数据库**
```javascript
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

+ **创建一个数据表，提供数据表名称以及定义的字段**
```javascript 
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

+ **向已有的数据表中插入数据，提供数据表名称以及各个字段的数值**
```javascript 
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

+ **查询数据表，获取数据表中的部分数据，提供数据表名称，以及获取的字段，如果不提供字段，则获取所有字段内容**
```javascript 
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

+ **更新已有数据表数据，提供需要更新的数据表名称、查询范围**
```javascript 
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

+ **删除已有的数据表中的特定的数据，提供数据表名称以及查询的范围**
```javascript 
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

+ **删除已有的数据表，提供要删除的数据表名称**
```javascript 
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

+ **提供的额外的数据表操作接口，因为上面列出的只是简单的数据库操作接口，复杂的数据表操作接口的sql语句，
需要自己手动完成，毕竟没有一条万能的sql语句可以处理所有的数据表操作**
```javascript 
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