import { computed, shallowRef, toRaw, type ComputedRef } from "vue";
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { DefaultRow } from 'element-plus-pro-components/packages/types/table'
import { useProLocale } from 'element-plus-pro-components/packages/locale'
import { useInitialValues } from './useForm'
import type {
  ActionConfig,
  EditableColumnsConfig,
  EditableProTableProps,
  NewLineConfig,
  RecordCreatorProps,
  RecordKey,
  TableRowEditable,
} from "../editable-pro-table";

export function useRecordCreatorProps(
  props: EditableProTableProps
): ComputedRef<RecordCreatorProps | false> {
  const { t } = useProLocale()

  return computed(() => {
    const defaultRecordCreatorProps: RecordCreatorProps = {
      position: 'bottom',
      newRecordType: 'cache',
      creatorButtonText: t('elProComponents.editableProTable.add'),
      onlyAddOneLineAlertMessage: t('elProComponents.editableProTable.onlyAddOneLine'),
    }

    const { recordCreatorProps } = props
    if (recordCreatorProps) {
      if (typeof recordCreatorProps === 'object') {
        return {
          ...defaultRecordCreatorProps,
          ...recordCreatorProps,
        }
      }

      return defaultRecordCreatorProps
    }

    return false
  })
}

export function useColumns(props: EditableProTableProps) {
  return computed(() => {
    return props.columns.filter(item => !item.hideInTable)
  })
}

export function useEditable(props: EditableProTableProps): ComputedRef<TableRowEditable> {
  const { t } = useProLocale()

  return computed((): TableRowEditable => {
    const defaultEditable = {
      type: 'single',
      saveText: t('elProComponents.editableProTable.save'),
      deleteText: t('elProComponents.editableProTable.delete'),
      cancelText: t('elProComponents.editableProTable.cancel'),
      deletePopconfirmMessage: t('elProComponents.editableProTable.deleteThisLine'),
      onlyOneLineEditorAlertMessage: t('elProComponents.editableProTable.onlyOneLineEditor'),
    } satisfies TableRowEditable

    const { type, ...rest } = props.editable ?? {}
    return {
      ...defaultEditable,
      ...rest,
      type: (type ?? defaultEditable.type) as TableRowEditable['type'],
    }
  })
}

export function useTableProps(props: EditableProTableProps) {
  return computed(() => {
    const { rowKey, tableProps = {}, defaultSize: size } = props
    return {
      ...tableProps,
      rowKey,
      size,
    }
  })
}

