<script setup lang="ts">
import type { TooltipProps, TooltipEmits, TooltipInstance } from "@/components/Tooltip/types.ts";
import {createPopper, type Instance} from "@popperjs/core";
import { debounce } from "lodash-es";
import {computed, onUnmounted, reactive, ref, watch} from "vue";
import useClickOutside from "@/hooks/useClickOutside.ts";

const props = withDefaults(defineProps<TooltipProps>(), {
  placement:'bottom',
  trigger:'hover',
  transition:'fade',
  openDelay:0,
  closeDelay:0,
});
const emits = defineEmits<TooltipEmits>();
const isOpen = ref(false);
const popperNode = ref<HTMLElement>();
const triggerNode = ref<HTMLElement>();
const popperContainerNode = ref<HTMLElement>();
const popperOptions = computed(()=>{
  return {
    placement: props.placement,
    modifiers:[
      {
        name:'offset',
        options:{
          offset:[0, 9]
        },
      }
    ],
    ...props.popperOptions,
  }
})

let openTime = 0;
let closeTime = 0;
const open = ()=>{
  openTime++;
  console.log("open times" + openTime);
  isOpen.value = true;
  emits("visible-change", true);
}
const close = ()=>{
  closeTime++;
  console.log("close times" + closeTime);
  isOpen.value = false;
  emits("visible-change", false);
}
const openDebounce = debounce(open, props.openDelay);
const closeDebounce = debounce(close, props.closeDelay);
const openFinal = ()=>{
  closeDebounce.cancel();
  openDebounce();
}
const closeFinal = ()=>{
  openDebounce.cancel();
  closeDebounce();
}
const togglePopper = ()=>{
  if(isOpen.value){
    closeFinal();
  }else {
    openFinal();
  }
}

useClickOutside(popperContainerNode, ()=>{
  if(!props.manual && props.trigger==='click' && isOpen.value){
    closeFinal();
  }
  if(isOpen.value){
    emits('click-outside', true);
  }
})

let popperInstance: Instance | null = null;
let events: Record<string, any> = reactive({})
let outEvents:Record<string, any> = reactive({})

const attchEvents = ()=>{
  if (props.trigger === 'hover'){
    events['mouseenter'] = openFinal;
    outEvents['mouseleave'] = closeFinal;
  }else if(props.trigger === 'click'){
    events['click'] = togglePopper;
  }
}
if (!props.manual){
  attchEvents();
}
watch(()=> props.manual, (isManual)=>{
  if (isManual){
    Object.keys(events).forEach(key => delete events[key])
    Object.keys(outEvents).forEach(key => delete outEvents[key])
  }else {
    attchEvents();
  }
})
watch(()=>props.trigger, (newTrigger, oldTrigger)=>{
  if (newTrigger !== oldTrigger){
    Object.keys(events).forEach(key => delete events[key])
    Object.keys(outEvents).forEach(key => delete outEvents[key])
    attchEvents();
  }
})
watch(isOpen, (newVal) => {
  if (newVal){
    if(triggerNode.value && popperNode.value){
      popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value);
    }
  }else {
    // popperInstance?.destroy();
  }
}, { flush:'post' })

defineExpose<TooltipInstance>({
  'show':open,
  'hide':close,
})
onUnmounted(()=>{
  popperInstance?.destroy();
});
defineOptions({
  name:'VkTooltip'
})
</script>

<template>
<div
  class="vk-tooltip"
  v-on="outEvents"
  ref="popperContainerNode"
>
  <div
    v-on="events"
    class="vk-tooltip__trigger"
    ref = "triggerNode"
  >
    <slot></slot>
  </div>
  <transition :name="transition" @after-leave="popperInstance?.destroy()">
    <div
      class="vk-tooltip__popper"
      ref = "popperNode"
      v-if="isOpen"
    >
      <slot name="content">{{content}}</slot>
      <div id="arrow" data-popper-arrow></div>
    </div>
  </transition>
</div>
</template>

<style scoped>

</style>
