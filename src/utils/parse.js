let ast = {
    HashTable: {},
    entry: "",
    exitStep: [],
    vars: {},
};

let curStep = "";
let curLine = 1;

export function parse(code) {
    curStep = "";
    curLine = 1;
    ast = {
        HashTable: {},
        entry: "",
        exitStep: [],
        vars: {},
    };
    if (typeof code != "string") {
        throw new TypeError("Expected code to be a string");
    }
    const lineList = code.split("\n");
    for (let i = 0; i < lineList.length; i++) {
        const line = lineList[i].trim();
        if (line.length == 0) {
            continue;
        }
        if (line.startsWith("#")) {
            continue;
        }
        parseLine(line);
        curLine++;
    }
    validate();
    return ast;
}

function parseLine(line) {
    const strings = line.match(/"([^\\"\n]|\\.)*"/g)
        ? line.match(/"([^\\"\n]|\\.)*"/g)
        : [];
    for (let i = 0; i < strings.length; i++) {
        const str = strings[i];
        const stringNoQuotes = str.substring(1, str.length - 1);
        strings[i] = stringNoQuotes;
    }
    line = line.replace(/"([^\\"\n]|\\.)*"/g, "string");
    const tokens = line.split(" ");
    parseToken(tokens, strings);
}

function parseToken(tokens, strings) {
    const type = tokens[0].toLowerCase();
    const args = tokens.slice(1).join(" ");
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
        case "exit":
            processExit();
            break;
        default:
            throw new Error(
                "Expected step, speak, listen, branch, silence, default, or exit. At Line: " +
                    curLine.toString()
            );
    }
}

function processStep(args) {
    const stepIds = args.split(" ");
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
    const stepId = stepIds[0];
    ast.HashTable[stepId] = {
        line: curLine,
    };
    if (Object.keys(ast.HashTable).length == 1) {
        ast.entry = stepId;
    }
    curStep = stepId;
}

function processSpeak(args, strings) {
    args = args.replace(/\+/g, " ");
    const texts = args.split(" ");
    let stringCount = 0;
    ast.HashTable[curStep]["speak"] = [];
    for (let text of texts) {
        text = text.trim();
        if (text == "string") {
            text = strings[stringCount++];
            ast.HashTable[curStep]["speak"].push({
                type: "string",
                args: text,
                line: curLine,
            });
        } else if (text.startsWith("$")) {
            ast.HashTable[curStep]["speak"].push({
                type: "var",
                args: text,
                line: curLine,
            });
            ast.vars[text] = "";
        } else if (text.startsWith("#")) {
            break;
        } else if (text.length > 0) {
            throw new Error(
                "Expected string or variable. At Line: " + curLine.toString()
            );
        }
    }
}

function processListen(args) {
    const time = parseInt(args);
    if (isNaN(time)) {
        throw new Error(
            "Expected time to be a number. At Line: " + curLine.toString()
        );
    }
    ast.HashTable[curStep]["listen"] = { time: time, line: curLine };
}

function processBranch(args, strings) {
    const texts = args.split(",");
    if (texts.length == 0) {
        throw new Error(
            "Expected branch to have at least one text. At Line: " +
                curLine.toString()
        );
    } else if (texts.length > 2) {
        throw new Error(
            "Expected branch to have only two args. At Line: " +
                curLine.toString()
        );
    }
    if (!texts[0] == "string") {
        throw new Error(
            "Expected branch to have an answer string. At Line: " +
                curLine.toString()
        );
    }
    // if branch in ast.HashTable[curStep] key
    if (ast.HashTable[curStep]["branch"]) {
        ast.HashTable[curStep]["branch"].push({
            answer: strings[0].trim(),
            nextStepId: texts[1].trim(),
            line: curLine,
        });
    } else {
        ast.HashTable[curStep]["branch"] = [
            {
                answer: strings[0].trim(),
                nextStepId: texts[1].trim(),
                line: curLine,
            },
        ];
    }
}

function processSilence(args) {
    if (args.split(" ").length > 1) {
        throw new Error(
            "Expected silence to have only one step. At Line: " +
                curLine.toString()
        );
    }
    ast.HashTable[curStep]["silence"] = { args: args, line: curLine };
}

function processDefault(args) {
    if (args.split(" ").length > 1) {
        throw new Error(
            "Expected default to have only one step. At Line: " +
                curLine.toString()
        );
    }
    ast.HashTable[curStep]["default"] = { args: args, line: curLine };
}

function processExit() {
    ast.exitStep.push(curStep);
}

function validate() {
    if (Object.keys(ast.HashTable).length == 0) {
        throw new Error("Expected at least one step");
    }
    if (ast.entry == undefined) {
        throw new Error("Expected entry step");
    }
    if (ast.exitStep.length == 0) {
        throw new Error("Expected at least one exit step");
    }
    for (let stepId of Object.keys(ast.HashTable)) {
        const step = ast.HashTable[stepId];
        if (!Object.keys(step).includes("default")) {
            if (!ast.exitStep.includes(stepId)) {
                throw new Error(
                    "Expected default step. At Line: " + step.line.toString()
                );
            }
        } else {
            if (!Object.keys(ast.HashTable).includes(step.default.args)) {
                throw new Error(
                    "Default step " +
                        step.default.args +
                        " is invalid. At Line: " +
                        step.default.line.toString()
                );
            }
        }
        if (Object.keys(step).includes("silence")) {
            if (!Object.keys(ast.HashTable).includes(step.silence.args)) {
                throw new Error(
                    "Silence step " +
                        step.silence.args +
                        " is invalid. At Line: " +
                        step.silence.line.toString()
                );
            }
        }
        if (Object.keys(step).includes("listen")) {
            if (step.listen.time <= 0) {
                throw new Error(
                    "Listen time is invalid. At Line: " +
                        step.listen.line.toString()
                );
            }
        }
        if (Object.keys(step).includes("branch")) {
            for (let branch of step.branch) {
                if (!Object.keys(ast.HashTable).includes(branch.nextStepId)) {
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
