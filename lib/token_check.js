const md5 = require('md5'); //  MD5加密
function check(token) {// 验证token
  
  let myToken = '';
  return md5(token) === myToken;
}
exports.check = check;