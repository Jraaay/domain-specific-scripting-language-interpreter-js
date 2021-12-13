import { AST, SPEAK } from "./interface";

/**
 * @desc 语法分析树
 * @param HashTable - 哈希表，存储 stepId 对应的 Step
 * @param entry 入口 stepId
 * @param exitStep 应退出聊天的 stepId 数组
 * @param vars 变量表，存储变量名和变量值
 */
let ast: AST;

let curStep = "";
let curLine = 1;

/**
 * @desc 分析 code 为语法树
 * @param code 需要解析的代码
 * @returns 语法分析树
 */
export function parse(code: string): AST {
    curStep = "";
    curLine = 1;

    // 初始化 ast
    ast = {
        HashTable: {},
        entry: "",
        exitStep: [],
        vars: {},
    };

    // 如果输入不是字符串，则抛出异常
    if (typeof code != "string") {
        throw new TypeError("Expected code to be a string");
    }

    // 将代码按行分割
    const lineList = code.split("\n");

    // 对于每一行，去除空格，忽略注释，并对每一行解析
    for (let i = 0; i < lineList.length; i++) {
        // 去除空格
        const line = lineList[i].trim();

        // 忽略空行
        if (line.length == 0) {
            continue;
        }

        // 忽略注释
        if (line.startsWith("#")) {
            continue;
        }

        // 解析每一行
        parseLine(line);
        curLine++;
    }

    // 验证语法树
    validate();
    return ast;
}

/**
 * 用于解析每一行
 * @param line
 */
function parseLine(line: string) {
    // 获取这一行中的字符串，便于后面处理
    const strings: string[] = line.match(/"([^\\"\n]|\\.)*"/g)
        ? (line.match(/"([^\\"\n]|\\.)*"/g) as string[])
        : [];

    // 将这一行中的所有字符串提取出来
    for (let i = 0; i < strings.length; i++) {
        const str = strings[i];
        const stringNoQuotes = str.substring(1, str.length - 1);
        strings[i] = stringNoQuotes;
    }

    // 将这一行中的所有字符串替换为占位符
    line = line.replace(/"([^\\"\n]|\\.)*"/g, "string");

    // 根据空格分割
    const tokens = line.split(" ");

    // 解析 token
    parseToken(tokens, strings);
}

/**
 * 用于解析这一行中的 token
 * @param tokens 这一行中的所有 token
 * @param strings 这一行中所有的字符串
 */
function parseToken(tokens: string[], strings: string[]) {
    //获取 token 的类型
    const type = tokens[0].toLowerCase();

    // 获取 token 的参数
    const args = tokens.slice(1).join(" ");

    // 对于不同的 token 类型，调用不同的函数
    switch (type) {
        case "step":
            processStep(args);
            break;
        case "speak":
            processSpeak(args, strings);
            break;
        case "listen":
            processListen(args);
            break;
        case "branch":
            processBranch(args, strings);
            break;
        case "silence":
            processSilence(args);
            break;
        case "default":
            processDefault(args);
            break;
        case "culculate":
            processCulculate(args);
            break;
        case "exit":
            processExit();
            break;
        default:
            // 如果不是以上的 token 类型，则抛出异常
            throw new Error(
                "Expected step, speak, listen, branch, silence, default, or exit. At Line: " +
                    curLine.toString()
            );
    }
}

/**
 * 处理 step 类型的 token
 * @param args token 的参数
 */
function processStep(args: string) {
    // 将参数按照空格分割
    const stepIds = args.split(" ");

    // 如果参数不是一个 stepId，则抛出异常
    if (stepIds.length == 0 || stepIds[0].length == 0) {
        throw new Error(
            "Expected step to have one step id. At Line: " + curLine.toString()
        );
    } else if (stepIds.length > 1) {
        throw new Error(
            "Expected step to have only one step id. At Line: " +
                curLine.toString()
        );
    }

    // 将 stepId 存入 ast
    const stepId = stepIds[0];

    // 设置 step 的行号
    ast.HashTable[stepId] = {
        line: curLine,
    };

    // 如果这是第一个 step，则设置为 entry
    if (Object.keys(ast.HashTable).length == 1) {
        ast.entry = stepId;
    }

    // 设置当前解析的步骤
    curStep = stepId;
}

/**
 * 处理 speak 类型的 token
 * @param args token 的参数
 * @param strings 这一行中所有的字符串
 */
function processSpeak(args: string, strings: string[]) {
    // 将加号替换为空格
    args = args.replace(/\+/g, " ");

    // 将参数按照空格分割
    const texts = args.split(" ");
    let stringCount = 0;

    // 初始化该 step 的 speak 列表
    const speak: SPEAK[] = [];

    // 处理 speak 的每一个部分
    for (let text of texts) {
        // 去除前后的空格
        text = text.trim();

        // 如果是字符串，则将原字符串添加到 speak 列表中
        if (text == "string") {
            text = strings[stringCount++];
            speak.push({
                type: "string",
                args: text,
                line: curLine,
            });
        } else if (text.startsWith("$")) {
            // 如果是变量，则将变量添加到 speak 列表中，并将变量添加到变量列表中
            speak.push({
                type: "var",
                args: text,
                line: curLine,
            });
            ast.vars[text] = "";
        } else if (text.startsWith("#")) {
            // 如果是注释则忽略后面的内容
            break;
        } else if (text.length > 0) {
            // 如果是其他内容，则抛出异常
            throw new Error(
                "Expected string or variable. At Line: " + curLine.toString()
            );
        }
    }
    ast.HashTable[curStep].speak = speak;
}

