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

    if (category == 1) {
        category = '都市'
    } else if (category == 2) {
        category = '玄幻'
    } else if (category == 3) {
        category = '历史'
    } else if (category == 4) {
        category = '仙侠'
    } else if (category == 5) {
        category = '游戏'
    } else if (category == 6) {
        category = '轻小说'
    } else if (category == 7) {
        category = '科幻'
    } else if (category == 8) {
        category = '悬疑'
    }
    // console.log(category)

    let data = await query(sql, [name, author, category, info, isDone, ranking]).catch(err => {
        res.send('服务器发生未知错误')
    })
    if (data.affectedRows > 0) {
        res.redirect(`/?page=${req.app.locals.page}`)
    }


})

module.exports = router;