export function useEditableTable(
  props: EditableProTableProps,
  form: Record<string, DefaultRow[]>,
  getFormRef: () => FormInstance | undefined,
  initializedEditable: ComputedRef<TableRowEditable>,
  initializedCreatorProps: ComputedRef<RecordCreatorProps | false>,
  initializedColumns: ComputedRef<EditableColumnsConfig[]>,
) {
  const preEditRows = shallowRef(new Map<RecordKey, DefaultRow>())
  const newLineRecordCache = shallowRef<NewLineConfig | undefined>()

  const getDataSource = () => form[props.name]

  const getRowRecordKey = (row: DefaultRow) =>
    typeof props.rowKey === 'string' ? row[props.rowKey] as RecordKey : undefined

  const isSameRecordKey = (row: DefaultRow, recordKey: RecordKey) =>
    typeof props.rowKey === 'string' ? row[props.rowKey] == recordKey : false

  const findRowIndex = (recordKey: RecordKey) =>
    getDataSource().findIndex(item => isSameRecordKey(item, recordKey))

  const getInitialValues = () => useInitialValues(initializedColumns.value)

  const findRecordByKey = (recordKey: RecordKey): DefaultRow => {
    const record = getDataSource().find(item => isSameRecordKey(item, recordKey))
    if (!record) {
      return {} as DefaultRow
    }
    return structuredClone(toRaw(record)) as DefaultRow
  }

  const getValidateFields = (index: number) => {
    return props.columns
      .filter((item) => {
        if (item.hideInTable || item.valueType === 'option' || !item.prop) {
          return false
        }
        return Boolean(item.valueType || item.renderField)
      })
      .map(item => `${props.name}.${index}.${item.prop}`)
  }

  const validateRow = async (index: number): Promise<boolean> => {
    const fields = getValidateFields(index)
    const formInstance = getFormRef()
    if (!fields.length || !formInstance) {
      return true
    }

    const results = await Promise.all(
      fields.map(field => new Promise<boolean>((resolve) => {
        formInstance.validateField(field, (valid) => resolve(valid));
      }))
    );
    return results.every(Boolean);
  }

  const validateCanStartEdit = () => {
    const { type, editableKeys, onlyOneLineEditorAlertMessage } = initializedEditable.value
    if (editableKeys?.length && type === 'single') {
      ElMessage.warning(onlyOneLineEditorAlertMessage)
      return false
    }
    return true
  }

  const clearEditableState = (recordKey: RecordKey) => {
    const { editableKeys, onChange } = initializedEditable.value
    if (!editableKeys?.includes(recordKey)) {
      return true
    }
    const newKeys = editableKeys.filter(item => item !== recordKey)
    onChange?.(newKeys, [])
    return true
  }

  const clearNewLineCache = (recordKey: RecordKey) => {
    if (newLineRecordCache.value?.options.recordKey === recordKey) {
      newLineRecordCache.value = undefined
    }
  }

  const filterByRecordKey = (recordKey: RecordKey) => {
    const index = findRowIndex(recordKey)
    if (index !== -1) {
      getDataSource().splice(index, 1)
    }
  }

  const setRowData = (rowIndex: number | RecordKey, data: DefaultRow) => {
    const dataSource = getDataSource()
    if (typeof rowIndex === 'number' && rowIndex < dataSource.length) {
      dataSource.splice(rowIndex, 1, { ...dataSource[rowIndex], ...data })
      return
    }
    const index = dataSource.findIndex(item => isSameRecordKey(item, rowIndex as RecordKey))
    if (index !== -1) {
      dataSource.splice(index, 1, { ...dataSource[index], ...data })
    }
  }

  const getRowData = (rowIndex: number | RecordKey) => {
    const dataSource = getDataSource()
    if (typeof rowIndex === 'number' && rowIndex < dataSource.length) {
      return dataSource[rowIndex]
    }
    return dataSource.find(item => isSameRecordKey(item, rowIndex as RecordKey))
  }

  const getRowsData = () => getDataSource()

  const deleteOrResetRow = (recordKey: RecordKey, index: number) => {
    const creatorProps = initializedCreatorProps.value
    const preEditRow = preEditRows.value.get(recordKey)

    if (preEditRow) {
      const rowIndex = findRowIndex(recordKey)
      if (rowIndex !== -1) {
        getDataSource().splice(rowIndex, 1, preEditRow)
      }
      return
    }

    if (creatorProps && creatorProps.newRecordType !== 'dataSource') {
      filterByRecordKey(recordKey)
      return
    }

    if (creatorProps) {
      const dataSource = getDataSource()
      const { record } = creatorProps
      const newRecord = {
        ...getInitialValues(),
        ...(typeof record === 'function' ? record(index, dataSource) : record),
      }
      if (typeof props.rowKey === 'string') {
        delete newRecord[props.rowKey]
      }
      setRowData(index, newRecord)
    }
  }

  const cancelEditable: ActionConfig['cancelEditable'] = async (recordKey) => {
    try {
      const editRow = getRowData(recordKey)
      const originRow = preEditRows.value.get(recordKey)
      if (editRow) {
        await props.editable?.onCancel?.(recordKey, editRow, originRow)
      }
      clearEditableState(recordKey)
      clearNewLineCache(recordKey)
    } catch (err) {
      console.error('err', err)
    }
    return true
  }

  const startEditable: ActionConfig['startEditable'] = (recordKey) => {
    if (!validateCanStartEdit()) {
      return false
    }

    const { editableKeys, onChange } = initializedEditable.value
    const isAlreadyEditable = editableKeys?.some(key => key === recordKey)

    if (!isAlreadyEditable) {
      onChange?.([...(editableKeys ?? []), recordKey], [])
      preEditRows.value.set(recordKey, findRecordByKey(recordKey))
    }

    return true
  }

  const addEditRecord: ActionConfig['addEditRecord'] = (record, newLine) => {
    const creatorProps = initializedCreatorProps.value
    if (!creatorProps) {
      return
    }

    if (newLineRecordCache.value) {
      ElMessage.warning(creatorProps.onlyAddOneLineAlertMessage)
      return
    }

    if (!validateCanStartEdit()) {
      return
    }

    const { position, newRecordType, record: defaultRecord } = creatorProps
    const dataSource = getDataSource()
    const newLineConfig = {
      position,
      newRecordType,
      ...(newLine || {}),
    }
    const rowIndex = newLineConfig.position === 'top' ? dataSource.length : 0
    const rowRecord = record ?? defaultRecord
    const newRecord = {
      ...getInitialValues(),
      ...(typeof rowRecord === 'function' ? rowRecord(rowIndex, dataSource) : rowRecord),
    }

    const recordKey = getRowRecordKey(newRecord)
    if (recordKey == null || recordKey === '') {
      console.error('Error: 请设置 recordCreatorProps.record 并返回一个唯一的key')
      return
    }

    if (newLineConfig.newRecordType !== 'dataSource') {
      newLineRecordCache.value = {
        defaultValue: structuredClone(newRecord),
        options: {
          ...newLineConfig,
          recordKey,
        },
      }
    } else {
      newLineRecordCache.value = undefined
    }

    if (newLineConfig.position === 'top') {
      dataSource.unshift(newRecord)
    } else {
      dataSource.push(newRecord)
    }

    const { editableKeys, onChange } = initializedEditable.value
    const newKeys = [...(editableKeys ?? []), recordKey]
    const editableRows = dataSource.filter(item =>
      editableKeys?.some(key => isSameRecordKey(item, key))
    )
    onChange?.(newKeys, editableRows)
  }

  const actions: ActionConfig = {
    startEditable,
    cancelEditable,
    addEditRecord,
  }

  return {
    preEditRows,
    newLineRecordCache,
    actions,
    validateRow,
    filterByRecordKey,
    deleteOrResetRow,
    addEditRecord,
    getRowRecordKey,
    getRowData,
    getRowsData,
    setRowData,
  }
}
