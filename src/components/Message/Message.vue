<script setup lang="ts">
import RenderVnode from "@/components/Common/RenderVnode.ts";
import Icon from "@/components/Icon/Icon.vue"
import type { MessageProps } from "@/components/Message/types.ts";
import {computed, onMounted, ref, onUnmounted} from "vue";
import {getLastBottomOffset} from "@/components/Message/method.ts";
import useEventListener from "@/hooks/useEventListener.ts";

const props = withDefaults(defineProps<MessageProps>(), {
  type:'info',
  duration:3000,
  offset:20,
  transitionName: 'fade-up'
});
const visible = ref(false);
const messageRef = ref<HTMLDivElement>()
// 计算偏移高度
const height = ref(0);
// 上一个实例最下面坐标的数字，第一个是0
const lastOffset = computed(()=>{
  return getLastBottomOffset(props.id)
})
// 这个元素该使用的top
const topOffset = computed(()=> props.offset+lastOffset.value)
// 这个元素为下个元素预留的offset，也就是它最低端 bottom 的值
const bottomOffset = computed(()=> height.value+topOffset.value)
const cssStyle = computed(()=>({
  top:topOffset.value + 'px',
  zIndex: props.zIndex,
}))

let timer: any;
function startTimer(){
  if (props.duration === 0)return;
  clearTimer();
  timer = setTimeout(()=>{
    visible.value = false;
  }, props.duration)
}
function clearTimer(){
  clearTimeout(timer);
  timer = null;
}

onMounted(async ()=>{
  visible.value = true;
  startTimer();
  // await nextTick();
  // height.value = messageRef.value!.getBoundingClientRect().height;
})

function keydown(e:Event){
  const event = e as KeyboardEvent;
  if(event.code === 'Escape'){
    visible.value = false;
  }
}
useEventListener(document, 'keydown', keydown)
// watch(visible, (newVal) => {
//   if(!newVal){
//     props.onDestroy();
//   }
// })
function destroyComponent(){
  props.onDestroy();
}
function updateHeight(){
  height.value = messageRef.value!.getBoundingClientRect().height;
}
onUnmounted(() => {
  clearTimer();
});
defineExpose({
  bottomOffset,
  visible
})
defineOptions({
  name:"VkMessage",
})
</script>

<template>
<Transition
  :name="transitionName"
  @after-leave="destroyComponent"
  @enter="updateHeight"
>
<div
  class="vk-message"
  v-show="visible"
  :class="{
  [`vk-message--${type}`]:type,
  'is-close':showClose
  }"
  role="alert"
  ref="messageRef"
  :style="cssStyle"
  @mouseenter="clearTimer"
  @mouseleave="startTimer"
>
  <div class="vk-message__content">
    <slot>
      <RenderVnode :v-node="message" v-if="message"></RenderVnode>
    </slot>
  </div>
  <div class="vk-message__close" v-if="showClose">
    <Icon icon="xmark" @click.stop="$event=>visible = false"></Icon>
  </div>
</div>
</Transition>
</template>

<style scoped>

</style>
