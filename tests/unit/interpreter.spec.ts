/* eslint-disable @typescript-eslint/no-explicit-any */
import { interpret, getVars, initEnv } from "../../src/utils/interpreter";

const ast = JSON.parse(
    '{"HashTable":{"welcome":{"line":1,"speak":[{"type":"var","args":"$name","line":2},{"type":"string","args":"您好，请问有什么可以帮您?","line":2}],"listen":{"time":5,"line":3},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":4},{"answer":"账单","nextStepId":"billProc","line":5}],"silence":{"args":"silenceProc","line":6},"default":{"args":"defaultProc","line":7}},"complainProc":{"line":8,"speak":[{"type":"string","args":"您的意见是我们改进工作的动力，请问您还有什么补充?","line":9}],"listen":{"time":5,"line":10},"default":{"args":"thanks","line":11}},"thanks":{"line":12,"speak":[{"type":"string","args":"感谢您的来电，再见","line":13}]},"billProc":{"line":15,"speak":[{"type":"string","args":"您的本月账单是","line":16},{"type":"var","args":"$amount","line":16},{"type":"string","args":"元，感谢您的来电，再见","line":16}]},"silenceProc":{"line":18,"speak":[{"type":"string","args":"听不清，请您大声一点可以吗?","line":19}],"listen":{"time":5,"line":20},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":21},{"answer":"账单","nextStepId":"billProc","line":22}],"silence":{"args":"silenceProc","line":23},"default":{"args":"defaultProc","line":24}},"defaultProc":{"line":25,"speak":[{"type":"string","args":"抱歉，我不明白你的意思","line":26}],"branch":[{"answer":"投诉","nextStepId":"complainProc","line":27},{"answer":"账单","nextStepId":"billProc","line":28}],"silence":{"args":"silenceProc","line":29},"default":{"args":"defaultProc","line":30}}},"entry":"welcome","exitStep":["thanks","billProc"],"vars":{"$name":"","$amount":""}}'
);

test("Test getVars", () => {
    expect(getVars(ast)).toEqual({ $amount: "", $name: "" });
});

test("Test initEnv", () => {
    expect(initEnv(ast, { $amount: "", $name: "" })).toEqual({
        curStep: "welcome",
        vars: { $amount: "", $name: "" },
    });
});

test("Test interpret: entry", () => {
    expect(
        interpret(
            ast,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "",
            true,
            false
        )
    ).toEqual({
        text: "2您好，请问有什么可以帮您?",
        end: false,
        listen: 5,
    });
});

test("Test interpret: welcome silence", () => {
    expect(
        interpret(
            ast,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "账单",
            false,
            true
        )
    ).toEqual({
        text: "听不清，请您大声一点可以吗?",
        end: false,
        listen: 5,
    });
});

test("Test interpret: 账单", () => {
    expect(
        interpret(
            ast,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "账单",
            false,
            false
        )
    ).toEqual({
        text: "您的本月账单是1元，感谢您的来电，再见",
        end: true,
        listen: 0,
    });
});

test("Test interpret: 投诉", () => {
    expect(
        interpret(
            ast,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "投诉123",
            false,
            false
        )
    ).toEqual({
        text: "您的意见是我们改进工作的动力，请问您还有什么补充?",
        end: false,
        listen: 5,
    });
});

test("Test interpret: complainProc silence", () => {
    expect(
        interpret(
            ast,
            {
                curStep: "complainProc",
                vars: { $amount: "1", $name: "2" },
            },
            "",
            false,
            true
        )
    ).toEqual({
        text: "感谢您的来电，再见",
        end: true,
        listen: 0,
    });
});

test("Test interpret: welcome default", () => {
    expect(
        interpret(
            ast,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "balabala",
            false,
            false
        )
    ).toEqual({
        text: "抱歉，我不明白你的意思",
        end: false,
        listen: 0,
    });
});

