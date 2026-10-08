<script setup lang="ts">
  import VkIcon from "@/components/Icon/Icon.vue";
  import type {CollapseItemProps} from "@/components/Collapse/types.ts";
  import {computed, inject} from "vue";
  import {collapseContextKey} from "@/components/Collapse/types.ts";

  const collapseContext = inject(collapseContextKey)
  const props = defineProps<CollapseItemProps>();
  const isActive = computed(()=> collapseContext?.activeNames.value.includes(props.name))
  const handleClick = ()=>{
    if (props.disabled){ return };
    collapseContext?.handleItemClick(props.name)
  }

  const transitionEvents: Record<string, (el: HTMLElement)=>void> = {
    beforeEnter(el){
      el.style.height = '0px'
      el.style.overflow = 'hidden'
    },
    enter(el){
      el.style.height = `${el.scrollHeight}px`
    },
    afterEnter(el){
      el.style.height = ''
      el.style.overflow = ''
    },
    beforeLeave(el) {
      // 离开前，先把 height 从 auto 变成具体的像素值，否则无法做减法动画
      el.style.height = `${el.scrollHeight}px`
      el.style.overflow = 'hidden'
    },
    leave(el) {
      // 强制触发重绘，然后设为 0
      el.style.height = '0px'
    },
    afterLeave(el) {
      // 动画结束，清理现场
      el.style.height = ''
      el.style.overflow = ''
    }
  }

  defineOptions({
    name: "VkCollapseItem",
  })
</script>

<template>
  <div class="vk-collapse-item" :class="{ 'is-disabled': disabled}">

    <div class="vk-collapse-item__header"
      :class="{
        'is-disabled':disabled,
        'is-active': isActive
      }"
      :id="`item-header-${name}`"
      @click="handleClick"
    >
      <slot name="title">{{title}}</slot>
      <VkIcon icon="angle-right" class="header-angle"></VkIcon>
    </div>
<!--    也可以一次性绑定-->
<!--    <Transition name="slide" v-on="transitionEvents">-->
    <Transition
      name="slide"
      @before-enter="transitionEvents.beforeEnter"
      @enter="transitionEvents.enter"
      @after-enter="transitionEvents.afterEnter"
      @before-leave="transitionEvents.beforeLeave"
      @leave="transitionEvents.leave"
      @after-leave="transitionEvents.afterLeave"
    >
      <div class="vk-collapse-item__wrapper" v-show="isActive">
        <div class="vk-collapse-item__content" :id="`item-content-${name}`">
<!--          <div class="vk-collapse-item__wrapper">-->
            <slot></slot>
<!--          </div>-->
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/*.vk-collapse-item__header{
  font-size: 30px;
}*/
</style>
