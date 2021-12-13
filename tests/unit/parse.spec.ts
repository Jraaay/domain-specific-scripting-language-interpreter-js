/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse, validate } from "../../src/utils/parse";

test("Parse default script", () => {
    expect(
        JSON.stringify(
            parse(`Step welcome
            # This is a comment
    Speak $name + "您好，请问有什么可以帮您?" # This is a comment
    Listen 5
    Branch "投诉", complainProc
    Branch "账单", billProc
    Silence silenceProc
    Default defaultProc
Step complainProc
    Speak "您的意见是我们改进工作的动力，请问您还有什么补充?"
    Listen 5
    Default thanks
Step thanks
    Speak "感谢您的来电，再见"
    Exit
Step billProc
    Speak "您的本月账单是" + $amount + "元，感谢您的来电，再见"
    Exit
Step silenceProc
    Speak "听不清，请您大声一点可以吗?"
    Listen 5
    Branch "投诉", complainProc
    Branch "账单", billProc
    Silence silenceProc
    Default defaultProc
Step defaultProc
    Speak "抱歉，我不明白你的意思"
    Branch "投诉", complainProc
    Branch "账单", billProc
    Silence silenceProc
    Default defaultProc`)
        )
    ).toBe(
        '{"HashTable":{"welcome":{"line":1,"speak":[{"type":"var","args":"$name","line":2},{"type":"string","args":"您好，请问有什么可以帮您?","line":2}],"listen":{"time":5,"line":3},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":4},{"answer":"账单","nextStepId":"billProc","line":5}],"silence":{"args":"silenceProc","line":6},"default":{"args":"defaultProc","line":7}},"complainProc":{"line":8,"speak":[{"type":"string","args":"您的意见是我们改进工作的动力，请问您还有什么补充?","line":9}],"listen":{"time":5,"line":10},"default":{"args":"thanks","line":11}},"thanks":{"line":12,"speak":[{"type":"string","args":"感谢您的来电，再见","line":13}]},"billProc":{"line":15,"speak":[{"type":"string","args":"您的本月账单是","line":16},{"type":"var","args":"$amount","line":16},{"type":"string","args":"元，感谢您的来电，再见","line":16}]},"silenceProc":{"line":18,"speak":[{"type":"string","args":"听不清，请您大声一点可以吗?","line":19}],"listen":{"time":5,"line":20},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":21},{"answer":"账单","nextStepId":"billProc","line":22}],"silence":{"args":"silenceProc","line":23},"default":{"args":"defaultProc","line":24}},"defaultProc":{"line":25,"speak":[{"type":"string","args":"抱歉，我不明白你的意思","line":26}],"branch":[{"answer":"投诉","nextStepId":"complainProc","line":27},{"answer":"账单","nextStepId":"billProc","line":28}],"silence":{"args":"silenceProc","line":29},"default":{"args":"defaultProc","line":30}}},"entry":"welcome","exitStep":["thanks","billProc"],"vars":{"$name":"","$amount":""}}'
    );
});

test("Test wrong script: No exit step", () => {
    expect(() => {
        parse("Step welcome");
    }).toThrow("Expected at least one exit step");
});

test("Test wrong script: No step", () => {
    expect(() => {
        parse("");
    }).toThrow("Expected at least one step");
});

test("Test wrong script: Default empty", () => {
    expect(() => {
        parse(`Step welcome
        Step complainProc
        Exit`);
    }).toThrow("Expected default step. At Line: 1");
});

test("Test wrong script: Default step invalid", () => {
    expect(() => {
        parse(`Step welcome
        Default asdfghj
        Step complainProc
        Exit`);
    }).toThrow("Default step asdfghj is invalid. At Line: 2");
});

test("Test wrong script: Silence step invalid", () => {
    expect(() => {
        parse(`Step welcome
        Silence asdfghj
        Default complainProc
        Step complainProc
        Exit`);
    }).toThrow("Silence step asdfghj is invalid. At Line: 2");
});

test("Test wrong script: Listen a NaN", () => {
    expect(() => {
        parse(`Step welcome
        Listen a
        Default complainProc
        Step complainProc
        Exit`);
    }).toThrow("Expected time to be a number. At Line: 2");
});

test("Test wrong script: Listen time < 0 ", () => {
    expect(() => {
        parse(`Step welcome
        Listen -1
        Default complainProc
        Step complainProc
        Exit`);
    }).toThrow("Listen time is invalid. At Line: 2");
});

test("Test wrong script: Branch step invalid", () => {
    expect(() => {
        parse(`Step welcome
        Branch "投诉", asdfghj
        Default complainProc
        Step complainProc
        Exit`);
    }).toThrow("Branch step asdfghj is invalid. At Line: 2");
});

test("Test wrong script: Not string", () => {
    expect(() => {
        parse(null as any);
    }).toThrow("Expected code to be a string");
});

