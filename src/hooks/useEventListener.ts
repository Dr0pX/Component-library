import { onMounted, onBeforeMount, isRef, watch, unref } from "vue";
import type { Ref } from 'vue';
export default function useEventListener(
  target: Ref<EventTarget | null> | EventTarget,
  event:string,
  handler:(event:Event) => any,
) {
  if(isRef(target)){
    watch(target, (oldValue, newValue) => {
      oldValue?.removeEventListener(event, handler);
      newValue?.addEventListener(event, handler);
    })
  }else {
    onMounted(()=>{
      target.addEventListener(event, handler);
    })
  }
  onBeforeMount(() => {
    unref(target)?.removeEventListener(event, handler)
  })
}
