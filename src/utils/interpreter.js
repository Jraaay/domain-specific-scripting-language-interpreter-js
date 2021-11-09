export function getVars(ast) {
    return ast.vars;
}

export function initEnv(ast, vars) {
    return {
        curStep: ast.entry,
        vars: vars,
    };
}

export function interpret(
    ast,
    env,
    answerFromUser,
    entry = false,
    silence = false
) {
    if (entry) {
        let text = "";
        for (let i of ast.HashTable[env.curStep].speak) {
            if (i.type === "string") {
                text += i.args;
            } else if (i.type === "var") {
                text += env.vars[i.args];
            }
        }
        return {
            text: text,
            end: ast.exitStep.includes(env.curStep),
            silence: ast.HashTable[env.curStep].silence.args ? ast.HashTable[env.curStep].silence.args : 0,
        };
    } else if (silence) {
        if (ast.HashTable[env.curStep].silence) {
            env.curStep = ast.HashTable[env.curStep].silence;
        } else if (ast.HashTable[env.curStep].default) {
            env.curStep = ast.HashTable[env.curStep].default;
        } else {
            throw new Error("No silence step or default step");
        }
    } else {
        let flag = false;
        if (ast.HashTable[env.curStep].branch) {
            for (let i of ast.HashTable[env.curStep].branch) {
                if (answerFromUser.includes(i.answer)) {
                    env.curStep = i.nextStepId;
                    flag = true;
                    break;
                }
            }
        }
        if (!flag) {
            if (ast.HashTable[env.curStep].default) {
                env.curStep = ast.HashTable[env.curStep].default.args;
            } else {
                throw new Error("No default step");
            }
        }
    }
    let text = "";
    for (let i of ast.HashTable[env.curStep].speak) {
        if (i.type === "string") {
            text += i.args;
        } else if (i.type === "var") {
            text += env.vars[i.args];
        }
    }
    return {
        text: text,
        end: ast.exitStep.includes(env.curStep),
        silence: ast.HashTable[env.curStep].silence.args ? ast.HashTable[env.curStep].silence.args : 0,
    };
}
