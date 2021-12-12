import { parse } from "../../src/utils/parse";

test("Parse default script", () => {
    expect(
        JSON.stringify(
            parse(`Step welcome
    Speak $name + "您好，请问有什么可以帮您?"
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

test("Test wrong script", () => {
    expect(() => {
        parse("Step welcome");
    }).toThrow("Expected at least one exit step");
});
