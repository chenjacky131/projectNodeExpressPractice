require('dotenv').config();
// 引入mongodb数据库驱动
var MongoClient = require('mongodb').MongoClient;
//连接mongodb
var client = new MongoClient(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds046027.mlab.com:46027/${process.env.DB_NAME}`, {useUnifiedTopology: true});

async function Collection() {//  异步导出数据库表的函数
	try {
		await client.connect();// 连接数据库
		var db = client.db(process.env.DB_NAME);//  获取数据库
		var collection = db.collection('site');//  获取表
		return collection;
	}catch(err) {
		if(err) {
			return err;
		}
	}	
}

module.exports.Collection = Collection;