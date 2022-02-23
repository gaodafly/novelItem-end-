var express = require('express');

var router = express.Router();

let { query } = require('../utils/mysql02_promise');
let { userquery } = require('../utils/loginmysql')


router.get('/', async function(req, res) {
    let { page } = req.query;
    //默认展示第一条
    page = !page ? 1 : page;

    req.app.locals.page = page
        // console.log(req.query.page)
        //总条数
    let count = await query('select count(*) as count from bookdata')
    count = count[0].count;
    // console.log(count);

    // 页数
    let num = Math.ceil(count / 5)
        // console.log(num);
    let data = await query('select * from bookdata order by ranking limit ?,5', [(page - 1) * 5]).catch(err => {
            console.log(err);
        })
        // console.log(data)

    res.render('index', { title: '秋季新品发布会', data, num, page, username: req.session.username });


});


// 删除路由
router.get('/delItem', async(req, res) => {
    // console.log(req.query)
    let { id } = req.query;
    let sql = 'delete from bookdata where id =?';

    let data = await query(sql, [id]).catch(err => {
        res.send('服务器发生未知错误')
    })
    if (data.affectedRows > 0) {
        res.redirect(`/?page=${req.app.locals.page}`)
    }


})

// 查询路由
router.get('/search', async(req, res) => {
    // console.log(req.query)
    let { keyword } = req.query;
    keyword = keyword.trim();
    // console.log(keyword)
    let sql = `select * from bookdata where name like '%${keyword}%' or author like '%${keyword}%'`

    let data = await query(sql).catch(err => {
            res.send('服务器发生未知错误')
        })
        // console.log(data)
    res.render('search', { data })

})

//登录界面路由
router.get('/login', (req, res) => {

    res.render('login', { title: '登录界面' })


})

router.get('/loginTo', async(req, res) => {
    // console.log(req.query)
    let sql = 'select * from class2 where name=? and password=?';
    let data = await userquery(sql, [req.query.username, req.query.password]).catch(err => {
            res.send('服务器发生未知错误')
        })
        // console.log(data.length)
        // console.log(req.query.username, req.query.password)

    if (data.length == 1) {
        // 添加session属性 username
        req.session.username = req.query.username;
        res.redirect('/')
    } else {
        res.redirect(`/login`)
    }

})

// 删除session值
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

// 修改
router.get('/modify', async(req, res) => {

    let { id } = req.query;
    // console.log(id)

    let sql = 'select * from bookdata where id =?'
    let data = await query(sql, [id])
    data = data[0]
    let { name, author, category, info, isDone, ranking } = data

    // console.log(name, author, category, info, isDone, ranking)
    res.render('modify', { title: '修改界面', name, author, category, info, isDone, ranking, id })
})
router.post('/modifyTo', async(req, res) => {
    // console.log(req.body)

    let { name, author, ranking, category, info, isDone, id } = req.body;
    isDone = isDone ? 0 : 1;
    let sql = 'update bookdata set name=?,author=?,ranking=?,category=?,info=?,isDone=? where id=?'
    let data = await query(sql, [name, author, ranking, category, info, isDone, id]).catch(err => {
            console.log(err)
        })
        // console.log(data)
    res.redirect('/')
})



module.exports = router;