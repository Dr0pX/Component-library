<script setup lang="ts">
import type { SwitchProps, SwitchEmits} from "@/components/Switch/types.ts";
import {computed, onMounted, ref, watch} from "vue";

const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
})
const emits = defineEmits<SwitchEmits>()

const innerValue = ref( props.modelValue );
watch(()=>props.modelValue, (newVal)=>{
  innerValue.value = newVal;
})
const checked = computed(()=>{
  return innerValue.value === props.activeValue;
})
const switchValue = ()=>{
  if (props.disabled) return;
  const newValue = checked.value? props.inactiveValue : props.activeValue
  innerValue.value = newValue;
  emits('update:modelValue', newValue);
  emits('change', newValue);
}

const inputRef = ref<HTMLInputElement>()
onMounted(()=>{
  inputRef.value!.checked = checked.value
})
watch(checked, (val)=>{
  inputRef.value!.checked = val;
})

defineOptions({
  name:'VkSwitch',
  inheritAttrs: false
})
</script>

<template>
<div
  class="vk-switch"
  :class="{
    [`vk-switch--${size}`]: size,
    'is-disabled': disabled,
    'is-checked': checked,
  }"
  @click="switchValue"
>
  <input
    class="vk-switch__input"
    type="checkbox"
    role="switch"
    ref="inputRef"
    :name="name"
    :disabled="disabled"
    @keydown.enter="switchValue"
  >
  <div
    class="vk-switch__core"
  >
    <div class="vk-switch__core-inner">
      <span v-if="activeText || inactiveText" class="vk-switch__core-inner-text">
        {{checked? activeText : inactiveText}}
      </span>
    </div>
    <div class="vk-switch__core-action"></div>
  </div>
</div>
</template>

<style scoped>

</style>
