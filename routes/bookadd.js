let express = require('express');

let router = express.Router();

let { query } = require('../utils/mysql02_promise')


router.get('/add', (req, res) => {
    res.render('bookadd', { title: '添加小说' })
})

router.post('/insert', async(req, res) => {
    // console.log(req.app.locals.page)
    let { name, author, category, info, isDone, ranking } = req.body
    let sql = 'insert into bookdata(name, author, category, info, isDone, ranking ) values(?,?,?,?,?,?)'
        // let sql = 'select * from bookdata'
    isDone = isDone ? 0 : 1;

    let data = await query(sql, [name, author, category, info, isDone, ranking]).catch(err => {
        res.send('服务器发生未知错误')
    })
    if (data.affectedRows > 0) {
        res.redirect(`/?page=${req.app.locals.page}`)
    }


})

module.exports = router;