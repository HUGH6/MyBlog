// 工具脚本
// 作者：huzihan

let option = process.argv[2]


// 命令行
const GIT_STATUS = 'git status'
const GIT_ADD_ALL = 'git add *'
const GIT_COMMIT = 'git commit -m ' + `"update my blog at ${new Date().toLocaleString()}"`
const GIT_PULL = 'git pull origin master'
const GIT_PUSH = 'git push -u origin master'
const GENERATE = 'hexo clean && hexo g && hexo d'
const UPDATE = 'hexo g && hexo d'




// 功能开始
// 功能1：开始编写博客前，与远程仓库的博客源代码进行同步
if (option === 'start' || option === 's') {
    console.log("###############################")
    console.log("step1: 正在从远程仓库同步代码到本地...")
    console.log("###############################")
    let exec = require('child_process').exec
	
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
// 功能2：写完博客后，部署博客
} else if (option === 'generate' || option === 'g') {
    console.log("###############################")
    console.log("step2: 正在重新生成博客内容并将其部署到github pages...")
    console.log("###############################")
    let exec = require('child_process').exec
	
    exec(GENERATE, function(err, stdout) {
        if (err) {
            throw err
        }
        console.log(stdout)
        
        console.log("###############################")
        console.log("部署结束！")
        console.log("###############################")
    })
    // deploy_website()
// 功能3：将本地博客源代码的修改同步到远程仓库
} else if (option === 'finish' || option === 'f') {
    console.log("###############################")
    console.log("step3: 正在将本地源码的更改同步到远程仓库...")
    console.log("###############################")
    let exec = require('child_process').exec
	
    cli = GIT_ADD_ALL + ' && ' + GIT_COMMIT + ' && ' + GIT_PUSH
    exec(cli, function(err, stdout) {
        if (err) {
            throw err
        }
        console.log(stdout)

        console.log("###############################")
        console.log("同步本地博源代码到远程仓库完成！")
        console.log("###############################")
    })
    // finish_work()
// 功能4：不执行clean操作，直接执行hexo g && hexo d，提高速度
} else if (option === 'update' || option === 'u') {
    console.log("###############################")
    console.log("step2: 正在更新博客内容并将其部署到github pages...")
    console.log("###############################")
    let exec = require('child_process').exec
	
    exec(UPDATE, function(err, stdout) {
        if (err) {
            throw err
        }
        console.log(stdout)
        
        console.log("###############################")
        console.log("更新结束！")
        console.log("###############################")
    })
    // finish_work()
// 操作失败，退出
} else if (option === "help" || option === "h") {
	console.log("###############################")
    console.log("参数说明：")
	console.log("start或s        可以在更改博客内容前运行，用于从远程仓库同步代码到本地，用于在意外更改本地源码无法回退时，恢复代码使用；")
	console.log("generate或g     相当于执行'hexo clear && hexo g && hexo d'")
	console.log("update或u       相当于执行'hexo g && hexo d',与g参数的区别在于不clean原有文件，速度快，但可能文件更新不全；")
	console.log("finish或f       在完成博客更新后执行，将本地所以的源代码改动同步到远程仓库；")
	console.log("help或h         获取命令行的参数说明")
    console.log("###############################")
}
 else {
    console.log("###############################")
    console.log("ERR: 参数错误")
	console.log("您可以尝试运行'npm run hello help' 或 'npm run hello h'获取命令行参数说明。")
    console.log("###############################")
}