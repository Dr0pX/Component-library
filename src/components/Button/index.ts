import Button from "./Button.vue"
import type {App} from "vue";

Button.install = (app: App) => {
  app.component(Button.name || "VkButton", Button)
}

export default Button
export * from "./types.ts"
