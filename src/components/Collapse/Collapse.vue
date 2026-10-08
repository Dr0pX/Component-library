<script setup lang="ts">
  import {ref, provide, watch} from 'vue';
  import type {NameType, CollapseProps, CollapseEmits} from "@/components/Collapse/types.ts";
  import {collapseContextKey} from "@/components/Collapse/types.ts";

  const props = defineProps<CollapseProps>();
  const emits = defineEmits<CollapseEmits>();
  const activeNames = ref<NameType[]>(props.modelValue);
  watch(()=>props.modelValue,()=>{
    activeNames.value = props.modelValue;
  })
  if (props.accordion && activeNames.value.length>1){
    console.warn('accordion mode should only have one active item')
  }
  const handleItemClick = (item: NameType) => {
    let _activeName = [...activeNames.value];
    if (props.accordion){
      _activeName = [activeNames.value[0] === item?'':item]
      activeNames.value = _activeName
    }else {
      const index = _activeName.indexOf(item)
      if (index > -1) {
        // 存在，删除数组对应一项
        _activeName.splice(index, 1)
      } else {
        // 不存在，插入对应的name
        _activeName.push(item)
      }
      activeNames.value = _activeName
    }
    emits('update:modelValue', _activeName);
    emits('change', _activeName);
  }
  provide(collapseContextKey,{
    activeNames,
    handleItemClick
  })

  defineOptions({
    name: "VkCollapse",
  })
</script>

<template>
  <div class="vk-collapse">
    <slot></slot>
  </div>
</template>

<style scoped>

</style>
