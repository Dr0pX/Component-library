import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons"
import Button from "@/components/Button/index.ts"
import Collapse, {CollapseItem} from "@/components/Collapse/index.ts";
import Message, { createMessage, closeAll as closeMessageAll } from "@/components/Message/index.ts";
import type {App} from "vue";

import "./styles/index.css"

library.add(fas);

const components = [
  Button,
  Collapse,
  CollapseItem,
  Message,
]

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name as string, component)
  })
}

export {
  install,
  Button,
  Collapse,
  CollapseItem,
  Message,
  createMessage,
  closeMessageAll
}

export default {
  install
}
