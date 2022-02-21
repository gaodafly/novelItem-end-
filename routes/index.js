var express = require('express');

var router = express.Router();

let { query } = require('../utils/mysql02_promise');

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
    res.render('index', { title: '秋季新品发布会', data, num, page });

});

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

module.exports = router;