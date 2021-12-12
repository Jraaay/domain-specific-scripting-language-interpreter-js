import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import Chat from "vue3-beautiful-chat";

const app = createApp(App);
app.use(ElementPlus);
app.use(Chat);
app.mount("#app");
