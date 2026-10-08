<script setup lang="ts">
  import Button from "@/components/Button/Button.vue";
  import Collapse from "@/components/Collapse/Collapse.vue"
  import Item from "@/components/Collapse/CollapseItem.vue"
  import Alert from "@/components/Alert/Alert.vue";
  import Tooltip from "@/components/Tooltip/Tooltip.vue"
  import type { MenuOption } from "@/components/Dropdown/types.ts";
  import Dropdown from "@/components/Dropdown/Dropdown.tsx";
  import Message from "@/components/Message/Message.vue"
  import { createMessage } from "@/components/Message/method.ts";
  import type {ButtonInstance} from "@/components/Button/types.ts";
  import type { AlertInstance } from "@/components/Alert/types.ts"
  import {onBeforeUpdate, onMounted, ref, h} from "vue";
  import VkIcon from "@/components/Icon/Icon.vue";
  import type {TooltipInstance} from "@/components/Tooltip/types.ts";
  import type {Options} from "@popperjs/core";
  import VkButton from "@/components/Button/Button.vue";

  const ButtonRef = ref<ButtonInstance|null>(null)
  const openValue = ref(['a'])
  const tooltipRef = ref<TooltipInstance>()
  const tooltipOptions: Partial<Options> = {
    placement:'right',
    strategy:'fixed'
  }

  const dropdownOptions: MenuOption[]=[
    { key:1, label: h('b', 'this is bold') },
    { key:2, label: 'item2', disabled:true },
    { key:3, label: 'item3', divided:true },
    { key:4, label: 'item4' }
  ]

  const alertRef = ref<AlertInstance>();
  const removeAlert = ()=>{
    alertRef.value?.close();
  }

  const inlineConsole = (...args:any)=> {
    console.log(...args);
  }

  const trigger = ref<any>('click');

  onMounted(()=>{
    const instance = createMessage({message:'hello world', duration:0, showClose:true, type:"success"})
    createMessage({message:'hello world again', duration:0, showClose:true, type:'info'})
    createMessage({message:'hello world three', duration:3000, showClose:true, type:'warning'})

    if (ButtonRef.value) {
      console.log('ButtonRef', ButtonRef.value.ref)
    }

    setTimeout(()=>{
      openValue.value = ['a', 'b'];
      // trigger.value = 'click';
      instance.destroy();
    }, 2000)
  })
</script>

<template>
<!--  <Message message="hello message" :duration="0" show-close></Message>-->
  <!--  <Tooltip content="hello world" placement="right" :trigger="trigger" manual ref="tooltipRef" :popper-options="tooltipOptions" :open-delay="1000" :close-delay="1000">-->
<!--  <Tooltip content="hello world" placement="right" :trigger="trigger" :open-delay="1000" :close-delay="1000">-->
<!--    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125"/>-->
<!--    <template #content>-->
<!--      <h1>Hello tooltip</h1>-->
<!--    </template>-->
<!--  </Tooltip>-->
  <Dropdown
    @visible-change="e=> inlineConsole('visible change', e)"
    @selected="e=> inlineConsole('selected', e)"
    placement="right"
    :trigger="trigger"
    :menu-options="dropdownOptions"
    manual
    ref="tooltipRef"
  >
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125"/>

  </Dropdown>
  <button @click="tooltipRef?.show">点我打开</button>
  <button @click="tooltipRef?.hide">点我关闭</button>
  <br>

  <VkIcon icon="fa-solid fa-user-secret"></VkIcon>
  <VkIcon icon="arrow-up" size="2xl" type="primary"></VkIcon>
  <VkIcon icon="arrow-up" size="2xl" type="danger" color="#0e7a0d"></VkIcon>
  <br>
<!--  <Button ref="buttonRef" @click="open">Test Button</Button>-->
  <Button ref="buttonRef">Test Button</Button>
<!--  <Button plain @click="close">Plain Button</Button>-->
  <Button plain>Plain Button</Button>
  <Button round>Round Button</Button>
  <Button circle>VK</Button>
  <Button disabled>Disabled Button</Button><br/><br/>
  <Button type="primary">Primary</Button>
  <Button type="success">Success</Button>
  <Button type="info">Info</Button>
  <Button type="warning">Warning</Button>
  <Button type="danger">Danger</Button><br/><br/>
  <Button type="primary" plain>Primary</Button>
  <Button type="success" plain>Success</Button>
  <Button type="info" plain>Info</Button>
  <Button type="warning" plain>Warning</Button>
  <Button type="danger" plain>Danger</Button><br/><br/>
  <Button size="large">Large</Button>
  <Button size="small">Small</Button><br/><br/>
  <Button size="large" loading>Loading</Button>
  <Button size="large" icon="arrow-up">Icon</Button><br/><br/>

  <Collapse v-model="openValue" accordion>
    <Item name="a" title="Title A">
      <template #title>
        <span>Title a</span>
      </template>
      <h1>headline title</h1>
      <div> this is content a aaa </div>
    </Item>
    <Item name="b" title="Title B">
      <div> this is bbbbb test </div>
    </Item>
    <Item name="c" title="Disabled Title" disabled>
      <div> this is cccc test </div>
    </Item>
  </Collapse>
  {{openValue}}
  <Alert :closable="false" type="primary" ref="alertRef"></Alert>
  <button @click="removeAlert">点我关闭</button>
  <Alert closable type="success"></Alert>
  <Alert closable type="info"></Alert>
  <Alert closable type="warning" ></Alert>
  <Alert closable type="danger" effect="dark">
    警告fqeqifojqiofqiojwfqiojwfiqjofwfiajoaifsaiosfiasfjioasfasiofj
    警告fqeqifojqiofqiojwfqiojwfiqjofwfiajoaifsaiosfiasfjioasfasiofj
    警告fqeqifojqiofqiojwfqiojwfiqjofwfiajoaifsaiosfiasfjioasfasiofj
    警告fqeqifojqiofqiojwfqiojwfiqjofwfiajoaifsaiosfiasfjioasfasiofj
    警告fqeqifojqiofqiojwfqiojwfiqjofwfiajoaifsaiosfiasfjioasfasiofj
  </Alert>
  <Alert :closable="false" type="danger" effect="light" content="错误"></Alert>
  <Alert closable type="danger" effect="light"></Alert>


</template>

<style scoped></style>
