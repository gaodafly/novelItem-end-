function delevent(value) {
    let res = confirm('确认要删除吗？')
        // console.log(res)
        // console.log(value)

    if (res) {
        window.location.href = `http://localhost:3000/delItem?id=${value}`
    }
}