const astError = JSON.parse(
    '{"HashTable": {"welcome": {"line": 1,"speak": [{ "type": "var", "args": "$name", "line": 2 },{"type": "string","args": "您好，请问有什么可以帮您?","line": 2}],"listen": { "time": 5, "line": 3 },"complainProc": {"line": 8,"speak": [{"type": "string","args": "您的意见是我们改进工作的动力，请问您还有什么补充?","line": 9}],"listen": { "time": 5, "line": 10 },"default": { "args": "thanks", "line": 11 }},"thanks": {"line": 12,"speak": [{ "type": "string", "args": "感谢您的来电，再见", "line": 13 }]},"billProc": {"line": 15,"speak": [{ "type": "string", "args": "您的本月账单是", "line": 16 },{ "type": "var", "args": "$amount", "line": 16 },{"type": "string","args": "元，感谢您的来电，再见","line": 16}]},"silenceProc": {"line": 18,"speak": [{"type": "string","args": "听不清，请您大声一点可以吗?","line": 19}],"listen": { "time": 5, "line": 20 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 21 },{ "answer": "账单", "nextStepId": "billProc", "line": 22 }],"default": { "args": "defaultProc", "line": 24 }},"defaultProc": {"line": 25,"speak": [{"type": "string","args": "抱歉，我不明白你的意思","line": 26}],"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 27 },{ "answer": "账单", "nextStepId": "billProc", "line": 28 }],"silence": { "args": "silenceProc", "line": 29 },"default": { "args": "defaultProc", "line": 30 }}},"entry": "welcome","exitStep": ["thanks", "billProc"],"vars": { "$name": "", "$amount": "" }}}'
);

test("Test interpret by error ast: welcome default", () => {
    expect(() => {
        interpret(
            astError,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "balabala",
            false,
            false
        );
    }).toThrow("No default step");
});

test("Test interpret by error ast: welcome silence", () => {
    expect(() => {
        interpret(
            astError,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "",
            false,
            true
        );
    }).toThrow("No silence step or default step");
});

test("Test interpret by error ast: welcome branch", () => {
    expect(() => {
        interpret(
            astError,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "账单"
        );
    }).toThrow("No default step");
});

const ast2 = JSON.parse(
    '{"HashTable":{"welcome":{"line":1,"speak":[{"type":"var","args":"$name","line":2},{"type":"string","args":"您好，请问有什么可以帮您?","line":2}],"branch":[{"answer":"投诉","nextStepId":"complainProc","line":4},{"answer":"账单","nextStepId":"billProc","line":5}],"silence":{"args":"silenceProc","line":6},"default":{"args":"defaultProc","line":7}},"complainProc":{"line":8,"speak":[{"type":"string","args":"您的意见是我们改进工作的动力，请问您还有什么补充?","line":9}],"listen":{"time":5,"line":10},"default":{"args":"thanks","line":11}},"thanks":{"line":12,"speak":[{"type":"string","args":"感谢您的来电，再见","line":13}]},"billProc":{"line":15,"speak":[{"type":"string","args":"您的本月账单是","line":16},{"type":"var","args":"$amount","line":16},{"type":"string","args":"元，感谢您的来电，再见","line":16}]},"silenceProc":{"line":18,"speak":[{"type":"string","args":"听不清，请您大声一点可以吗?","line":19}],"listen":{"time":5,"line":20},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":21},{"answer":"账单","nextStepId":"billProc","line":22}],"silence":{"args":"silenceProc","line":23},"default":{"args":"defaultProc","line":24}},"defaultProc":{"line":25,"speak":[{"type":"string","args":"抱歉，我不明白你的意思","line":26}],"branch":[{"answer":"投诉","nextStepId":"complainProc","line":27},{"answer":"账单","nextStepId":"billProc","line":28}],"silence":{"args":"silenceProc","line":29},"default":{"args":"defaultProc","line":30}}},"entry":"welcome","exitStep":["thanks","billProc"],"vars":{"$name":"","$amount":""}}'
);

