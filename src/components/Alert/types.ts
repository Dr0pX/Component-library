
export interface AlertProps{
  content?:string,
  type?:'primary' | 'success' | 'info' | 'warning' | 'danger',
  effect?:  'light' | 'dark',
  closable: boolean,
}

export interface AlertEmits {
  (e:'close') : void,
}

export interface AlertInstance{
  close:()=>void,
}
