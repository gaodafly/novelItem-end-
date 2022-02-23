// const my=require('./http.js')
const mysql = require('mysql');
//创建连接池
const pool = mysql.createPool({
    host: 'localhost', //连接主机
    port: 3306, //端口号
    user: 'root', //用户名
    password: 'root', //密码
    database: 'user', //连接的是哪一个库
    connectionLimit: 50, //用于指定连接池中最大的链接数，默认属性值为10. 
    queueLimit: 10 //用于指定允许挂起的最大连接数，如果挂起的连接数超过该数值，就会立即抛出一个错误，默认属性值为0.代表不允许被挂起的最大连接数。
})

function query(sql, values = []) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log('与mysql数据库建立连接失败');
                //调用回调函数
                // callback(err,null)
                reject(err)
                pool.releaseConnection(); //释放链接
            } else {
                console.log('与mysql数据库建立连接成功');
                connection.query(sql, values, function(err, rows) {
                    if (err) {
                        //调用回调函数
                        // callback(err,null)
                        reject(err)
                        console.log('执行sql语句失败，查询数据失败');
                        connection.release(); //释放链接
                    } else {
                        //rows为结果
                        //调用回调函数
                        // callback(null,rows)
                        resolve(rows)
                            // console.log('结果-----',rows);
                            //关闭连接池
                            // pool.end();  
                        connection.release(); //释放链接
                    }
                })
            }
        })
    })


}

module.exports.userquery = query;























// console.log(module);

// paths: [
//     'E:\\h5\\node\\node_modules',
//     'E:\\h5\\node_modules',
//     'E:\\node_modules'
//   ]