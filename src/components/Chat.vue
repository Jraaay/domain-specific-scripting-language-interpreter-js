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
        function replyByRobot(message) {
            return message + " (I'm a robot)";
        }
        function onMessageWasSent(message) {
            // called when the user sends a message
            tmp.messageList = [...tmp.messageList, message];
            if (message.author != "Robot") {
                tmp.onMessageWasSent({
                    author: "Robot",
                    type: "text",
                    data: { text: replyByRobot(message.data.text) },
                });
            }
        }
        function openChat() {
            // called when the user clicks on the fab button to open the chat
            tmp.isChatOpen = true;
            tmp.newMessagesCount = 0;
        }
        function closeChat() {
            // called when the user clicks on the botton to close the chat
            tmp.isChatOpen = false;
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
            messageList: [
                {
                    author: "Robot",
                    type: "text",
                    data: { text: "Hello" },
                },
            ], // the list of the messages to show, can be paginated and adjusted dynamically
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
        });
        watch(
            () => bus.activeCode,
            () => {
                console.log("new ", bus.activeCode);
            }
        );
        return toRefs(tmp);
    },
});
</script>

<style scoped></style>