test("Test interpret: entry no listen", () => {
    expect(
        interpret(
            ast2,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "",
            true,
            false
        )
    ).toEqual({
        text: "2您好，请问有什么可以帮您?",
        end: false,
        listen: 0,
    });
});

const ast3 = JSON.parse(
    '{"HashTable":{"welcome":{"line":1,"listen":{"time":5,"line":3},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":4},{"answer":"账单","nextStepId":"billProc","line":5}],"silence":{"args":"silenceProc","line":6},"default":{"args":"defaultProc","line":7}},"complainProc":{"line":8,"speak":[{"type":"string","args":"您的意见是我们改进工作的动力，请问您还有什么补充?","line":9}],"listen":{"time":5,"line":10},"default":{"args":"thanks","line":11}},"thanks":{"line":12,"speak":[{"type":"string","args":"感谢您的来电，再见","line":13}]},"billProc":{"line":15,"speak":[{"type":"string","args":"您的本月账单是","line":16},{"type":"var","args":"$amount","line":16},{"type":"string","args":"元，感谢您的来电，再见","line":16}]},"silenceProc":{"line":18,"speak":[{"type":"string","args":"听不清，请您大声一点可以吗?","line":19}],"listen":{"time":5,"line":20},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":21},{"answer":"账单","nextStepId":"billProc","line":22}],"silence":{"args":"silenceProc","line":23},"default":{"args":"defaultProc","line":24}},"defaultProc":{"line":25,"speak":[{"type":"string","args":"抱歉，我不明白你的意思","line":26}],"branch":[{"answer":"投诉","nextStepId":"complainProc","line":27},{"answer":"账单","nextStepId":"billProc","line":28}],"silence":{"args":"silenceProc","line":29},"default":{"args":"defaultProc","line":30}}},"entry":"welcome","exitStep":["thanks","billProc"],"vars":{"$name":"","$amount":""}}'
);

test("Test interpret: entry no speak", () => {
    expect(
        interpret(
            ast3,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "",
            true,
            false
        )
    ).toEqual({
        text: "",
        end: false,
        listen: 5,
    });
});

const ast4 = JSON.parse(
    '{"HashTable": {"welcome": {"line": 1,"speak": [{ "type": "error", "args": "$name", "line": 2 },{"type": "string","args": "您好，请问有什么可以帮您?","line": 2}],"listen": { "time": 5, "line": 3 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 4 },{ "answer": "账单", "nextStepId": "billProc", "line": 5 }],"silence": { "args": "silenceProc", "line": 6 },"default": { "args": "defaultProc", "line": 7 }},"complainProc": {"line": 8,"speak": [{"type": "string","args": "您的意见是我们改进工作的动力，请问您还有什么补充?","line": 9}],"listen": { "time": 5, "line": 10 },"default": { "args": "thanks", "line": 11 }},"thanks": {"line": 12,"speak": [{ "type": "string", "args": "感谢您的来电，再见", "line": 13 }]},"billProc": {"line": 15,"speak": [{ "type": "string", "args": "您的本月账单是", "line": 16 },{ "type": "var", "args": "$amount", "line": 16 },{"type": "string","args": "元，感谢您的来电，再见","line": 16}]},"silenceProc": {"line": 18,"speak": [{"type": "string","args": "听不清，请您大声一点可以吗?","line": 19}],"listen": { "time": 5, "line": 20 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 21 },{ "answer": "账单", "nextStepId": "billProc", "line": 22 }],"silence": { "args": "silenceProc", "line": 23 },"default": { "args": "defaultProc", "line": 24 }},"defaultProc": {"line": 25,"speak": [{"type": "string","args": "抱歉，我不明白你的意思","line": 26}],"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 27 },{ "answer": "账单", "nextStepId": "billProc", "line": 28 }],"silence": { "args": "silenceProc", "line": 29 },"default": { "args": "defaultProc", "line": 30 }}},"entry": "welcome","exitStep": ["thanks", "billProc"],"vars": { "$name": "", "$amount": "" }}'
);

