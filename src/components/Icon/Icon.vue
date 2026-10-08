<script setup lang="ts">
  import type { FontAwesomeIconProps } from "./types.ts"
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import {omit} from "lodash-es";
  import {computed} from "vue";

  const props = defineProps<FontAwesomeIconProps>()
  const filterProps = computed(()=>omit(props, ['type', 'color']))
  const customStyles = computed(()=>{
    return props.color?{color:props.color}:{}
  })

  defineOptions({
    name:'VkIcon',
    inheritAttrs:false
  })
</script>

<template>
<i class="vk-icon" :class="{[`vk-icon--${type}`]:type}" :style="customStyles" v-bind="$attrs">
  <font-awesome-icon v-bind="filterProps"></font-awesome-icon>
</i>
</template>

<style scoped>

</style>
