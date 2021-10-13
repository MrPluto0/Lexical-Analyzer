## 词法分析器实验报告

### 开发环境

#### *选择 JS的理由*

1. Node.Js可以模拟后台运行环境，具备后端语言的部分特征。
2. JS包含丰富的数组，字符串，对象处理库，ECMAScript新标准中为其增加了面向对象语法的特征。
3. JS具备**字典对象**，可将Token制作为字典，便于查寻。
4. 虽然JS效率相比C等较低，但是本项目看重的是对状态机的实现，且个人对于JS的使用，相比C++与C等更加得心应手，因此选择JavaScript来完成本项目。

另外，运行时可在**node环境**下执行**main.js**文件，或在网页文件中引入main.js来运行（不推荐）。

**操作系统**：Windows10

**编译器**：VsCode

**Node版本**：v14.15.4

### 系统设计

#### 整体思路

1. 缓存整个文件内容，存储为字符串（基于Node的读取文件方法，另外一种方法为流模式，按行读取文件内容）。

2. 遍历字符串，进行状态转移

   （1）完成标识符识别后，对下一个字符进行预处理，判断进入的第一个状态。

   （2）接下来根据状态转移表进行状态转移。

   （3）进行当前标识符的结束处理，并存储当前标识符的相关信息（行，列，值，类型，错误）。

3. 输出已完成标识符的数组，并在输出过程进行数据处理，最后输出数据统计信息。

#### 细节实现

从整体思路来看，并不涉及什么算法，但是该项目重点在于各类符号的表示，状态机的实现。

##### 全局静态变量

基于JS的对象字典，可以将所有需要用到的符号整理成字典，与状态机的执行过程相互独立，具备很好的可扩展性。

除了符号表中的所有内容表示在Token外，还定义了其它静态量：

1. JumpChar表示直接跳过的符号，不算入符号表中。
2. SingleChar表示长度为1的符号，碰到这些符号，直接计入符号表，即读取新的字符，重新启动状态机。
3. DoubleChar表示长度可能为1或2的符号，即长度为1时，可能可以与下一个字符搭配形成新的符号。
4. StateTransition表示每次启动自动机读取的第一个字符，根据可获取的下一个转移状态，通常将SingleChar与DoubleChar写入其中。

```js
// 使用计算属性，否则直接以数据作为属性名无法通过Node编译
const StateTransition = {
    [DoubleChar]: 7,
    [SingleChar]: 8,
    '/': 9,
    '"': 13,
    '\'': 16,
}
```

##### 状态机

本状态机看起来属于NFA，实际上在每个输入字符后，所达到的下一个状态的确定的，因此属于DFA。（具体状态图见状态转移表）

图中共包含18种状态，其中0状态为状态机的启动状态，>=99状态为状态码State>=99时进入的终止状态，下面需要额外说明终止状态。

---

终止状态一般为state==99时，即可结束，然而为了错误处理，增加了一些其它的终止状态。

说明：这些终止状态为>=100的state，一般出错的state为0~17，但是要进入终止状态必须>=99，为了存储出错的状态即在其基础上+100，如0状态出错，那么state=0+100，既可以终止，又可以知道出错状态为0；

另外，终止后，需要对一些状态进行处理：

1. 下一个字符导致终止状态后，该符号要么加入当前word中，要么不加入，此使需要flag来判断
2. 下一个字符如果直接跳过，则state=0，此时终止后字符不能加入word中
3. 转换下一个字符前需要index++（不处理好容易导致死循环）
4. 由于本项目是整块读取文件，因此需要通过\n来计算行数，所以要注意index++的位置，使得它不被统计两次

##### 模块划分

分为三个模块：

1. lexical.js词法模块，用来存储符号表，另外定义一些处理符号表和状态的函数，如根据符号（string）获取其TokenType；根据符号第一个字符确定其初始状态。
2. anlyzer.js分析模块，定义一个类Analyzer，执行从文件取字符，挨个分析字符，进行状态转移过程。
3. utils.js模块，定义一些工具类，比如判断是否为数字，是否为字母等。

#### 符号表

##### 标识符

Id：状态从1开始，标识符识别结束后与KeyWords数组值比对，可转换为关键字

##### 关键字

KeyWords：C语言自带的关键字，此处仅列举28个，不为全部。

