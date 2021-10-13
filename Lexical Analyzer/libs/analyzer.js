import lexical from "./lexical.js"
import utils from "../utils/utils.js";

const fs = utils.require("fs");

class Analyzer {
    constructor(filename) {
        // 后面可尝试用流的方式读取文件
        try {
            // 行数
            this.col = 0;
            this.row = 1;

            // 整个文件数据的索引
            this.index = 0;
            this.data = fs.readFileSync(filename, 'utf8');
            this.filename = filename;

            // 结果
            this.result = [];
        } catch (error) {
            console.error("文件不存在");
        }
    }
    analyze() {
        while (this.index < this.data.length) {
            let token = this.nextToken();
            if (token.Value != "" || token.error != "")
                this.result.push(token);
        }
    }
    nextToken() {
        var { data, index } = this;
        var word = "", tokenType = "", row = 1, col = 0, error = "";
        var flag = 0, state = 0, dataLength = data.length;

        // 处理最后一个符号时，tokenType
        while (index < dataLength || (word != "" && tokenType == "")) {

            // 所在行与列
            if (this.data[index] == '\n') {
                this.row++;
                this.col = 0;
            }
            this.col++;

            // 状态机
            switch (state) {
                case 0:
                    row = this.row;
                    col = this.col;
                    state = this.judgeFirstState(this.data[index]);
                    break;
                case 1:
                    if (utils.isLetter(data[index]) || utils.isDigit(data[index]) || data[index] == "_") {
                        tokenType = lexical.judgeKeyword(word + data[index]);
                    } else {
                        tokenType = lexical.judgeKeyword(word);
                        state = 99;
                    }
                    break;
                case 2:
                    tokenType = "Number";
                    if (utils.isDigit(data[index]))
                        state = 2;
                    else if (data[index] == '.')
                        state = 3;
                    else if (data[index].toUpperCase() == 'E')
                        state = 4;
                    else
                        state = 99;
                    break;
                case 3:
                    if (utils.isDigit(data[index]))
                        state = 3;
                    else if (data[index].toUpperCase() == 'E')
                        state = 4;
                    else
                        state = 99;
                    break;
                case 4:
                    if (utils.isDigit(data[index]))
                        state = 6;
                    else if (data[index] == '+' || data[index] == '-')
                        state = 5;
                    else
                        state += 100;
                    break;
                case 5:
                    if (utils.isDigit(data[index]))
                        state = 6;
                    else
                        state += 100;
                    break;
                case 6:
                    if (utils.isDigit(data[index]))
                        state = 6;
                    else
                        state = 99;
                    break;
                case 7:
                    tokenType = lexical.judgeTokenType(data[index - 1] + data[index]);
                    if (tokenType != "")
                        flag = 1;
                    else
                        tokenType = lexical.judgeTokenType(data[index - 1]);
                    state = 99;
                    break;
                case 8:
                    tokenType = lexical.judgeTokenType(data[index - 1]);
                    state = 99;
                    break;
                case 9:
                    tokenType = "Annotation";
                    if (data[index] == '*')
                        state = 11;
                    else if (data[index] == '/')
                        state = 10;
                    else {
                        tokenType = { "Op": "Div" };
                        state = 99;
                    }
                    break;
                case 10:
                    if (data[index] == '\n')
                        state = 99;
                    break;
                case 11:
                    if (data[index] == '*')
                        state = 12;
                    break;
                case 12:
                    flag = data[index] == '/' ? 1 : flag;
                    if (data[index] == '/')
                        state = 99;
                    else if (data[index] == '*')
                        state = 12;
                    else
                        state = 11;
                    break;
                case 13:
                    tokenType = "String";
                    if (data[index] == '\\')
                        state = 15;
                    else if (data[index] == "\"") {
                        flag = 1;
                        state = 99;
                    }
                    else
                        state = 14;
                    break;
                case 14:
                    if (data[index] == '\"') {
                        flag = 1;
                        state = 99;
                    }
                    else if (data[index] == '\\')
                        state = 15;
                    else
                        state = 14;
                    break;
                case 15:
                    state = 14;
                    break;
                case 16:
                    tokenType = "Char";
                    if (data[index] == '\\')
                        state = 18;
                    else
                        state = 17;
                    break;
                case 17:
                    if (data[index] == "\'") {
                        flag = 1;
                        state = 99;
                    }
                    break;
                case 18:
                    state = 17;
                    break;
                default:
                    // console.log("*******************************")
                    // // 检测非法字符
                    // word = "";
                    // state = 0;
                    break;
            }

            // 字符结束态 99 或 >= 100
            if (state >= 99) {
                // 结束时需要赋值
                if (flag == 1) word += data[index++];
                if (state >= 100 || data[index] == '\n') index++;
                break;
            }

            // 合法字符
            if (state != 0)
                word += data[index];

            // 索引自加
            index++;
        }

        state = state >= 100 ? state - 100 : state;
        error = lexical.judgeError(state);
        this.index = index;
        return { "Value": word, "TokenType": tokenType, "Row": row, "Col": col, "Error": error };
    }
    // 根据输入字符判断第一个跳转状态
    judgeFirstState(word) {
        let state = 100;
        if (lexical.JumpChar.indexOf(word) != -1)
            state = 0;
        else if (utils.isLetter(word))
            state = 1;
        else if (utils.isDigit(word))
            state = 2;
        else {
            for (let field in lexical.StateTransition) {
                if (field.indexOf && field.indexOf(word) != -1)
                    state = lexical.StateTransition[field];
                else if (field == word)
                    state = lexical.StateTransition[field];
            }
        }
        return state;
    }
    // 输出每个标识符及统计数据
    printRes() {
        var statistic = {
            Id: [],
            IdTotal: 0,
            Op: {},
            KeyWord: {},
        };

        for (let item of this.result) {
            if (item.Error == "") {
                // 正确
                console.log(`${this.filename}:${item.Row}:${item.Col} --- ${item.Value} --- TokenType:${JSON.stringify(item.TokenType)}`);

                // 统计
                if (typeof item.TokenType === "string") {
                    if (item.TokenType != "Id")
                        statistic[item.TokenType] = statistic[item.TokenType] + 1 || 1;
                    else if (statistic.Id.indexOf(item.Value) == -1) {
                        statistic.Id.push(item.Value);
                        statistic.IdTotal++;
                    }
                }
                else if ("KeyWord" in item.TokenType)
                    statistic.KeyWord[item.TokenType.KeyWord] = statistic.KeyWord[item.TokenType.KeyWord] + 1 || 1;
                else if ("Op" in item.TokenType)
                    statistic.Op[item.TokenType.Op] = statistic.Op[item.TokenType.Op] + 1 || 1;
            }
            else {
                // 错误
                console.log(`${this.filename}:${item.Row}:${item.Col} ${item.Error}`);
            }
        }

        console.log("\nStatistic:");
        console.log(`The file ${this.filename} has ${this.row} lines and ${this.data.length} chars in total.`);
        console.log(statistic);
    }
}

export default Analyzer;