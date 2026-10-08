import Message from './Message.vue';
import { createMessage, closeAll } from "@/components/Message/method.ts";
import type {App} from "vue";

Message.install = (app: App) => {
  app.component(Message.name || "VkMessage", Message)
}

export default Message
export {
  createMessage,
  closeAll
}
export * from "./types";
