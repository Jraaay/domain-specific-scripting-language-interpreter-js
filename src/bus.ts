import { reactive, watch } from "vue";
import { parse } from "./utils/parse";
import { ElMessage } from "element-plus";
import { AST, ENV } from "./utils/interface";

let activeCode = "";
const defaultCode = `# comment
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
    Default defaultProc`;

if (localStorage.activeCode) {
    activeCode = localStorage.activeCode;
} else {
    activeCode = defaultCode;
}
let ast: AST;
try {
    ast = parse(activeCode);
} catch (e: any) {
    ElMessage.error(e.message);
    ElMessage.error("代码解析失败，已将代码应用为默认代码");
    ast = parse(defaultCode);
}

export const bus = reactive({
    activeCode: activeCode,
    defaultCode: defaultCode,
    ast: ast,
    userList: {} as {
        [key: string]: {
            username: string;
            env: ENV;
            messageList: {
                author: string;
                type: string;
                data: { text: string };
            }[];
        };
    },
});

watch(
    () => bus.activeCode,
    (val) => {
        const oldVal = localStorage.activeCode
            ? localStorage.activeCode
            : defaultCode;
        try {
            bus.ast = parse(val);
            if (val != oldVal) {
                localStorage.setItem("activeCode", val);
                ElMessage.success("代码应用成功");
            }
        } catch (e: any) {
            bus.activeCode = oldVal;
            ElMessage.error(e.message);
        }
    }
);
