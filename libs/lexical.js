// TOKEN的类型
const TOKEN = {
    Id: 1,
    Number: 2,
    Op: {
        Not: "!",
        Add: "+",
        Sub: "-",
        Mul: "*",
        Div: "/",
        Equal: "=",
        NotEqual: "!=",
        AssignAdd: "+=",
        AssignSub: "-=",
        SelfAdd: "++",
        SeldSub: "--",
        Less: "<",
        LessEqual: "<=",
        Greater: ">",
        GreaterEqual: ">=",
        And: "&",
        AndAnd: "&&",
        Or: "|",
        OrOr: "||",
        Eor: "^",
        // AssignMul
        // AssignDiv
    },
    KeyWord: [
        "Auto",
        "Goto",
        "Define",
        "For",
        "While",
        "Do",
        "Switch",
        "Case",
        "Default",
        "Continue",
        "Break",
        "Return",
        "If",
        "Else",
        "Unsigned",
        "Signed",
        "Static",
        "Extern",
        "Const",
        "Int",
        "Long",
        "Char",
        "Float",
        "Double",
        "Struct",
        "Typedef",
        "Void",
        "Enum",
    ],
    LeftParen: "(",
    RightParen: ")",
    LeftBracket: "[",
    RightBracket: "]",
    LeftBrace: "{",
    RightBrace: "}",
    Semicolon: ";",
    SingleQuotation: "'",
    DoubleQuotation: "\"",
    Comma: ",",
    Colon: ":",
    Question: "?",
    Point: ".",
    Others: 99,
};

const JumpChar = [" ","\r", "\n", "\t", "#"];
const DoubleChar = ['<', '>', '=', '!', '+', '-', '&', '|', '.']
const SingleChar = ['*', '(', ')', '[', ']', '{', '}', ',', ';', '^']

// 使用计算属性，否则直接以数据作为属性名无法通过Node编译
const StateTransition = {
    [DoubleChar]: 7,
    [SingleChar]: 8,
    '/': 9,
    '"': 13,
    '\'': 16,
}


// 自定义枚举
// (function () {
//     let i = 1;
//     for (let key in TOKEN) {
//         if (typeof TOKEN[key] == "object") {
//             for (let subKey in TOKEN[key]) {
//                 TOKEN[key][subKey] = i++;
//             }
//         } else {
//             TOKEN[key] = i++;
//         }
//     }
//     // console.log(TOKEN);
//     // 冻结该对象
//     Object.freeze(TOKEN);
// })();


// 判断Id是否是关键字
var judgeKeyword = function (word) {
    var kw = word.replace(word[0], word[0].toUpperCase());
    if (TOKEN.KeyWord.indexOf(kw) != -1)
        return { "KeyWord": kw };
    else
        return "Id";
}

var judgeTokenType = function (token) {
    var tokenType = "";
    for (let field in TOKEN) {
        if (field == "Op") {
            for (let op in TOKEN[field]) {
                if (TOKEN[field][op] == token)
                    return { "Op": op };
            }
        } else if (typeof TOKEN[field] == "string") {
            if (TOKEN[field] == token)
                return field;
        }
    }
    return tokenType;
}


var judgeError = function (state) {
    let error = "";

    if (state == 0)
        error = "[Unexpected character]";
    else if (state == 4)
        error = "[Unexpected character after Exponent.]";
    else if (state == 5)
        error = "[Unexpected character after Exponent.]";
    else if (state >= 9 && state <= 12)
        error = "[Uncomplete annotation.]";
    else if (state >= 13 && state <= 15)
        error = "[Uncomplete String.]";
    else if (state >= 16 && state <= 18)
        error = "[Wrong Char]";

    return error;
}

export default {
    TOKEN,
    JumpChar,
    StateTransition,
    judgeKeyword,
    judgeTokenType,
    judgeError,
};