test("Test wrong script: Invalid token type", () => {
    expect(() => {
        parse(`Step welcome
        INVALIDTYPE a
        Default complainProc
        Step complainProc
        Exit`);
    }).toThrow(
        "Expected step, speak, listen, branch, silence, default, or exit. At Line: 2"
    );
});

test("Test wrong script: Invalid Step arg", () => {
    expect(() => {
        parse(`Step`);
    }).toThrow("Expected step to have one step id. At Line: 1");
});

test("Test wrong script: Invalid Step arg - 2 stepId", () => {
    expect(() => {
        parse(`Step 1 2`);
    }).toThrow("Expected step to have only one step id. At Line: 1");
});

test("Test wrong script: Invalid Speak arg - no stepId", () => {
    expect(() => {
        parse(`Step main
               Speak ddd`);
    }).toThrow("Expected string or variable. At Line: 2");
});

test("Test wrong script: Invalid Branch arg - wrong args count", () => {
    expect(() => {
        parse(`Step main
               Branch 1`);
    }).toThrow("Expected branch to have two args. At Line: 2");
});

test("Test wrong script: Invalid Branch arg - not string", () => {
    expect(() => {
        parse(`Step main
               Branch 1, stepid`);
    }).toThrow("Expected branch to have an answer string. At Line: 2");
});

test("Test wrong script: Invalid Silence arg", () => {
    expect(() => {
        parse(`Step main
               Silence 1 2`);
    }).toThrow("Expected silence to have one step. At Line: 2");
});

test("Test wrong script: Invalid Default arg", () => {
    expect(() => {
        parse(`Step main
               Default 1 2`);
    }).toThrow("Expected default to have one step. At Line: 2");
});

const ast = JSON.parse(
    '{"HashTable": {"welcome": {"speak": [{ "type": "var", "args": "$name", "line": 2 },{"type": "string","args": "您好，请问有什么可以帮您?","line": 2}],"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 4 },{ "answer": "账单", "nextStepId": "billProc", "line": 5 }],"silence": { "args": "silenceProc", "line": 6 }},"complainProc": {"line": 8,"speak": [{"type": "string","args": "您的意见是我们改进工作的动力，请问您还有什么补充?","line": 9}],"listen": { "time": 5, "line": 10 },"default": { "args": "thanks", "line": 11 }},"thanks": {"line": 12,"speak": [{ "type": "string", "args": "感谢您的来电，再见", "line": 13 }]},"billProc": {"line": 15,"speak": [{ "type": "string", "args": "您的本月账单是", "line": 16 },{ "type": "var", "args": "$amount", "line": 16 },{"type": "string","args": "元，感谢您的来电，再见","line": 16}]},"silenceProc": {"line": 18,"speak": [{"type": "string","args": "听不清，请您大声一点可以吗?","line": 19}],"listen": { "time": 5, "line": 20 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 21 },{ "answer": "账单", "nextStepId": "billProc", "line": 22 }],"silence": { "args": "silenceProc", "line": 23 },"default": { "args": "defaultProc", "line": 24 }},"defaultProc": {"line": 25,"speak": [{"type": "string","args": "抱歉，我不明白你的意思","line": 26}],"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 27 },{ "answer": "账单", "nextStepId": "billProc", "line": 28 }],"silence": { "args": "silenceProc", "line": 29 },"default": { "args": "defaultProc", "line": 30 }}},"entry": "welcome","exitStep": ["thanks", "billProc"],"vars": { "$name": "", "$amount": "" }}'
);

test("Test wrong ast: no line", () => {
    expect(() => {
        validate(ast);
    }).toThrow("Expected default step.");
});

const ast2 = JSON.parse(
    '{"HashTable": {"welcome": {"line": 1,"speak": [{ "type": "var", "args": "$name", "line": 2 },{"type": "string","args": "您好，请问有什么可以帮您?","line": 2}],"listen": { "time": 5, "line": 3 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 4 },{ "answer": "账单", "nextStepId": "billProc", "line": 5 }],"silence": { "args": "silenceProc", "line": 6 }},"complainProc": {"line": 8,"speak": [{"type": "string","args": "您的意见是我们改进工作的动力，请问您还有什么补充?","line": 9}],"listen": { "time": 5, "line": 10 },"default": { "args": "thanks", "line": 11 }},"thanks": {"line": 12,"speak": [{ "type": "string", "args": "感谢您的来电，再见", "line": 13 }]},"billProc": {"line": 15,"speak": [{ "type": "string", "args": "您的本月账单是", "line": 16 },{ "type": "var", "args": "$amount", "line": 16 },{"type": "string","args": "元，感谢您的来电，再见","line": 16}]},"silenceProc": {"line": 18,"speak": [{"type": "string","args": "听不清，请您大声一点可以吗?","line": 19}],"listen": { "time": 5, "line": 20 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 21 },{ "answer": "账单", "nextStepId": "billProc", "line": 22 }],"silence": { "args": "silenceProc", "line": 23 },"default": { "args": "defaultProc", "line": 24 }},"defaultProc": {"line": 25,"speak": [{"type": "string","args": "抱歉，我不明白你的意思","line": 26}],"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 27 },{ "answer": "账单", "nextStepId": "billProc", "line": 28 }],"silence": { "args": "silenceProc", "line": 29 },"default": { "args": "defaultProc", "line": 30 }}},"entry": "welcome","exitStep": ["thanks", "billProc"],"vars": { "$name": "", "$amount": "" }}'
);

