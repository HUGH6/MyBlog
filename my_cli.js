
let option = process.argv[2]

var exec = require('child_process').exec

// 1、创建文档

// 2、编写完后，执行hexo clean && hexo g && hexo d

// 3、将git仓库的所以变更同步到远程仓库


// 命令行
const GIT_STATUS = 'git status'
const GIT_ADD_ALL = 'git add *'
const GIT_COMMIT = 'git commit -m ' + `"update my blog at ${new Date().toLocaleString()}"`
const GIT_PULL = 'git pull origin master'
const GIT_PUSH = 'git push -u origin master'
const DEPLOY = 'hexo clean && hexo g && hexo d'

// 功能1：开始编写博客前，与远程仓库的博客源代码进行同步
function start_work () {
    console.log("###############################")
    console.log("step1: 正在从远程仓库同步代码到本地...")
    console.log("###############################")
    exec(GIT_PULL, function(err, stdout, stderr) {
        local_log(err, stdout, stderr)
    })
    console.log("###############################")
    console.log("同步代码结束！")
    console.log("###############################")
}

// 功能2：写完博客后，部署博客
function deploy_website () {
    console.log("###############################")
    console.log("step2: 正在更新博客内容并将其部署到github pages...")
    console.log("###############################")
    exec(DEPLOY, function(err, stdout, stderr) {
        local_log(err, stdout, stderr)
    })
    console.log("###############################")
    console.log("部署结束！")
    console.log("###############################")
}

// 功能3：将本地博客源代码的修改同步到远程仓库
function finish_work () {
    console.log("###############################")
    console.log("step3: 正在将本地源码的更改同步到远程仓库...")
    console.log("###############################")
    cli = GIT_ADD_ALL + ' && ' + GIT_COMMIT + ' && ' + GIT_PUSH
    exec(cli, function(err, stdout, stderr) {
        local_log(err, stdout, stderr)
    })
    console.log("###############################")
    console.log("同步博客源代码更改结束！")
    console.log("###############################")
}


// 功能开始
if (option === 'start' || option === 's') {
    console.log("###############################")
    console.log("step1: 正在从远程仓库同步代码到本地...")
    console.log("###############################")
    exec(GIT_PULL, function(err, stdout) {
        if (err) {
            throw err
        }
        console.log(stdout)

        console.log("###############################")
        console.log("同步代码结束！")
        console.log("###############################")
    })
    // start_work()
} else if (option === 'deploy' || option === 'd') {
    console.log("###############################")
    console.log("step2: 正在更新博客内容并将其部署到github pages...")
    console.log("###############################")
    exec(DEPLOY, function(err, stdout) {
        if (err) {
            throw err
        }
        console.log(stdout)

        console.log("###############################")
        console.log("部署结束！")
        console.log("###############################")
    })
    // deploy_website()
} else if (option === 'finish' || option === 'f') {
    console.log("###############################")
    console.log("step3: 正在将本地源码的更改同步到远程仓库...")
    console.log("###############################")
    cli = GIT_ADD_ALL + ' && ' + GIT_COMMIT + ' && ' + GIT_PUSH
    exec(cli, function(err, stdout) {
        if (err) {
            throw err
        }
        console.log(stdout)

        console.log("###############################")
        console.log("step3: 正在将本地源码的更改同步到远程仓库...")
        console.log("###############################")
    })
    // finish_work()
} else {
    console.log("###############################")
    console.log("ERR: 参数错误")
    console.log("###############################")
}