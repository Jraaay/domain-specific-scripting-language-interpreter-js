import { reactive, watch } from "vue";
import { parse } from "@/utils/parse";
import { ElMessage } from "element-plus";

let activeCode = "";
const defaultCode = `Step welcome
    Speak $name + "您好，请问有什么可以帮您?"
    Listen 5, 20
    Branch "投诉", complainProc
    Branch "账单", billProc
    Silence silence
    Default defaultProc
Step complainProc
    Speak "您的意见是我们改进工作的动力，请问您还有什么补充?"
    Listen 5, 50
    Default thanks
Step thanks
    Speak "感谢您的来电，再见"
    Exit
Step billProc
    Speak "您的本月账单是" + $amount + "元，感谢您的来电，再见"
    Exit
Step silenceProc
    Speak "听不清，请您大声一点可以吗?"
    Branch "投诉", complainProc
    Branch "账单", billProc
    Silence silenceProc
    Default defaultProc
Step defaultProc
    Speak "抱歉，我不明白你的意思"
    Branch "投诉", complainProc
    Branch "账单", billProc
    Silence silenceProc
    Default defaultProc`;

if (localStorage.activeCode) {
    activeCode = localStorage.activeCode;
} else {
    activeCode = defaultCode;
}
let ast
try {
    ast = parse(activeCode);
}
catch (e) {
    ElMessage.error(e.message);
    ast = parse(defaultCode);
}

export const bus = reactive({
    activeCode: activeCode,
    defaultCode: defaultCode,
    ast: ast,
});

watch(
    () => bus.activeCode,
    (val) => {
        localStorage.setItem("activeCode", val);
        try {
            bus.ast = parse(val);
            ElMessage.success("代码应用成功");
        } catch (e) {
            ElMessage.error(e.message);
        }
    }
);
