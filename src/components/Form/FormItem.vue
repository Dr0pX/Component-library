<script setup lang="ts">
import type { FormItemProps, FormValidateFailure, FormItemContext, ValidateStatusProp, FormItemInstance } from "@/components/Form/types.ts";
import { formContextkey, formItemContextkey } from "@/components/Form/types.ts";
import {computed, inject, reactive, provide, onMounted, onUnmounted} from "vue";
import { isNil } from "lodash-es";
import Schema from "async-validator";

const props = defineProps<FormItemProps>()

const formContext = inject(formContextkey)
let initialValue:unknown = null;
const innerValue = computed(()=>{
  const model = formContext?.model;
  if(model && props.prop && !isNil(model[props.prop])){
    return model[props.prop];
  } else{
    return null;
  }
})
const itemRules = computed(()=>{
  const rules = formContext?.rules;
  if (rules && props.prop && rules[props.prop]){
    return rules[props.prop];
  }else {
    return [];
  }
})

const getTriggeredRules = (trigger?:string)=>{
  const rules = itemRules?.value;
  if (rules){
    return rules.filter((rule:any) => {
      if (!rule.trigger || !trigger) return true;
      return rule.trigger && rule.trigger === trigger
    })
  }else {
    return [];
  }
}
const validateStatus:ValidateStatusProp = reactive({
  state: 'init',
  errorMsg: '',
  loading: false,
})
const validate = async (trigger?:string)=>{
  const modelName = props.prop;
  const triggeredRules = getTriggeredRules(trigger);
  if(triggeredRules.length === 0){
    return true;
  }
  if(modelName) {
    const validator = new Schema({
      [modelName] : triggeredRules,
    })
    validateStatus.loading = true;
    return validator.validate({[modelName]:innerValue.value})
      .then(()=>{
        validateStatus.state = 'success'
      })
      .catch((e: FormValidateFailure)=>{
        const { errors } = e;
        validateStatus.state = 'error';
        validateStatus.errorMsg = (errors && errors.length>0)? errors[0]?.message || "" : '';
        console.log(e.errors)
        return Promise.reject(e);
      })
      .finally(()=>{
        validateStatus.loading = false;
      })
  }
}
const clearValidate = ()=>{
  validateStatus.state = 'init';
  validateStatus.errorMsg = '';
  validateStatus.loading = false;
}
const resetField = ()=>{
  clearValidate();
  const model = formContext?.model;
  if(model && props.prop && !isNil(model[props.prop])){
    model[props.prop] = initialValue;
  }
}
const context: FormItemContext = {
  prop: props.prop || "",
  validate,
  clearValidate,
  resetField,
}
provide(formItemContextkey, context);

onMounted(()=>{
  if(props.prop){
    formContext?.addField(context);
    initialValue = innerValue.value
  }
})
onUnmounted(()=>{
  formContext?.removeField(context);
})

defineExpose<FormItemInstance>({
  validateStatus,
  validate,
  resetField,
  clearValidate,
})
defineOptions({
  name:"VkFormItem",
})
</script>

<template>
<div
  class="vk-form-item"
  :class="{
    'is-error': validateStatus.state === 'error',
    'is-success': validateStatus.state === 'success',
    'is-loading': validateStatus.loading,
  }"
>
  <label class="vk-form-item__label">
    <slot name="label" :label="label">
      {{label}}
    </slot>
  </label>
  <div class="vk-form-item__content">
    <slot :validate="validate"></slot>
    <div class="vk-form-item__error-msg" v-if="validateStatus.state==='error'">
      {{validateStatus.errorMsg}}
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
