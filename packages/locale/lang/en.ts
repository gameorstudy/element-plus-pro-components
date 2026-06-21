import type zhCn from './zh-cn'

const en = {
  elProComponents: {
    placeholder: {
      input: 'Please enter',
      select: 'Please select',
      selectTime: 'Select time',
      selectDate: 'Select date',
    },
    proForm: {
      reset: 'Reset',
      submit: 'Submit',
    },
    dialogForm: {
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    proTable: {
      expand: 'Expand',
      collapse: 'Collapse',
      search: 'Search',
      reset: 'Reset',
    },
    tableToolBar: {
      columnSetting: 'Settings',
      reset: 'Reset',
      columnDisplay: 'Column Display',
      leftPin: 'Pin to left',
      rightPin: 'Pin to right',
      noPin: 'Unpinned',
      leftFixedTitle: 'Fixed the left',
      rightFixedTitle: 'Fixed the right',
      noFixedTitle: 'Not Fixed',
    },
    editableProTable: {
      add: 'add a row of data',
      onlyAddOneLine: 'Only one line can be added',
      save: 'Save',
      delete: 'Delete',
      cancel: 'Cancel',
      deleteThisLine: 'Delete this line?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      onlyOneLineEditor: 'Only one line can be edited',
    },
  },
} satisfies typeof zhCn

export default en
