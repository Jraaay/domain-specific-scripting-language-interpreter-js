<template>
    <beautiful-chat
        :participants="participants"
        :titleImageUrl="titleImageUrl"
        :onMessageWasSent="onMessageWasSent"
        :messageList="messageList"
        :newMessagesCount="newMessagesCount"
        :isOpen="isChatOpen"
        :close="closeChat"
        :open="openChat"
        :showEmoji="false"
        :showFile="false"
        :showEdition="false"
        :showDeletion="false"
        :deletionConfirmation="true"
        :showTypingIndicator="showTypingIndicator"
        :showLauncher="true"
        :showCloseButton="true"
        :colors="colors"
        :alwaysScrollToBottom="alwaysScrollToBottom"
        :disableUserListToggle="false"
        :messageStyling="messageStyling"
    />
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from "vue";
import { bus } from "@/bus.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { getVars, initEnv, interpret } from "@/utils/interpreter.js";

export default defineComponent({
    name: "Chat",
    setup() {
        function sendMessage(text) {
            if (text.length > 0) {
                tmp.newMessagesCount = tmp.isChatOpen
                    ? tmp.newMessagesCount
                    : tmp.newMessagesCount + 1;
                tmp.onMessageWasSent({
                    author: "Robot",
                    type: "text",
                    data: { text },
                });
            }
        }
        function replyByRobot(message, silence = false) {
            try {
                const answer = interpret(
                    bus.ast,
                    tmp.env,
                    message,
                    false,
                    // bus.ast.exitStep.includes(tmp.env.curStep),
                    silence
                );
                console.log(answer);
                if (answer.listen > 0) {
                    tmp.timeoutID = setTimeout(() => {
                        sendMessage(replyByRobot("", true));
                        console.log("End timer");
                    }, answer.listen * 1000);
                    console.log("Start timer");
                }
                tmp.stop = answer.end;
                return answer.text;
            } catch (e) {
                ElMessage.error(e.message);
                tmp.stop = true;
                return;
            }
        }
        function onMessageWasSent(message) {
            // called when the user sends a message
            tmp.messageList = [...tmp.messageList, message];
            if (tmp.stop) {
                return;
            }
            if (message.author != "Robot") {
                clearTimeout(tmp.timeoutID);
                console.log("Stop timer");
                sendMessage(replyByRobot(message.data.text));
            }
        }
        function openChat() {
            // called when the user clicks on the fab button to open the chat
            const vars = getVars(bus.ast);
            let text = "请按顺序输入以下参数，以空格为分割：";
            for (let i of Object.keys(vars)) {
                text += "\n" + i;
            }
            ElMessageBox.prompt(text, "Var Init", {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                inputPattern: RegExp(
                    "([^\\s]+(\\s|$)){" + Object.keys(vars).length + "}"
                ),
                inputErrorMessage: "请输入正确参数",
            })
                .then(({ value }) => {
                    const varList = value.split(" ");
                    let j = 0;
                    for (let i of Object.keys(vars)) {
                        vars[i] = varList[j];
                        j++;
                    }
                    tmp.env = initEnv(bus.ast, vars);
                    tmp.messageList = [];
                    try {
                        const answer = interpret(
                            bus.ast,
                            tmp.env,
                            "",
                            true,
                            // bus.ast.exitStep.includes(tmp.env.curStep),
                            false
                        );
                        console.log(answer);
                        if (answer.listen > 0) {
                            tmp.timeoutID = setTimeout(() => {
                                sendMessage(replyByRobot("", true));
                                console.log("End timer");
                            }, answer.listen * 1000);
                            console.log("Start timer");
                        }
                        sendMessage(answer.text);
                        tmp.stop = false;
                        tmp.isChatOpen = true;
                        tmp.newMessagesCount = 0;
                    } catch (e) {
                        ElMessage.error(e.message);
                        tmp.stop = true;
                    }
                })
                .catch(() => {
                    ElMessage({
                        type: "info",
                        message: "Input canceled",
                    });
                });
        }
        function closeChat() {
            // called when the user clicks on the botton to close the chat
            tmp.env = {};
            tmp.isChatOpen = false;
            clearTimeout(tmp.timeoutID);
            tmp.timeoutID = null;
        }
        function handleScrollToTop() {
            // called when the user scrolls message list to top
            // leverage pagination for loading another page of messages
        }
        const tmp = reactive({
            code: "const noop = () => {}",
            participants: [
                {
                    id: "Robot",
                    name: "Robot",
                    imageUrl: "img/robot.png",
                },
            ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
            titleImageUrl: "img/title.png",
            messageList: [], // the list of the messages to show, can be paginated and adjusted dynamically
            newMessagesCount: 0,
            isChatOpen: false, // to determine whether the chat window should be open or closed
            showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
            colors: {
                header: {
                    bg: "#589cfe",
                    text: "#ffffff",
                },
                launcher: {
                    bg: "#589cfe",
                },
                messageList: {
                    bg: "#ffffff",
                },
                sentMessage: {
                    bg: "#589cfe",
                    text: "#ffffff",
                },
                receivedMessage: {
                    bg: "#eaeaea",
                    text: "#222222",
                },
                userInput: {
                    bg: "#f4f7f9",
                    text: "#565867",
                },
            }, // specifies the color scheme for the component
            alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
            messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
            sendMessage,
            onMessageWasSent,
            openChat,
            closeChat,
            handleScrollToTop,
            activeCode: bus.activeCode,
            env: {},
            stop: true,
            timeoutID: null,
        });
        watch(
            () => bus.activeCode,
            () => {
                closeChat();
                tmp.env = {};
                tmp.stop = true;
                clearTimeout(tmp.timeoutID);
                tmp.timeoutID = null;
            }
        );
        watch(
            () => tmp.stop,
            () => {
                if (tmp.stop) {
                    const input = document.getElementsByClassName(
                        "sc-user-input--text"
                    );
                    if (input.length > 0) {
                        input[0].contentEditable = "false";
                        input[0].setAttribute("placeholder", "聊天已结束");
                    }
                } else {
                    const input = document.getElementsByClassName(
                        "sc-user-input--text"
                    );
                    if (input.length > 0) {
                        input[0].contentEditable = "true";
                        input[0].setAttribute("placeholder", "请输入");
                    }
                }
            }
        );
        return toRefs(tmp);
    },
});
</script>

<style scoped></style>
