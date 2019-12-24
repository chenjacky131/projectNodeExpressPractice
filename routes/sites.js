const express = require('express');
const router = express.Router();
const collection = require('../lib/mongodb').Collection();// 获取不要插入数据的表
const ObjectId = require('mongodb').ObjectId;
/* 添加站点的路由get */
router.get('/addSite', function(req, res, next) {
  res.render('addSites', { title: `${req.app.locals.projectName}(增加站点数据)`});
});
/* 添加站点的路由post */
router.post('/addSite', function(req, res, next) {
	collection.then(function(coll){
		try{			
			coll.insertOne({name: req.body.name, url: req.body.url});// 插入一条数据
			res.send('数据插入成功！');
		}catch(err){
			res.send('数据插入失败！', err);
		}			
	});
});
/* 查看站点的路由(前端接口) */
router.get('/siteDetailFront', function(req, res, next) {
	collection.then(function(coll){		
		coll.find().toArray(function(err, doc){
			if(err) {
				throw err;
				res.send('数据查询失败！', err);
			}
			res.json(doc)
		});// 列出表里面的所有站点数据
	});	
});
/* 查看站点的路由 */
router.get('/siteDetail', function(req, res, next) {
	collection.then(function(coll){		
		coll.find().toArray(function(err, doc){
			if(err) {
				throw err;
				res.send('数据查询失败！', err);
			}
			res.render('sites', { title: `${req.app.locals.projectName}(站点操作(查(R)、改(U)、删(D))`, sites: doc})
		});// 列出表里面的所有站点数据
	});	
});
/* 删除站点的路由 */
router.post('/deleteSite', function(req, res, next) {
	collection.then(function(coll){	
		coll.findOneAndDelete({_id: ObjectId(req.body._id)},function(err, result){
			if(err) {
				throw err;
				res.send('数据删除失败！', err);
			}
			if(!result.value) {
				res.send('未找到该数据');
			}else{
				res.send(result.value);
			}			
		});// 删除一条站点数据		
	});
});
/* 编辑站点的路由get */
router.get('/editSite/:id', function(req, res, next) {
	collection.then(function(coll){		
		coll.findOne({_id : ObjectId(req.params.id)},function(err, doc){
			if(err) {
				throw err;
				res.send('站点不存在！');
			}
			res.render('editSite', { title: `${req.app.locals.projectName}(修改站点)`, site: doc, id: req.params.id})
		});// 列出表里面的所有站点数据
	});	
});
/* 编辑站点的路由post */
router.post('/editSite/:id', function(req, res, next) {
	collection.then(function(coll){		
		coll.findOneAndUpdate({_id : ObjectId(req.params.id) }, {$set: {name: req.body.name, url: req.body.url} }, function(err, result) {
			if(err) {
				throw err;
				res.send('编辑失败1！');
			}
			if(!result.value) {
				res.send('编辑失败2！');
			}else{
				res.send(`${JSON.stringify(result.value)}修改成功!`);
			}
		});// 列出表里面的所有站点数据
	});	
});
module.exports = router;
