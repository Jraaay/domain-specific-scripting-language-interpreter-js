import { AST, VARS, ENV, ANSWER } from "./interface";

/**
 * 用于获取语法树需要的变量
 * @param ast 语法树
 * @returns 变量名和变量值
 */
export function getVars(ast: AST): VARS {
    return ast.vars;
}

/**
 *
 * @param ast 语法树
 * @param vars 变量名和变量值
 * @returns 返回初始步骤和变量表
 */
export function initEnv(ast: AST, vars: VARS): ENV {
    return {
        curStep: ast.entry,
        vars: vars,
    };
}

/**
 * 用于执行脚本
 * @param ast 语法树
 * @param env 运行环境
 * @param answerFromUser 用户的回答
 * @param entry 入口
 * @param silence 是否安静
 * @returns 返回回应
 */
export function interpret(
    ast: AST,
    env: ENV,
    answerFromUser: string,
    entry = false,
    silence = false
): ANSWER {
    if (entry) {
        let text = "";
        const speak = ast.HashTable[env.curStep].speak;
        if (speak) {
            for (const i of speak) {
                if (i.type === "string") {
                    text += i.args;
                } else if (i.type === "var") {
                    text += env.vars[i.args];
                } else {
                    throw new Error("Speak args type error");
                }
            }
        }
        const listen = ast.HashTable[env.curStep].listen;
        if (listen) {
            return {
                text: text,
                end: ast.exitStep.includes(env.curStep),
                listen: listen.time,
            };
        } else {
            return {
                text: text,
                end: ast.exitStep.includes(env.curStep),
                listen: 0,
            };
        }
    } else if (silence) {
        const silenceList = ast.HashTable[env.curStep].silence;
        const defaultList = ast.HashTable[env.curStep].default;
        if (silenceList) {
            env.curStep = silenceList.args;
        } else if (defaultList) {
            env.curStep = defaultList.args;
        } else {
            throw new Error("No silence step or default step");
        }
    } else {
        let flag = false;
        const branch = ast.HashTable[env.curStep].branch;
        if (branch) {
            for (const i of branch) {
                if (answerFromUser.includes(i.answer)) {
                    env.curStep = i.nextStepId;
                    flag = true;
                    break;
                }
            }
        }
        if (!flag) {
            const defaultList = ast.HashTable[env.curStep].default;
            if (defaultList) {
                env.curStep = defaultList.args;
            } else {
                throw new Error("No default step");
            }
        }
    }
    let text = "";
    const speak = ast.HashTable[env.curStep].speak;
    if (speak) {
        for (const i of speak) {
            if (i.type === "string") {
                text += i.args;
            } else if (i.type === "var") {
                text += env.vars[i.args];
            } else {
                throw new Error("Speak args type error");
            }
        }
    }
    const listen = ast.HashTable[env.curStep].listen;
    if (listen) {
        return {
            text: text,
            end: ast.exitStep.includes(env.curStep),
            listen: listen.time,
        };
    } else {
        return {
            text: text,
            end: ast.exitStep.includes(env.curStep),
            listen: 0,
        };
    }
}
