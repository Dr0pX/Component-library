<script setup lang="ts">
import VkIcon from "@/components/Icon/Icon.vue";
import type {ButtonProps} from "@/components/Button/types.ts";
// import type {ButtonProps} from "./types.ts";
import {ref} from "vue";

withDefaults(defineProps<ButtonProps>(), {
  nativeType:'button'
})

const _ref = ref<HTMLButtonElement>()
defineExpose({
  ref:_ref,
})

// 直接在这里定义名字，不需要再另写一个 <script>
defineOptions({
  name: 'VkButton'
})
</script>
<!--<script lang="ts">-->
<!--  import {defineComponent} from "vue";-->
<!--  export default defineComponent({-->
<!--    name: "vkButton",-->
<!--  })-->
<!--</script>-->
<template>
  <button
    ref="_ref"
    class="vk-button"
    :class="{
      [`vk-button--${type}`]:type,
      [`vk-button--${size}`]:size,
      'is-plain':plain,
      'is-round':round,
      'is-circle':circle,
      'is-disabled':disabled,
      'is-loading':loading,
    }"
    :disabled="disabled || loading"
    :auto-focus="autoFocus"
    :type="nativeType"
  >
    <VkIcon icon="spinner" spin v-if="loading"></VkIcon>
    <VkIcon :icon="icon" v-if="icon"></VkIcon>
    <span>
      <slot>

      </slot>
    </span>

  </button>
</template>

<style scoped>

</style>