```js
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
```

##### 操作符

Operations：进行算术运算，比较，赋值等操作。此处仅列举20个，不为全部。

```js
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
```

##### 其它单一符号

```js
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
    Point: ".",
    Question: "?",
```

#### 输出说明

输出主要分为两个部分：

1. 输出检测到的每一个符号的自身信息。

   未出错格式：

   $Relative FilePath:Row:Col --- Value --- TokenType：TokenType$

   出错格式:

   $RelativeFilePath:Row:Col [Wrong Infomation]$

2. 输出统计信息，包括行数，字符数，各个符号出现的名称及数量。

   例如：

   ```js
   Statistic:
   The file ./samples/test1.c has 16 lines and 240 chars in total.
   {
     Id: [ 'main', 'a', 'b', 'printf' ],
     IdTotal: 4,
     Op: { Equal: 4, Less: 1, AssignAdd: 1, AndAnd: 1, AssignSub: 1 },
     KeyWord: { Int: 2, While: 1, If: 1, Return: 1 },
     Annotation: 2,
     LeftParen: 5,
     RightParen: 5,
     LeftBrace: 3,
     Number: 6,
     Comma: 1,
     Semicolon: 5,
     String: 1,
     RightBrace: 3
   }
   ```

### 状态转移表

<img src=".\state.png" alt="state" style="zoom:150%;" />

### 错误处理

#### 错误类型

此程序中仅处理五类错误，更多错误在语法分析中产生。

1. 未知字符错误

   [Unexpected character]

   在遇到@，%等未知符号时产生此错误

2. 指数后错误字符

   [Unexpected character after Exponent.]

   在指数E或e后没有数字时报错

3. 不完整注释

   [Uncomplete annotation.]

   注释没有结束符号

4. 不完整字符串

   [Uncomplete String.]

   字符串没有结束符号

5. 错误字符（不完整字符）

   [Wrong Char]

   例如：'aasd 或 'www

#### 处理方法

若采取恐慌模式，会在一定程度上减少所能检测到的字符。

因此，本程序采取的方法为：当发生错误时，存储当前结果；再次从零状态检测下一个字符。

本方法多针对由于失误，多打了一些不合理的符号等。

### 测试用例

本项目有四个测试用例，均包含在samples文件夹内。

其中test4.c中写了几种错误，部分输入如下：

```js
以下为指数错误
./samples/test4.c:5:16 [Unexpected character after Exponent.]
./samples/test4.c:6:3 --- int --- TokenType:{"KeyWord":"Int"}
./samples/test4.c:6:8 --- n --- TokenType:"Id"
./samples/test4.c:6:10 --- , --- TokenType:"Comma"
./samples/test4.c:6:12 --- min --- TokenType:"Id"
./samples/test4.c:6:16 --- ; --- TokenType:"Semicolon"

以下为不完整注释
./samples/test4.c:28:3 --- return --- TokenType:{"KeyWord":"Return"}
./samples/test4.c:28:11 --- 0 --- TokenType:"Number"
./samples/test4.c:28:13 --- ; --- TokenType:"Semicolon"
./samples/test4.c:29:3 [Uncomplete annotation.]

以下为统计信息
Statistic:
The file ./samples/test4.c has 31 lines and 575 chars in total.
{
  Id: [
    'include', 'stdio',   'h',
    'stdlib',  'string',  'main',
    'a',       'n',       'min',
    'scanf',   's',       'm',
    'str',     'getchar', 'i',
    'gets',    'strlen',  'j',
    'strcmp',  'printf'
  ],
  IdTotal: 20,
  Op: {
    Less: 3,
    Greater: 4,
    Equal: 11,
    And: 1,
    Mul: 2,
    LessEqual: 4,
    SelfAdd: 4,
    NotEqual: 1,
    Add: 6,
    Sub: 2
  },
  KeyWord: { Float: 1, Int: 6, Char: 2, For: 4, If: 2, Return: 1 },
  Point: 3,
  LeftParen: 13,
  RightParen: 13,
  LeftBrace: 4,
  Comma: 5,
  Semicolon: 22,
  String: 2,
  LeftBracket: 14,
  RightBracket: 14,
  Number: 16,
  RightBrace: 3,
  Annotation: 1
}
```

