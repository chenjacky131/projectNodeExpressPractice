async function Connect(req, colName) {// 返回数据库中的具体表(req:路由中的请求对象，colName:数据库里面的表民)
  return req.app.mgClient.db(process.env.DB_NAME).collection(colName)
}
exports.Connect = Connect;