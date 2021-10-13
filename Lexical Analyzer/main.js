import Analyzer from './libs/analyzer.js'
import utils from './utils/utils.js';

// 命令行参数
const args = process.argv;
const analyze = function (filename) {
    var a = new Analyzer(filename);
    a.analyze();
    a.printRes();
};

(function main() {
    if (args[2] == "-f") {
        if (args[3] != "")
            analyze(args[3]);
        else
            console.log("Please input the relative filename");
    } else if (args[2] == "-h") {
        console.log(`node main.js --- args:\n\t-f relative filename;\n\t-h help;`)
    } else {
        // 以下为输入读取
        const readline = utils.require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })

        readline.question(`Input the relative filepath:`, filename => {
            analyze(filename);
            readline.close();
        })
    }
})()

