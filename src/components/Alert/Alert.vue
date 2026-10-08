<script setup lang="ts">
  import type { AlertProps, AlertEmits, AlertInstance } from "@/components/Alert/types.ts";
  import Icon from "@/components/Icon/Icon.vue";
  import {ref} from "vue";

  const props = defineProps<AlertProps>();
  const emit = defineEmits<AlertEmits>();

  const visible = ref(true);
  const close = ()=>{
    visible.value = false;
    emit('close');
  }
  defineExpose<AlertInstance>({
    close,
  })

  defineOptions({
    name:'VkAlert',
  })
</script>

<template>
  <Transition name="vk-alert-fade">
    <div
      v-if="visible"
      class="vk-alert"
      :class="{
        [`vk-alert--${type || 'primary'}`]: true,
        [`vk-alert--${effect || 'light'}`]: true,
      }"
    >
      <span class="vk-alert--content">
        <slot>{{ content }}</slot>
      </span>
      <Icon
        v-if="closable"
        icon="fa-xmark"
        @click="close"
      />
    </div>
  </Transition>
</template>

<style scoped>

</style>