test("Test interpret: speak type error", () => {
    expect(() => {
        interpret(
            ast4,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "",
            true,
            false
        );
    }).toThrow("Speak args type error");
});

const ast5 = JSON.parse(
    '{"HashTable": {"welcome": {"line": 1,"speak": [{ "type": "var", "args": "$name", "line": 2 },{"type": "string","args": "您好，请问有什么可以帮您?","line": 2}],"listen": { "time": 5, "line": 3 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 4 },{ "answer": "账单", "nextStepId": "billProc", "line": 5 }],"silence": { "args": "silenceProc", "line": 6 },"default": { "args": "defaultProc", "line": 7 }},"complainProc": {"line": 8,"listen": { "time": 5, "line": 10 },"default": { "args": "thanks", "line": 11 }},"thanks": {"line": 12,"speak": [{ "type": "string", "args": "感谢您的来电，再见", "line": 13 }]},"billProc": {"line": 15,"speak": [{ "type": "string", "args": "您的本月账单是", "line": 16 },{ "type": "var", "args": "$amount", "line": 16 },{"type": "string","args": "元，感谢您的来电，再见","line": 16}]},"silenceProc": {"line": 18,"speak": [{"type": "string","args": "听不清，请您大声一点可以吗?","line": 19}],"listen": { "time": 5, "line": 20 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 21 },{ "answer": "账单", "nextStepId": "billProc", "line": 22 }],"silence": { "args": "silenceProc", "line": 23 },"default": { "args": "defaultProc", "line": 24 }},"defaultProc": {"line": 25,"speak": [{"type": "string","args": "抱歉，我不明白你的意思","line": 26}],"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 27 },{ "answer": "账单", "nextStepId": "billProc", "line": 28 }],"silence": { "args": "silenceProc", "line": 29 },"default": { "args": "defaultProc", "line": 30 }}},"entry": "welcome","exitStep": ["thanks", "billProc"],"vars": { "$name": "", "$amount": "" }}'
);

test("Test interpret: not entry no speak", () => {
    expect(
        interpret(
            ast5,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "投诉",
            false,
            false
        )
    ).toEqual({
        text: "",
        end: false,
        listen: 5,
    });
});

const ast6 = JSON.parse(
    '{"HashTable": {"welcome": {"line": 1,"speak": [{ "type": "var", "args": "$name", "line": 2 },{"type": "string","args": "您好，请问有什么可以帮您?","line": 2}],"listen": { "time": 5, "line": 3 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 4 },{ "answer": "账单", "nextStepId": "billProc", "line": 5 }],"silence": { "args": "silenceProc", "line": 6 },"default": { "args": "defaultProc", "line": 7 }},"complainProc": {"line": 8,"speak": [{"type": "string","args": "您的意见是我们改进工作的动力，请问您还有什么补充?","line": 9}],"listen": { "time": 5, "line": 10 },"default": { "args": "thanks", "line": 11 }},"thanks": {"line": 12,"speak": [{ "type": "string", "args": "感谢您的来电，再见", "line": 13 }]},"billProc": {"line": 15,"speak": [{ "type": "string", "args": "您的本月账单是", "line": 16 },{ "type": "error", "args": "$amount", "line": 16 },{"type": "string","args": "元，感谢您的来电，再见","line": 16}]},"silenceProc": {"line": 18,"speak": [{"type": "string","args": "听不清，请您大声一点可以吗?","line": 19}],"listen": { "time": 5, "line": 20 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 21 },{ "answer": "账单", "nextStepId": "billProc", "line": 22 }],"silence": { "args": "silenceProc", "line": 23 },"default": { "args": "defaultProc", "line": 24 }},"defaultProc": {"line": 25,"speak": [{"type": "string","args": "抱歉，我不明白你的意思","line": 26}],"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 27 },{ "answer": "账单", "nextStepId": "billProc", "line": 28 }],"silence": { "args": "silenceProc", "line": 29 },"default": { "args": "defaultProc", "line": 30 }}},"entry": "welcome","exitStep": ["thanks", "billProc"],"vars": { "$name": "", "$amount": "" }}'
);