/**
 * 处理 listen 类型的 token
 * @param args token 的参数
 */
function processListen(args: string) {
    // 将参数转换为时间数字
    const time = parseInt(args);

    // 如果参数不是一个数字，则抛出异常
    if (isNaN(time)) {
        throw new Error(
            "Expected time to be a number. At Line: " + curLine.toString()
        );
    }

    // 将 time 添加到该 step 的 listen 列表中
    ast.HashTable[curStep].listen = { time: time, line: curLine };
}

/**
 * 处理 branch 类型的 token
 * @param args token 的参数
 * @param strings 这一行中所有的字符串
 */
function processBranch(args: string, strings: string[]) {
    // 按照逗号分割参数
    const texts = args.split(",");

    // 如果参数不是两个，则抛出异常
    if (texts.length != 2) {
        throw new Error(
            "Expected branch to have two args. At Line: " + curLine.toString()
        );
    }

    // 如果第一个参数不是字符串，则抛出异常
    if (!(texts[0] == "string")) {
        throw new Error(
            "Expected branch to have an answer string. At Line: " +
                curLine.toString()
        );
    }

    // 将第二个参数 stepId 加入到 branch 列表中
    const branch = ast.HashTable[curStep].branch;
    if (branch) {
        branch.push({
            answer: strings[0].trim(),
            nextStepId: texts[1].trim(),
            line: curLine,
        });
    } else {
        ast.HashTable[curStep].branch = [
            {
                answer: strings[0].trim(),
                nextStepId: texts[1].trim(),
                line: curLine,
            },
        ];
    }
}

/**
 * 处理 silence 类型的 token
 * @param args token 的参数
 */
function processSilence(args: string) {
    // 如果参数个数不是 1，则抛出异常
    if (args.split(" ").length != 1) {
        throw new Error(
            "Expected silence to have one step. At Line: " + curLine.toString()
        );
    }
    // 将 stepId 加入到 silence 列表中
    ast.HashTable[curStep].silence = { args: args, line: curLine };
}

/**
 * 处理 default 类型的 token
 * @param args token 的参数
 */
function processDefault(args: string) {
    // 如果参数个数不是 1，则抛出异常
    if (args.split(" ").length != 1) {
        throw new Error(
            "Expected default to have one step. At Line: " + curLine.toString()
        );
    }
    // 将 stepId 加入到 default 列表中
    ast.HashTable[curStep].default = { args: args, line: curLine };
}

/**
 *
 */
function processCulculate(args: string) {
    args = args.replace(/#.*$/, "");
    ast.HashTable[curStep].culculate = [
        args.split(",")[0].trim(),
        args.split(",")[1].trim(),
        args.split(",")[2].trim(),
    ];
}

/**
 * 处理 exit 类型的 token
 */
function processExit() {
    // 将 stepId 加入到 exit 列表中
    ast.exitStep.push(curStep);
}

/**
 * 验证 ast 语法树的正确性
 */
export function validate(astToValidate: AST = ast): void {
    // 如果脚本树为空，则抛出异常
    if (Object.keys(astToValidate.HashTable).length == 0) {
        throw new Error("Expected at least one step");
    }

    // 如果脚本树中 exit 列表的数量为0，则抛出异常
    if (astToValidate.exitStep.length == 0) {
        throw new Error("Expected at least one exit step");
    }
    // 遍历脚本树中的每一个 step
    for (const stepId of Object.keys(astToValidate.HashTable)) {
        const step = astToValidate.HashTable[stepId];

        // 如果 step 中的 default 列表为空，而且不是 exit step，则抛出异常
        const defaultList = step.default;
        if (!defaultList) {
            if (!astToValidate.exitStep.includes(stepId)) {
                const line = step.line;
                if (line) {
                    throw new Error(
                        "Expected default step. At Line: " + line.toString()
                    );
                } else {
                    throw new Error("Expected default step.");
                }
            }
        } else {
            // 如果 default 列表中的 step 不存在，则抛出异常
            if (
                !Object.keys(astToValidate.HashTable).includes(defaultList.args)
            ) {
                throw new Error(
                    "Default step " +
                        defaultList.args +
                        " is invalid. At Line: " +
                        defaultList.line.toString()
                );
            }
        }

        // 如果存在 silence 列表，则验证 silence 列表中的 step 是否存在
        const silenceList = step.silence;
        if (silenceList) {
            if (
                !Object.keys(astToValidate.HashTable).includes(silenceList.args)
            ) {
                throw new Error(
                    "Silence step " +
                        silenceList.args +
                        " is invalid. At Line: " +
                        silenceList.line.toString()
                );
            }
        }

        // 如果存在 listen，则验证 listen 的时间是否有效
        const listenList = step.listen;
        if (listenList) {
            if (listenList.time <= 0) {
                throw new Error(
                    "Listen time is invalid. At Line: " +
                        listenList.line.toString()
                );
            }
        }

        // 如果存在 branch 列表，则验证 branch 列表中的 step 是否存在
        const branchList = step.branch;
        if (branchList) {
            for (const branch of branchList) {
                if (
                    !Object.keys(astToValidate.HashTable).includes(
                        branch.nextStepId
                    )
                ) {
                    throw new Error(
                        "Branch step " +
                            branch.nextStepId +
                            " is invalid. At Line: " +
                            branch.line.toString()
                    );
                }
            }
        }
    }
}
