/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse, validate } from "../../src/utils/parse";

test("Parse default script", () => {
    expect(
        JSON.stringify(
            parse(`# comment
            Step welcome
                Speak $name+"您好，请问有什么可以帮您?"
                Listen 5
                Branch "投诉", complainProc
                Branch "账单", billProc
                Branch "查余额", balanceProc
                Branch "查流量", trafficProc
                Branch "充值", chargeProc
                Branch "充流量", buyProc
                Branch "退出", exitProc
                Branch "没有", exitProc
                Branch "买", buyProc
                Silence silenceProc
                Default defaultProc
            Step complainProc
                Speak "请问你要投诉什么?"
                Default complainFinishProc
            Step complainFinishProc
                Speak "您的意见是我们改进工作的动力，请问还有什么可以帮到您？"
                Listen 5
                Branch "投诉", complainProc
                Branch "账单", billProc
                Branch "查余额", balanceProc
                Branch "查流量", trafficProc
                Branch "充值", chargeProc
                Branch "充流量", buyProc
                Branch "退出", exitProc
                Branch "没有", exitProc
                Branch "买", buyProc
                Silence silenceProc
                Default defaultProc
            Step thanks
                Speak "感谢您的来电，再见"
                Exit
            Step billProc
                Speak "您的本月账单是" + $amount + "元，请问还有什么可以帮到您？"
                Listen 5
                Branch "投诉", complainProc
                Branch "账单", billProc
                Branch "查余额", balanceProc
                Branch "查流量", trafficProc
                Branch "充值", chargeProc
                Branch "充流量", buyProc
                Branch "退出", exitProc
                Branch "没有", exitProc
                Branch "买", buyProc
                Silence silenceProc
                Default defaultProc
            Step silenceProc
                Speak "听不清，请您大声一点可以吗?"
                Branch "投诉", complainProc
                Branch "账单", billProc
                Branch "查余额", balanceProc
                Branch "查流量", trafficProc
                Branch "充值", chargeProc
                Branch "充流量", buyProc
                Branch "退出", exitProc
                Branch "没有", exitProc
                Branch "买", buyProc
                Default defaultProc
            Step defaultProc
                Speak "抱歉，我不明白你的意思"
                Branch "投诉", complainProc
                Branch "账单", billProc
                Branch "查余额", balanceProc
                Branch "查流量", trafficProc
                Branch "充值", chargeProc
                Branch "充流量", buyProc
                Branch "退出", exitProc
                Branch "没有", exitProc
                Branch "买", buyProc
                Silence silenceProc
                Default defaultProc
            Step balanceProc
                Speak "您的余额为；" + $balance + "元，请问还有什么可以帮到您？"
                Listen 5
                Branch "投诉", complainProc
                Branch "账单", billProc
                Branch "查余额", balanceProc
                Branch "查流量", trafficProc
                Branch "充值", chargeProc
                Branch "充流量", buyProc
                Branch "退出", exitProc
                Branch "没有", exitProc
                Branch "买", buyProc
                Silence silenceProc
                Default defaultProc
            Step exitProc
                Speak "感谢您的使用，再见。"
                Exit
            Step chargeProc
                Speak "请问您需要充值多少元？您当前的余额为" + $balance + "元。" #comment
                Culculate $balance, chargeSuccessProc, $balance + INPUT # comment
            Step chargeSuccessProc
                Speak "充值成功，您当前余额为" + $balance + "元，请问还有什么可以帮到您？"
                Listen 5
                Branch "投诉", complainProc
                Branch "账单", billProc
                Branch "查余额", balanceProc
                Branch "查流量", trafficProc
                Branch "充值", chargeProc
                Branch "充流量", buyProc
                Branch "退出", exitProc
                Branch "没有", exitProc
                Branch "买", buyProc
                Silence silenceProc
                Default defaultProc
            Step trafficProc
                Speak "您的剩余流量为" + $traffic + "GB，请问还有什么可以帮到您？"
                Listen 5
                Branch "投诉", complainProc
                Branch "账单", billProc
                Branch "查余额", balanceProc
                Branch "查流量", trafficProc
                Branch "充值", chargeProc
                Branch "充流量", buyProc
                Branch "退出", exitProc
                Branch "没有", exitProc
                Branch "买", buyProc
                Silence silenceProc
                Default defaultProc
            Step buyProc
                Speak "请问您需要购买多少流量包？价格为5元/GB，请输入价格。"
                Culculate $balance, buySuccessProc, $balance - INPUT
                Culculate $traffic, buySuccessProc, $traffic + INPUT / 5
            Step buySuccessProc
                Speak "流量包购买成功，余额为" + $balance + "元，剩余流量为" + $traffic + "GB，请问还有什么可以帮到您？"
                Listen 5
                Branch "投诉", complainProc
                Branch "账单", billProc
                Branch "查余额", balanceProc
                Branch "查流量", trafficProc
                Branch "充值", chargeProc
                Branch "充流量", buyProc
                Branch "退出", exitProc
                Branch "没有", exitProc
                Branch "买", buyProc
                Silence silenceProc
                Default defaultProc`)
        )
    ).toBe(
        '{"hashTable":{"welcome":{"line":1,"speak":[{"type":"var","args":"$name","line":2},{"type":"string","args":"您好，请问有什么可以帮您?","line":2}],"listen":{"time":5,"line":3},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":4},{"answer":"账单","nextStepId":"billProc","line":5},{"answer":"查余额","nextStepId":"balanceProc","line":6},{"answer":"查流量","nextStepId":"trafficProc","line":7},{"answer":"充值","nextStepId":"chargeProc","line":8},{"answer":"充流量","nextStepId":"buyProc","line":9},{"answer":"退出","nextStepId":"exitProc","line":10},{"answer":"没有","nextStepId":"exitProc","line":11},{"answer":"买","nextStepId":"buyProc","line":12}],"silence":{"args":"silenceProc","line":13},"default":{"args":"defaultProc","line":14}},"complainProc":{"line":15,"speak":[{"type":"string","args":"请问你要投诉什么?","line":16}],"default":{"args":"complainFinishProc","line":17}},"complainFinishProc":{"line":18,"speak":[{"type":"string","args":"您的意见是我们改进工作的动力，请问还有什么可以帮到您？","line":19}],"listen":{"time":5,"line":20},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":21},{"answer":"账单","nextStepId":"billProc","line":22},{"answer":"查余额","nextStepId":"balanceProc","line":23},{"answer":"查流量","nextStepId":"trafficProc","line":24},{"answer":"充值","nextStepId":"chargeProc","line":25},{"answer":"充流量","nextStepId":"buyProc","line":26},{"answer":"退出","nextStepId":"exitProc","line":27},{"answer":"没有","nextStepId":"exitProc","line":28},{"answer":"买","nextStepId":"buyProc","line":29}],"silence":{"args":"silenceProc","line":30},"default":{"args":"defaultProc","line":31}},"thanks":{"line":32,"speak":[{"type":"string","args":"感谢您的来电，再见","line":33}]},"billProc":{"line":35,"speak":[{"type":"string","args":"您的本月账单是","line":36},{"type":"var","args":"$amount","line":36},{"type":"string","args":"元，请问还有什么可以帮到您？","line":36}],"listen":{"time":5,"line":37},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":38},{"answer":"账单","nextStepId":"billProc","line":39},{"answer":"查余额","nextStepId":"balanceProc","line":40},{"answer":"查流量","nextStepId":"trafficProc","line":41},{"answer":"充值","nextStepId":"chargeProc","line":42},{"answer":"充流量","nextStepId":"buyProc","line":43},{"answer":"退出","nextStepId":"exitProc","line":44},{"answer":"没有","nextStepId":"exitProc","line":45},{"answer":"买","nextStepId":"buyProc","line":46}],"silence":{"args":"silenceProc","line":47},"default":{"args":"defaultProc","line":48}},"silenceProc":{"line":49,"speak":[{"type":"string","args":"听不清，请您大声一点可以吗?","line":50}],"branch":[{"answer":"投诉","nextStepId":"complainProc","line":51},{"answer":"账单","nextStepId":"billProc","line":52},{"answer":"查余额","nextStepId":"balanceProc","line":53},{"answer":"查流量","nextStepId":"trafficProc","line":54},{"answer":"充值","nextStepId":"chargeProc","line":55},{"answer":"充流量","nextStepId":"buyProc","line":56},{"answer":"退出","nextStepId":"exitProc","line":57},{"answer":"没有","nextStepId":"exitProc","line":58},{"answer":"买","nextStepId":"buyProc","line":59}],"default":{"args":"defaultProc","line":60}},"defaultProc":{"line":61,"speak":[{"type":"string","args":"抱歉，我不明白你的意思","line":62}],"branch":[{"answer":"投诉","nextStepId":"complainProc","line":63},{"answer":"账单","nextStepId":"billProc","line":64},{"answer":"查余额","nextStepId":"balanceProc","line":65},{"answer":"查流量","nextStepId":"trafficProc","line":66},{"answer":"充值","nextStepId":"chargeProc","line":67},{"answer":"充流量","nextStepId":"buyProc","line":68},{"answer":"退出","nextStepId":"exitProc","line":69},{"answer":"没有","nextStepId":"exitProc","line":70},{"answer":"买","nextStepId":"buyProc","line":71}],"silence":{"args":"silenceProc","line":72},"default":{"args":"defaultProc","line":73}},"balanceProc":{"line":74,"speak":[{"type":"string","args":"您的余额为；","line":75},{"type":"var","args":"$balance","line":75},{"type":"string","args":"元，请问还有什么可以帮到您？","line":75}],"listen":{"time":5,"line":76},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":77},{"answer":"账单","nextStepId":"billProc","line":78},{"answer":"查余额","nextStepId":"balanceProc","line":79},{"answer":"查流量","nextStepId":"trafficProc","line":80},{"answer":"充值","nextStepId":"chargeProc","line":81},{"answer":"充流量","nextStepId":"buyProc","line":82},{"answer":"退出","nextStepId":"exitProc","line":83},{"answer":"没有","nextStepId":"exitProc","line":84},{"answer":"买","nextStepId":"buyProc","line":85}],"silence":{"args":"silenceProc","line":86},"default":{"args":"defaultProc","line":87}},"exitProc":{"line":88,"speak":[{"type":"string","args":"感谢您的使用，再见。","line":89}]},"chargeProc":{"line":91,"speak":[{"type":"string","args":"请问您需要充值多少元？您当前的余额为","line":92},{"type":"var","args":"$balance","line":92},{"type":"string","args":"元。","line":92}],"culculate":[["$balance","chargeSuccessProc","$balance + INPUT"]]},"chargeSuccessProc":{"line":94,"speak":[{"type":"string","args":"充值成功，您当前余额为","line":95},{"type":"var","args":"$balance","line":95},{"type":"string","args":"元，请问还有什么可以帮到您？","line":95}],"listen":{"time":5,"line":96},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":97},{"answer":"账单","nextStepId":"billProc","line":98},{"answer":"查余额","nextStepId":"balanceProc","line":99},{"answer":"查流量","nextStepId":"trafficProc","line":100},{"answer":"充值","nextStepId":"chargeProc","line":101},{"answer":"充流量","nextStepId":"buyProc","line":102},{"answer":"退出","nextStepId":"exitProc","line":103},{"answer":"没有","nextStepId":"exitProc","line":104},{"answer":"买","nextStepId":"buyProc","line":105}],"silence":{"args":"silenceProc","line":106},"default":{"args":"defaultProc","line":107}},"trafficProc":{"line":108,"speak":[{"type":"string","args":"您的剩余流量为","line":109},{"type":"var","args":"$traffic","line":109},{"type":"string","args":"GB，请问还有什么可以帮到您？","line":109}],"listen":{"time":5,"line":110},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":111},{"answer":"账单","nextStepId":"billProc","line":112},{"answer":"查余额","nextStepId":"balanceProc","line":113},{"answer":"查流量","nextStepId":"trafficProc","line":114},{"answer":"充值","nextStepId":"chargeProc","line":115},{"answer":"充流量","nextStepId":"buyProc","line":116},{"answer":"退出","nextStepId":"exitProc","line":117},{"answer":"没有","nextStepId":"exitProc","line":118},{"answer":"买","nextStepId":"buyProc","line":119}],"silence":{"args":"silenceProc","line":120},"default":{"args":"defaultProc","line":121}},"buyProc":{"line":122,"speak":[{"type":"string","args":"请问您需要购买多少流量包？价格为5元/GB，请输入价格。","line":123}],"culculate":[["$balance","buySuccessProc","$balance - INPUT"],["$traffic","buySuccessProc","$traffic + INPUT / 5"]]},"buySuccessProc":{"line":126,"speak":[{"type":"string","args":"流量包购买成功，余额为","line":127},{"type":"var","args":"$balance","line":127},{"type":"string","args":"元，剩余流量为","line":127},{"type":"var","args":"$traffic","line":127},{"type":"string","args":"GB，请问还有什么可以帮到您？","line":127}],"listen":{"time":5,"line":128},"branch":[{"answer":"投诉","nextStepId":"complainProc","line":129},{"answer":"账单","nextStepId":"billProc","line":130},{"answer":"查余额","nextStepId":"balanceProc","line":131},{"answer":"查流量","nextStepId":"trafficProc","line":132},{"answer":"充值","nextStepId":"chargeProc","line":133},{"answer":"充流量","nextStepId":"buyProc","line":134},{"answer":"退出","nextStepId":"exitProc","line":135},{"answer":"没有","nextStepId":"exitProc","line":136},{"answer":"买","nextStepId":"buyProc","line":137}],"silence":{"args":"silenceProc","line":138},"default":{"args":"defaultProc","line":139}}},"entry":"welcome","exitStep":["thanks","exitProc"],"vars":{"$name":"","$amount":"","$balance":"","$traffic":""}}'
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
    '{"hashTable": {"welcome": {"speak": [{ "type": "var", "args": "$name", "line": 2 },{"type": "string","args": "您好，请问有什么可以帮您?","line": 2}],"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 4 },{ "answer": "账单", "nextStepId": "billProc", "line": 5 }],"silence": { "args": "silenceProc", "line": 6 }},"complainProc": {"line": 8,"speak": [{"type": "string","args": "您的意见是我们改进工作的动力，请问您还有什么补充?","line": 9}],"listen": { "time": 5, "line": 10 },"default": { "args": "thanks", "line": 11 }},"thanks": {"line": 12,"speak": [{ "type": "string", "args": "感谢您的来电，再见", "line": 13 }]},"billProc": {"line": 15,"speak": [{ "type": "string", "args": "您的本月账单是", "line": 16 },{ "type": "var", "args": "$amount", "line": 16 },{"type": "string","args": "元，感谢您的来电，再见","line": 16}]},"silenceProc": {"line": 18,"speak": [{"type": "string","args": "听不清，请您大声一点可以吗?","line": 19}],"listen": { "time": 5, "line": 20 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 21 },{ "answer": "账单", "nextStepId": "billProc", "line": 22 }],"silence": { "args": "silenceProc", "line": 23 },"default": { "args": "defaultProc", "line": 24 }},"defaultProc": {"line": 25,"speak": [{"type": "string","args": "抱歉，我不明白你的意思","line": 26}],"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 27 },{ "answer": "账单", "nextStepId": "billProc", "line": 28 }],"silence": { "args": "silenceProc", "line": 29 },"default": { "args": "defaultProc", "line": 30 }}},"entry": "welcome","exitStep": ["thanks", "billProc"],"vars": { "$name": "", "$amount": "" }}'
);

test("Test wrong ast: no line", () => {
    expect(() => {
        validate(ast);
    }).toThrow("Expected default step.");
});

const ast2 = JSON.parse(
    '{"hashTable": {"welcome": {"line": 1,"speak": [{ "type": "var", "args": "$name", "line": 2 },{"type": "string","args": "您好，请问有什么可以帮您?","line": 2}],"listen": { "time": 5, "line": 3 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 4 },{ "answer": "账单", "nextStepId": "billProc", "line": 5 }],"silence": { "args": "silenceProc", "line": 6 }},"complainProc": {"line": 8,"speak": [{"type": "string","args": "您的意见是我们改进工作的动力，请问您还有什么补充?","line": 9}],"listen": { "time": 5, "line": 10 },"default": { "args": "thanks", "line": 11 }},"thanks": {"line": 12,"speak": [{ "type": "string", "args": "感谢您的来电，再见", "line": 13 }]},"billProc": {"line": 15,"speak": [{ "type": "string", "args": "您的本月账单是", "line": 16 },{ "type": "var", "args": "$amount", "line": 16 },{"type": "string","args": "元，感谢您的来电，再见","line": 16}]},"silenceProc": {"line": 18,"speak": [{"type": "string","args": "听不清，请您大声一点可以吗?","line": 19}],"listen": { "time": 5, "line": 20 },"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 21 },{ "answer": "账单", "nextStepId": "billProc", "line": 22 }],"silence": { "args": "silenceProc", "line": 23 },"default": { "args": "defaultProc", "line": 24 }},"defaultProc": {"line": 25,"speak": [{"type": "string","args": "抱歉，我不明白你的意思","line": 26}],"branch": [{ "answer": "投诉", "nextStepId": "complainProc", "line": 27 },{ "answer": "账单", "nextStepId": "billProc", "line": 28 }],"silence": { "args": "silenceProc", "line": 29 },"default": { "args": "defaultProc", "line": 30 }}},"entry": "welcome","exitStep": ["thanks", "billProc"],"vars": { "$name": "", "$amount": "" }}'
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
        '{"hashTable":{"welcome":{"line":1,"speak":[{"type":"var","args":"$name","line":2},{"type":"string","args":"您好，请问有什么可以帮您?","line":2}],"listen":{"time":5,"line":3},"branch":[{"answer":"充值","nextStepId":"chargeProc","line":4},{"answer":"投诉","nextStepId":"complainProc","line":5},{"answer":"账单","nextStepId":"billProc","line":6}],"silence":{"args":"silenceProc","line":7},"default":{"args":"defaultProc","line":8}},"complainProc":{"line":9,"speak":[{"type":"string","args":"您的意见是我们改进工作的动力，请问您还有什么补充?","line":10}],"listen":{"time":5,"line":11},"default":{"args":"thanks","line":12}},"thanks":{"line":13,"speak":[{"type":"string","args":"感谢您的来电，再见","line":14}]},"billProc":{"line":16,"speak":[{"type":"string","args":"您的本月账单是","line":17},{"type":"var","args":"$amount","line":17},{"type":"string","args":"元，感谢您的来电，再见","line":17}]},"silenceProc":{"line":19,"speak":[{"type":"string","args":"听不清，请您大声一点可以吗?","line":20}],"listen":{"time":5,"line":21},"branch":[{"answer":"充值","nextStepId":"chargeProc","line":22},{"answer":"投诉","nextStepId":"complainProc","line":23},{"answer":"账单","nextStepId":"billProc","line":24}],"silence":{"args":"silenceProc","line":25},"default":{"args":"defaultProc","line":26}},"defaultProc":{"line":27,"speak":[{"type":"string","args":"抱歉，我不明白你的意思","line":28}],"branch":[{"answer":"充值","nextStepId":"chargeProc","line":29},{"answer":"投诉","nextStepId":"complainProc","line":30},{"answer":"账单","nextStepId":"billProc","line":31}],"silence":{"args":"silenceProc","line":32},"default":{"args":"defaultProc","line":33}},"chargeProc":{"line":34,"speak":[{"type":"string","args":"请输入需要充值的金额","line":35}],"culculate":[["$amount","chargeSuccessProc","$amount + INPUT"]],"default":{"args":"defaultProc","line":37}},"chargeSuccessProc":{"line":38,"speak":[{"type":"string","args":"充值成功，您的余额为","line":39},{"type":"var","args":"$amount","line":39},{"type":"string","args":"元，请问还有什么可以帮到您？","line":39}],"branch":[{"answer":"充值","nextStepId":"chargeProc","line":40},{"answer":"投诉","nextStepId":"complainProc","line":41},{"answer":"账单","nextStepId":"billProc","line":42}],"silence":{"args":"silenceProc","line":43},"default":{"args":"defaultProc","line":44}}},"entry":"welcome","exitStep":["thanks","billProc"],"vars":{"$name":"","$amount":""}}'
    );
});
