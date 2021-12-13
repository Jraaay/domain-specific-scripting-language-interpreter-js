<!--
 * @FileDescription: 这是编辑和按钮组件
 * @Author: Jray
 * @Date: 2021-11-08
 * @LastEditors: Jray
 * @LastEditTime: 2021-12-13
-->

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

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MonacoEditor from "monaco-editor-vue3";
import { ElMessageBox, ElMessage } from "element-plus";
import { bus } from "@/bus";

export default defineComponent({
    name: "EditorAndBotton",
    components: { MonacoEditor },
    setup() {
        /**
         * 改变代码后保存
         * @param code 改变后的代码
         */
        function onChange(code: string) {
            tmp.codeText = code;
        }

        /**
         * 应用脚本
         */
        function applyScript() {
            if (bus.activeCode == tmp.codeText) {
                ElMessage.warning("当前脚本已经生效");
                return;
            } else {
                bus.activeCode = tmp.codeText;
            }
        }

        /**
         * 下载当前脚本
         */
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

        /**
         * 下载当前生效的脚本
         */
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

        /**
         * 重置脚本
         */
        function reset() {
            tmp.codeText = bus.defaultCode;
        }

        /**
         * 上传脚本
         * @param file 上传的文件
         */
        function beforeUpload(file: Blob) {
            const reader = new FileReader();
            reader.onload = function fileReadCompleted() {
                tmp.codeText = reader.result as string;
            };
            reader.readAsText(file);
            return false;
        }

        /**
         * 设置变量，以便于 HTML 中使用
         */
        const tmp = reactive({
            codeText: "",
            onChange,
            applyScript,
            download,
            downloadActive,
            reset,
            beforeUpload,
        });

        // 尝试获取本地存储的脚本
        if (localStorage.codeText) {
            tmp.codeText = localStorage.codeText;
        } else {
            tmp.codeText = bus.defaultCode;
        }
        return toRefs(tmp);
    },
    watch: {
        // 监听 codeText 变化，并将变化保存到本地存储
        codeText(val: string) {
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
