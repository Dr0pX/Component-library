<script setup lang="ts">
import type { ValidateFieldsError } from "async-validator";
import type { FormProps, FormItemContext, FormContext, FormValidateFailure, FormInstance } from "@/components/Form/types.ts";
import { formContextkey } from "@/components/Form/types.ts";
import {provide} from "vue";

const props = defineProps<FormProps>()

const fields: FormItemContext[] = [];
const addField: FormContext['addField'] = (field)=>{
  fields.push(field)
}
const removeField: FormContext['removeField'] = (field)=>{
  if(field.prop){
    fields.splice(fields.indexOf(field), 1);
  }
}
provide(formContextkey, {
  ...props,
  addField,
  removeField,
})

const resetFields = (keys: string[] = []) => {
  // 加上 : FormItemContext
  const filterArr = keys.length > 0 ? fields.filter((field: FormItemContext) => keys.includes(field.prop)) : fields;
  filterArr.forEach(field => field.resetField())
}

const clearValidate = (keys: string[] = []) => {
  // 加上 : FormItemContext
  const filterArr = keys.length > 0 ? fields.filter((field: FormItemContext) => keys.includes(field.prop)) : fields;
  filterArr.forEach(field => field.clearValidate())
}
const validate = async ()=>{
  let validationErrors:ValidateFieldsError = {};
  console.log('fields', fields)
  for (const field of fields){
    try {
      await field.validate("");
    }catch (e){
      const error = e as FormValidateFailure;
      validationErrors = {
        ...validationErrors,
        ...error.fields
      }
    }
  }
  if (Object.keys(validationErrors).length === 0) return true;
  return Promise.reject(validationErrors);
}

defineExpose<FormInstance>({
  validate,
  resetFields,
  clearValidate,
})

defineOptions({
  name: "VkForm",
})
</script>

<template>
  <form class="vk-form" action="">
    <slot></slot>
  </form>
</template>

<style scoped>

</style>
