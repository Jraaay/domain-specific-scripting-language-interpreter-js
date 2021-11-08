<template>
    <div class="editor" ref="dom"></div>
</template>

<script>
import { onMounted, ref } from "vue";
import * as monaco from "monaco-editor";
import * as EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import * as JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
self.MonacoEnvironment = {
    getWorker(workerId, label) {
        if (label === "json") {
            return new JsonWorker();
        }
        return new EditorWorker();
    },
};

export default {
    name: "Editor",
    props: {
        modelValue: String,
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const dom = ref();

        let instance;

        onMounted(() => {
            const jsonModel = monaco.editor.createModel(
                props.modelValue,
                "json",
                monaco.Uri.parse("json://grid/settings.json")
            );

            instance = monaco.editor.create(dom.value, {
                model: jsonModel,
                tabSize: 2,
                automaticLayout: true,
                scrollBeyondLastLine: false,
            });

            instance.onDidChangeModelContent(() => {
                const value = instance.getValue();
                emit("update:modelValue", value);
            });
        });

        return {
            dom,
        };
    },
};
</script>

<style scoped>
.editor {
    height: 100%;
}
</style>
