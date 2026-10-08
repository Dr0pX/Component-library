<script setup lang="ts">
import type { SelectOption, SelectProps, SelectEmits, SelectStates } from "@/components/Select/types.ts";
import Tooltip from "@/components/Tooltip/Tooltip.vue";
import type { TooltipInstance } from "@/components/Tooltip/types.ts";
import Input from "@/components/Input/Input.vue";
import {computed, reactive, type Ref, ref, watch} from "vue";
import { isFunction, debounce } from "lodash-es";
import type { InputInstance } from "@/components/Input/types.ts";
import Icon from "@/components/Icon/Icon.vue";
import RenderVnode from "@/components/Common/RenderVnode.ts";

const props = withDefaults(defineProps<SelectProps>(), {
  options: ()=>[],
});
const emits = defineEmits<SelectEmits>()

const findOption = (value: string) => {
  const option = props.options.find(option => option.value === value);
  return option ? option : null
}
const initialOption = findOption(props.modelValue);

const states = reactive<SelectStates>({
  inputValue: initialOption? initialOption.label : "",
  selectedOptions: initialOption,
  mouseHover: false,
  loading:false,
  highlightIndex: -1,
})

const filterOptions = ref(props.options);
watch(()=>props.modelValue, (newVal) => {
  // 1. 根据新的 modelValue 找到对应的 Option 对象
  const updatedOption = findOption(newVal);
  // 2. 同步内部状态
  states.selectedOptions = updatedOption;
  // 3. 同步输入框显示的文字
  // 注意：只有在非展开状态下才强制同步，或者根据你的业务逻辑决定
  states.inputValue = updatedOption ? updatedOption.label : "";

  // 4. (可选) 更新选中的高亮索引，让键盘操作能从正确的位置开始
  if (updatedOption) {
    states.highlightIndex = filterOptions.value.findIndex(opt => opt.value === newVal);
  } else {
    states.highlightIndex = -1;
  }
}, { immediate: true }); // 建议加上 immediate，确保初始化时逻辑也是一致的
const tooltipRef = ref() as Ref<TooltipInstance>
const isDropdownShow = ref(false);
const controlDropdown = (show: boolean) =>{
  if (show){
    if(props.filterable && states.selectedOptions){
      states.inputValue = '';
    }
    if(props.filterable){
      generateFilterOptions(states.inputValue);
    }
    tooltipRef.value.show();
  }else {
    tooltipRef.value.hide();
    if(props.filterable){
      states.inputValue = states.selectedOptions? states.selectedOptions.label : "";
    }
    states.highlightIndex = -1;
  }
  isDropdownShow.value = show;
  emits('visible-change', show);
}
const toggleDropdown = ()=>{
  if(props.disabled) return;
  if(isDropdownShow.value){
    controlDropdown(false);
  }else {
    controlDropdown(true);
  }
}

const handleKeyDown = (e: KeyboardEvent)=>{
  switch (e.key){
    case 'Enter':
      if (!isDropdownShow.value){
        controlDropdown(true);
      }else {
        if(states.highlightIndex > -1 && filterOptions.value[states.highlightIndex]){
          itemSelect(filterOptions.value[states.highlightIndex]!);
        }else {
          controlDropdown(false);
        }
      }
      break;
    case 'Escape':
      if(isDropdownShow.value){
        controlDropdown(false);
      }
      break;
    case 'ArrowUp':
      e.preventDefault()
      if(filterOptions.value.length > 0){
        if (states.highlightIndex === -1 || states.highlightIndex === 0){
          states.highlightIndex = filterOptions.value.length - 1;
        }else {
          states.highlightIndex--;
        }
      }
      break;
    case 'ArrowDown':
      e.preventDefault()
      if(filterOptions.value.length > 0){
        if (states.highlightIndex === -1 || states.highlightIndex === filterOptions.value.length - 1){
          states.highlightIndex = 0;
        }else {
          states.highlightIndex++;
        }
      }
      break;
    default:
  }
}