test("Test wrong ast: no defaultList", () => {
    expect(() => {
        validate(ast2);
    }).toThrow();
});

test("Parse Culculate Script", () => {
    expect(
        JSON.stringify(
            parse(`Step welcome
    Speak $name + "您好，请问有什么可以帮您?"
    Listen 5
    Branch "充值", chargeProc
    Branch "投诉", complainProc
    Branch "账单", billProc
    Silence silenceProc
    Default defaultProc
Step complainProc
    Speak "您的意见是我们改进工作的动力，请问您还有什么补充?"
    Listen 5
    Default thanks
Step thanks
    Speak "感谢您的来电，再见"
    Exit
Step billProc
    Speak "您的本月账单是" + $amount + "元，感谢您的来电，再见"
    Exit
Step silenceProc
    Speak "听不清，请您大声一点可以吗?"
    Listen 5
    Branch "充值", chargeProc
    Branch "投诉", complainProc
    Branch "账单", billProc
    Silence silenceProc
    Default defaultProc
Step defaultProc
    Speak "抱歉，我不明白你的意思"
    Branch "充值", chargeProc
    Branch "投诉", complainProc
    Branch "账单", billProc
    Silence silenceProc
    Default defaultProc
Step chargeProc
    Speak "请输入需要充值的金额"
    Culculate $amount, chargeSuccessProc, $amount + INPUT#1231231
    Default defaultProc
Step chargeSuccessProc
    Speak "充值成功，您的余额为" + $amount + "元，请问还有什么可以帮到您？"
    Branch "充值", chargeProc
    Branch "投诉", complainProc
    Branch "账单", billProc
    Silence silenceProc
    Default defaultProc`)
        )
    ).toBe(
        '{"HashTable":{"welcome":{"line":1,"speak":[{"type":"var","args":"$name","line":2},{"type":"string","args":"您好，请问有什么可以帮您?","line":2}],"listen":{"time":5,"line":3},"branch":[{"answer":"充值","nextStepId":"chargeProc","line":4},{"answer":"投诉","nextStepId":"complainProc","line":5},{"answer":"账单","nextStepId":"billProc","line":6}],"silence":{"args":"silenceProc","line":7},"default":{"args":"defaultProc","line":8}},"complainProc":{"line":9,"speak":[{"type":"string","args":"您的意见是我们改进工作的动力，请问您还有什么补充?","line":10}],"listen":{"time":5,"line":11},"default":{"args":"thanks","line":12}},"thanks":{"line":13,"speak":[{"type":"string","args":"感谢您的来电，再见","line":14}]},"billProc":{"line":16,"speak":[{"type":"string","args":"您的本月账单是","line":17},{"type":"var","args":"$amount","line":17},{"type":"string","args":"元，感谢您的来电，再见","line":17}]},"silenceProc":{"line":19,"speak":[{"type":"string","args":"听不清，请您大声一点可以吗?","line":20}],"listen":{"time":5,"line":21},"branch":[{"answer":"充值","nextStepId":"chargeProc","line":22},{"answer":"投诉","nextStepId":"complainProc","line":23},{"answer":"账单","nextStepId":"billProc","line":24}],"silence":{"args":"silenceProc","line":25},"default":{"args":"defaultProc","line":26}},"defaultProc":{"line":27,"speak":[{"type":"string","args":"抱歉，我不明白你的意思","line":28}],"branch":[{"answer":"充值","nextStepId":"chargeProc","line":29},{"answer":"投诉","nextStepId":"complainProc","line":30},{"answer":"账单","nextStepId":"billProc","line":31}],"silence":{"args":"silenceProc","line":32},"default":{"args":"defaultProc","line":33}},"chargeProc":{"line":34,"speak":[{"type":"string","args":"请输入需要充值的金额","line":35}],"culculate":["$amount","chargeSuccessProc","$amount + INPUT"],"default":{"args":"defaultProc","line":37}},"chargeSuccessProc":{"line":38,"speak":[{"type":"string","args":"充值成功，您的余额为","line":39},{"type":"var","args":"$amount","line":39},{"type":"string","args":"元，请问还有什么可以帮到您？","line":39}],"branch":[{"answer":"充值","nextStepId":"chargeProc","line":40},{"answer":"投诉","nextStepId":"complainProc","line":41},{"answer":"账单","nextStepId":"billProc","line":42}],"silence":{"args":"silenceProc","line":43},"default":{"args":"defaultProc","line":44}}},"entry":"welcome","exitStep":["thanks","billProc"],"vars":{"$name":"","$amount":""}}'
    );
});
