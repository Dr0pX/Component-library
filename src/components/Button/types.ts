export type ButtonType = 'primary' | 'success' | 'info' | 'warning' | 'danger'
export type ButtonSize = 'small' | 'large'
export type NativeType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  size?: ButtonSize;
  type?: ButtonType;
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  nativeType?: NativeType;
  icon?: string;
  loading?: boolean;
}

export interface ButtonInstance {
  ref:HTMLButtonElement
}
