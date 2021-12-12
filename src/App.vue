<template>
    <Chat id="chat" />
    <img id="logo" alt="Jray logo" src="./assets/logo.png" style="max" />
    <h1>Domain-specific Scripting Language Interpreter</h1>
    <EditorAndBotton />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Chat from "./components/Chat.vue";
import EditorAndBotton from "./components/EditorAndBotton.vue";

export default defineComponent({
    name: "App",
    components: { Chat, EditorAndBotton },
});
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    text-align: -webkit-center;
}
#logo {
    max-height: 10em;
    margin-bottom: -30px;
    margin-top: -40px;
}
#chat > div.sc-chat-window.opened {
    z-index: 1999;
}
#chat > div.sc-launcher.opened {
    z-index: 1999;
}
#chat > div.sc-launcher {
    z-index: 1999;
}
.sc-header--img {
    max-height: 2.5em;
    max-width: 3em;
}
.sc-message--content.received .sc-message--text {
    text-align: left;
}
.sc-header--title.enabled {
    pointer-events: none;
}
.el-message-box {
    max-width: 90%;
}
</style>
