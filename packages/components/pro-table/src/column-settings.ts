export interface ColumnSettingsRule {
  prop?: string
  fixed?: boolean | string
  checkable: boolean
  index: number
}

export interface SettingColumns extends ColumnSettingsRule {
  label?: string
  disabled?: boolean
}

export interface ColumnSettingsChangePayload {
  event: string;
  prop?: string;
  checked?: boolean;
  fixed?: string;
  fromProp?: string;
  toProp?: string;
  isAfter?: boolean;
}

export type OnColumnSettingsChange = (data: ColumnSettingsChangePayload) => void