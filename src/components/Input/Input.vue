<script setup lang="ts">
import type { InputProps, InputEmits } from "@/components/Input/types.ts";
import {computed, inject, nextTick, type Ref, ref, useAttrs, watch} from "vue";
import Icon from "@/components/Icon/Icon.vue";
import { formItemContextkey} from "@/components/Form/types.ts";

const props = withDefaults(defineProps<InputProps>(), { type: 'text', autoComplete: 'off' })
const emits = defineEmits<InputEmits>();
const attrs = useAttrs();

const formItemContext = inject(formItemContextkey)
const runValidation = (trigger?:string)=>{
  formItemContext?.validate(trigger).catch((e)=>console.log(e.errors))
}

const inputRef = ref() as Ref<HTMLElement>;
const innerValue = ref( props.modelValue );
const isFocus = ref(false);
const showClear = computed(()=>
  props.clearable &&
  !props.disabled &&
  !!innerValue.value &&
  isFocus.value
)

const keepFocus = async ()=>{
  await nextTick();
  inputRef.value.focus()
}
const handleInput = ()=>{
  emits('update:modelValue', innerValue.value);
  emits('input', innerValue.value);
  runValidation('input')
}
const handleChange = ()=>{
  emits('change', innerValue.value);
  runValidation('change')
}
const handleFocus = (event: FocusEvent)=>{
  isFocus.value = true;
  emits('focus', event);
}
const handleBlur = (event: FocusEvent)=>{
  isFocus.value = false;
  emits('blur', event);
  runValidation('blur');
}
const clear = ()=>{
  innerValue.value = "";
  emits('update:modelValue', "");
  emits('clear')
  emits('input', '')
  emits('change', '')
}
watch(()=>props.modelValue, (newValue)=>{
  innerValue.value = newValue;
})

const passwordVisible = ref(false);
const showPasswordArea = computed(()=>
  props.showPassword &&
  !props.disabled &&
  !!innerValue.value
)
const togglePasswordVisible = ()=>{
  passwordVisible.value = !passwordVisible.value;
}
defineExpose({
  ref:inputRef
})
defineOptions({
  name: "VkInput",
  inheritAttrs: false,
})
</script>

<template>
<div
  class="vk-input"
  :class="{
    [`vk-input--${type}`]:type,
    [`vk-input--${size}`]:size,
    'is-disabled': disabled,
    'is-prepend': $slots.prepend,
    'is-append': $slots.append,
    'is-prefix': $slots.prefix,
    'is-suffix': $slots.suffix,
    'is-focus': isFocus
  }"
>
<!--  input-->
  <template v-if="type !== 'textarea'">
<!--    prepend slot-->
    <div v-if="$slots.prepend" class="vk-input__prepend">
      <slot name="prepend"></slot>
    </div>
    <div class="vk-input__wrapper">
<!--      prefix slot-->
      <span v-if="$slots.prefix" class="vk-input__prefix">
        <slot name="prefix"></slot>
      </span>
<!--      input slot-->
      <input
        class="vk-input__inner"
        v-bind="attrs"
        ref="inputRef"
        :type="showPassword?(passwordVisible?'text':'password'):type"
        :disabled="disabled"
        :readonly="readonly"
        :auto-complete="autoComplete"
        :placeholder="placeholder"
        :auto-focus="autoFocus"
        :form="form"
        v-model="innerValue"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >
<!--      suffix slot-->
      <span v-if="$slots.suffix || showClear || showPasswordArea" class="vk-input__suffix" @click="keepFocus">
        <slot name="suffix"></slot>
        <Icon
          icon="circle-xmark"
          v-if="showClear"
          class="vk-input__clear"
          @mousedown.prevent="clear"
        ></Icon>
        <Icon
          icon="eye"
          v-if="showPasswordArea && passwordVisible"
          class="vk-input__password"
          @click="togglePasswordVisible"
        ></Icon>
        <Icon
          icon="eye-slash"
          v-if="showPasswordArea && !passwordVisible"
          class="vk-input__password"
          @click="togglePasswordVisible"
        ></Icon>
      </span>
    </div>
<!--    append slot-->
    <div v-if="$slots.append" class="vk-input__append">
      <slot name="append"></slot>
    </div>
  </template>
<!--  textarea-->
  <template v-else>
    <textarea
      class="vk-textarea__wrapper"
      ref="inputRef"
      v-bind="attrs"
      :disabled="disabled"
      v-model="innerValue"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    ></textarea>
  </template>
</div>
</template>

<style scoped>

</style>
