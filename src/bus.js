import { reactive, watch } from "vue";

let activeCode = "";

if (localStorage.activeCode) {
    activeCode = localStorage.activeCode;
} else {
    activeCode = "SCRIPT";
}

export const bus = reactive({
    activeCode: activeCode,
    defaultCode: "SCRIPT",
});

watch(bus, (val) => {
    localStorage.setItem("activeCode", val.activeCode);
});