test("Test interpret: not entry speak type error", () => {
    expect(() => {
        interpret(
            ast6,
            {
                curStep: "welcome",
                vars: { $amount: "1", $name: "2" },
            },
            "账单",
            false,
            false
        );
    }).toThrow("Speak args type error");
});

const ast7 = JSON.parse(
    '{"HashTable":{"welcome":{"line":1,"speak":[{"type":"var","args":"$name","line":2},{"type":"string","args":"您好，请问有什么可以帮您?","line":2}],"listen":{"time":5,"line":3},"branch":[{"answer":"充值","nextStepId":"chargeProc","line":4},{"answer":"投诉","nextStepId":"complainProc","line":5},{"answer":"账单","nextStepId":"billProc","line":6}],"silence":{"args":"silenceProc","line":7},"default":{"args":"defaultProc","line":8}},"complainProc":{"line":9,"speak":[{"type":"string","args":"您的意见是我们改进工作的动力，请问您还有什么补充?","line":10}],"listen":{"time":5,"line":11},"default":{"args":"thanks","line":12}},"thanks":{"line":13,"speak":[{"type":"string","args":"感谢您的来电，再见","line":14}]},"billProc":{"line":16,"speak":[{"type":"string","args":"您的本月账单是","line":17},{"type":"var","args":"$amount","line":17},{"type":"string","args":"元，感谢您的来电，再见","line":17}]},"silenceProc":{"line":19,"speak":[{"type":"string","args":"听不清，请您大声一点可以吗?","line":20}],"listen":{"time":5,"line":21},"branch":[{"answer":"充值","nextStepId":"chargeProc","line":22},{"answer":"投诉","nextStepId":"complainProc","line":23},{"answer":"账单","nextStepId":"billProc","line":24}],"silence":{"args":"silenceProc","line":25},"default":{"args":"defaultProc","line":26}},"defaultProc":{"line":27,"speak":[{"type":"string","args":"抱歉，我不明白你的意思","line":28}],"branch":[{"answer":"充值","nextStepId":"chargeProc","line":29},{"answer":"投诉","nextStepId":"complainProc","line":30},{"answer":"账单","nextStepId":"billProc","line":31}],"silence":{"args":"silenceProc","line":32},"default":{"args":"defaultProc","line":33}},"chargeProc":{"line":34,"speak":[{"type":"string","args":"请输入需要充值的金额","line":35}],"culculate":["$amount","chargeSuccessProc","$amount + INPUT"],"default":{"args":"defaultProc","line":37}},"chargeSuccessProc":{"line":38,"speak":[{"type":"string","args":"充值成功，您的余额为","line":39},{"type":"var","args":"$amount","line":39},{"type":"string","args":"元，请问还有什么可以帮到您？","line":39}],"branch":[{"answer":"充值","nextStepId":"chargeProc","line":40},{"answer":"投诉","nextStepId":"complainProc","line":41},{"answer":"账单","nextStepId":"billProc","line":42}],"silence":{"args":"silenceProc","line":43},"default":{"args":"defaultProc","line":44}}},"entry":"welcome","exitStep":["thanks","billProc"],"vars":{"$name":"","$amount":""}}'
);

test("Test interpret: Culculate", () => {
    expect(
        interpret(
            ast7,
            { curStep: "chargeProc", vars: { $amount: "1", $name: "2" } },
            "10",
            false,
            false
        )
    ).toEqual({
        text: "充值成功，您的余额为11元，请问还有什么可以帮到您？",
        end: false,
        listen: 0,
    });
});

test("Test interpret: Culculate error", () => {
    expect(() => {
        interpret(
            ast7,
            { curStep: "chargeProc", vars: { $amount: "1", $name: "2" } },
            "asdasd",
            false,
            false
        );
    }).toThrow("Culculate error");
});