const inputRef = ref() as Ref<InputInstance>
const showClearIcon= computed(()=>{
  return props.clearable &&
    states.mouseHover &&
    states.selectedOptions &&
    states.inputValue.trim()!==""
})
const onClear = ()=>{
  states.selectedOptions = null;
  states.inputValue = "";
  emits('clear');
  emits('change', "");
  emits('update:modelValue', "");
}

const itemSelect = (e: SelectOption) => {
  if(e.disabled) return;
  states.inputValue = e.label;
  states.selectedOptions = e;
  emits('change', e.value);
  emits('update:modelValue', e.value);
  controlDropdown(false);
  inputRef.value.ref.focus();
}

const popperOptions: any = {
  modifiers:[
    {
      name:'offset',
      options:{
        offset:[0, 9]
      },
    },
    {
      name: "sameWidth",
      enabled: true,
      fn: ({ state }: { state: any }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`;
      },
      phase: "beforeWrite",
      requires: ["computeStyles"],
    }
  ],
}

watch(()=> props.options, ()=>{
  filterOptions.value = props.options;
})
const generateFilterOptions = async (searchValue: string)=>{
  if(!props.filterable) return;
  if(props.filterMethod && isFunction(props.filterMethod)){
    filterOptions.value = props.filterMethod(searchValue);
  }else if(props.remote && props.remoteMethod && isFunction(props.remoteMethod)){
    states.loading = true;
    try {
      filterOptions.value = await props.remoteMethod(searchValue);
    } catch (e){
      console.error(e);
      filterOptions.value = [];
    } finally {
      states.loading = false;
    }
  }else {
    filterOptions.value = props.options.filter(option=>option.label.includes(searchValue))
  }
  states.highlightIndex = -1;
}
const onFilter = ()=>{
  generateFilterOptions(states.inputValue)
}
const filteredPlaceholder = computed(()=>{
  return (props.filterable && states.selectedOptions && isDropdownShow.value)?
    states.selectedOptions.label : props.placeholder
})
const timeout = computed(()=>props.remote? 300 : 0);
const debounceOnFilter = debounce(()=>{
  onFilter()
}, timeout.value)


defineOptions({
  name: "VkSelect",
})
</script>

<template>
<div
  class="vk-select"
  :class="{
    'is-disabled': disabled,
  }"
  @click="toggleDropdown"
  @mouseenter="states.mouseHover=true"
  @mouseleave="states.mouseHover=false"
>
  <Tooltip
    placement="bottom-start"
    ref="tooltipRef"
    :popper-options="popperOptions"
    manual
    @click-outside="controlDropdown(false)"
  >
    <Input
      v-model="states.inputValue"
      ref="inputRef"
      :disabled="disabled"
      :placeholder="filteredPlaceholder"
      :readonly="!filterable || !isDropdownShow"
      @input="debounceOnFilter"
      @keydown="handleKeyDown"
    >
      <template #suffix>
        <Icon icon="circle-xmark" v-if="showClearIcon" class="vk-input__clear" @mousedown.prevent="onClear"></Icon>
        <Icon icon="angle-down" v-else class="header-angle" :class="{'is-active': isDropdownShow}"></Icon>
      </template>
    </Input>
    <template #content>
      <div class="vk-select__loading" v-if="states.loading">
        <Icon icon="spinner"></Icon>
      </div>
      <div class="vk-select__nodata" v-else-if="filterable && filterOptions.length===0">
        no matching data...
      </div>
      <ul class="vk-select__menu">
        <template v-for="(item, index) in filterOptions" :key="index">
          <li
            class="vk-select__menu-item"
            :class="{
            'is-disabled': item.disabled,
            'is-selected':states.selectedOptions?.value === item.value,
            'is-highlighted': states.highlightIndex===index,
          }"
            :id="`select-item-${item.value}`"
            @click.stop="itemSelect(item)"
          >
            <RenderVnode :vNode="renderLabel? renderLabel(item) : item.label"></RenderVnode>
<!--            {{item.label}}-->
          </li>
        </template>
      </ul>
    </template>
  </Tooltip>
</div>
</template>

<style scoped>

</style>
