<template>
    <div id="editor">
        <MonacoEditor
            class="editor"
            language="elixir"
            height="300px"
            theme="vs"
            :value="codeText"
            @change="onChange($event)"
        />
    </div>
    <el-row id="buttonrow">
        <el-col :span="4">
            <el-tooltip
                content="应用当前输入框中的脚本"
                placement="top"
                effect="light"
            >
                <el-button @click="applyScript">应用脚本</el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="3">
            <el-upload
                action="localhost"
                :before-upload="beforeUpload"
                accept=".script"
            >
                <el-tooltip
                    content="上传到输入框中(不应用)"
                    placement="top"
                    effect="light"
                >
                    <el-button>上传</el-button>
                </el-tooltip>
            </el-upload>
        </el-col>
        <el-col :span="3">
            <el-tooltip
                content="下载当前输入框中的脚本"
                placement="top"
                effect="light"
            >
                <el-button @click="download">下载</el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="5">
            <el-tooltip
                content="下载当前生效的脚本"
                placement="top"
                effect="light"
            >
                <el-button @click="downloadActive">下载当前脚本</el-button>
            </el-tooltip>
        </el-col>
        <el-col :span="4">
            <el-tooltip
                content="将输入框中的脚本还原为初始值(不应用)"
                placement="top"
                effect="light"
            >
                <el-button @click="reset">重置脚本</el-button>
            </el-tooltip>
        </el-col>
    </el-row>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import MonacoEditor from "monaco-editor-vue3";
import { ElMessageBox, ElMessage } from "element-plus";
import { bus } from "@/bus.js";

export default defineComponent({
    name: "EditorAndBotton",
    components: { MonacoEditor },
    setup() {
        function onChange(val) {
            tmp.codeText = val;
        }
        function applyScript() {
            bus.activeCode = tmp.codeText;
        }
        function download() {
            ElMessageBox.prompt("请输入下载的文件名", "下载", {
                confirmButtonText: "下载",
                cancelButtonText: "取消",
                inputPlaceholder: "请输入文件名",
                inputPattern: /^(?!\.)[^\\/:*?"<>|]{1,255}$/,
                inputErrorMessage: "非法文件名",
            })
                .then(({ value }) => {
                    let dataStr =
                        "data:text/plain;charset=utf-8," +
                        encodeURIComponent(tmp.codeText);
                    let downloadAnchorNode = document.createElement("a");
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute(
                        "download",
                        `${value}.script`
                    );
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                    ElMessage({
                        type: "success",
                        message: `正在下载:${value}.script`,
                    });
                })
                .catch(() => {
                    ElMessage({
                        type: "info",
                        message: "取消下载",
                    });
                });
        }
        function downloadActive() {
            ElMessageBox.prompt("请输入下载的文件名", "下载", {
                confirmButtonText: "下载",
                cancelButtonText: "取消",
                inputPlaceholder: "请输入文件名",
                inputPattern: /^(?!\.)[^\\/:*?"<>|]{1,255}$/,
                inputErrorMessage: "非法文件名",
            })
                .then(({ value }) => {
                    let dataStr =
                        "data:text/plain;charset=utf-8," +
                        encodeURIComponent(bus.activeCode);
                    let downloadAnchorNode = document.createElement("a");
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute(
                        "download",
                        `${value}.script`
                    );
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                    ElMessage({
                        type: "success",
                        message: `正在下载:${value}.script`,
                    });
                })
                .catch(() => {
                    ElMessage({
                        type: "info",
                        message: "取消下载",
                    });
                });
        }
        function reset() {
            tmp.codeText = bus.defaultCode;
        }
        function beforeUpload(file) {
            const reader = new FileReader();
            reader.onload = function fileReadCompleted() {
                // 当读取完成时，内容只在`reader.result`中
                tmp.codeText = reader.result;
            };
            reader.readAsText(file);
            return false;
        }
        const tmp = reactive({
            codeText: "",
            onChange,
            applyScript,
            download,
            downloadActive,
            reset,
            beforeUpload,
        });
        if (localStorage.codeText) {
            tmp.codeText = localStorage.codeText;
        } else {
            tmp.codeText = bus.defaultCode;
        }
        return toRefs(tmp);
    },
    watch: {
        codeText(val) {
            localStorage.setItem("codeText", val);
        },
    },
});
</script>

<style scoped>
#editor {
    max-width: 45em;
    height: 37em;
}
#buttonrow {
    max-width: 45em;
    place-content: center;
    margin-top: 40px;
}
.editor {
    height: 37em;
    box-shadow: 0px 0px 10px #888888;
    padding-top: 5px;
    padding-bottom: 5px;
}
</style>
