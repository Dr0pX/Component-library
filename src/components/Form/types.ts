import type { InjectionKey } from "vue";
import type { RuleItem, ValidateError, ValidateFieldsError } from "async-validator";

export interface FormItemProps {
  label: string;
  prop?: string;
}

export interface FormItemRule extends RuleItem{
  trigger?: string;
}
export type FormRules = Record<string, FormItemRule[]>

export interface FormProps {
  model: Record<string, any>;
  rules: Record<string, any>;
}

export interface FormContext extends FormProps{
  addField: (field: FormItemContext) => void;
  removeField: (field: FormItemContext) => void;
}
export interface ValidateStatusProp{
  state: 'init' | 'success' | 'error';
  errorMsg: string;
  loading: boolean;
}
export interface FormItemContext {
  prop: string;
  validate: (trigger?: string) => Promise<any>;
  resetField(): void;
  clearValidate(): void;
}
export interface FormValidateFailure {
  errors: ValidateError[] | null;
  fields: ValidateFieldsError;
}

export interface FormInstance {
  validate: () => Promise<any>;
  resetField: (props?: string[]) => void;
  clearValidate: (props?: string[]) => Promise<any>;
}
export interface FormItemInstance {
  ValidateStatus: ValidateStatusProp;
  validate: (trigger?: string) => Promise<any>;
  resetField(): void;
  clearValidate(): void;
}
export const formContextkey: InjectionKey<FormContext> = Symbol('formContextKey')
export const formItemContextkey: InjectionKey<FormItemContext> = Symbol('formItemContextKey')
