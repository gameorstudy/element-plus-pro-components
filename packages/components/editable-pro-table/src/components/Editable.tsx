import type { DefaultRow } from 'element-plus-pro-components/packages/types/table'
import { computed, defineComponent, Fragment, ref, type PropType, type VNode } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { useProLocale } from 'element-plus-pro-components/packages/locale'
import type {
  ActionConfig,
  ActionRenderConfig,
  ActionRenderDefaultDom,
  EditableProTableProps,
  NewLineConfig,
  RecordKey,
  TableRowEditable,
} from '../editable-pro-table'
import './editable.less'
import type { TableColumnCtx } from 'element-plus'

type Render = (actions: ActionConfig) => VNode | VNode[] | undefined

export default defineComponent({
  name: 'Editable',
  props: {
    editable: {
      type: Object as PropType<TableRowEditable>,
      required: true,
    },
    actions: {
      type: Object as PropType<ActionConfig>,
    },
    validateRow: {
      type: Function as PropType<(index: number) => Promise<boolean> | boolean>,
    },
    recordKey: {
      type: [String, Number] as PropType<RecordKey>,
    },
    render: {
      type: Function as PropType<Render>,
      required: true,
    },
    scope: {
      type: Object as PropType<{ row: DefaultRow; $index: number; column: TableColumnCtx }>,
    },
    newLineRecordCache: {
      type: Object as PropType<NewLineConfig>,
    },
    name: {
      type: String,
    },
    preEditRows: {
      type: Object as PropType<Map<RecordKey, DefaultRow>>,
    },
    defaultSize: {
      type: String as PropType<EditableProTableProps['defaultSize']>,
    },
  },
  emits: ['delete', 'cancel'],
  setup(props, { emit }) {
    const { t } = useProLocale()
    const saveLoading = ref(false)
    const deleteLoading = ref(false)
    const visible = ref(false)

    const isEditable = computed(() => {
      const { editable: { editableKeys }, recordKey } = props
      return editableKeys?.some(key => recordKey === key)
    })

    const isNewLineRecordCache = computed(() =>
      props.newLineRecordCache?.options.recordKey === props.recordKey
    )

    const handleSave = async () => {
      visible.value = false
      const { validateRow, scope, recordKey, actions, editable, preEditRows } = props
      if (!scope || recordKey === undefined) {
        return
      }

      const { row, $index } = scope
      const valid = await validateRow?.($index)
      if (!valid) {
        return
      }

      try {
        saveLoading.value = true
        const res = await editable.onSave?.(recordKey, row, preEditRows?.get(recordKey)!)
        saveLoading.value = false
        if (res === false) {
          return
        }
        await actions?.cancelEditable(recordKey)
      } catch (err) {
        saveLoading.value = false
        console.error('err', err)
      }
    }

    const handleDelete = async () => {
      const { scope, recordKey, actions, editable } = props
      if (!scope || recordKey === undefined) {
        return
      }

      const { row } = scope

      try {
        deleteLoading.value = true
        const res = await editable.onDelete?.(recordKey, row)
        deleteLoading.value = false
        if (res === false) {
          return
        }
        visible.value = false
        await actions?.cancelEditable(recordKey)
        emit('delete', recordKey)
      } catch (err) {
        deleteLoading.value = false
        console.error('err', err)
      }
    }

    const handleCancel = async () => {
      const { scope, recordKey, actions } = props
      if (!scope || recordKey === undefined) {
        return
      }

      const { $index } = scope

      try {
        visible.value = false
        await actions?.cancelEditable(recordKey)
        emit('cancel', recordKey, $index)
      } catch (err) {
        console.error('err', err)
      }
    }

    return () => {
      const {
        editable: {
          editableKeys,
          onChange,
          onSave,
          onDelete,
          onCancel,
          actionRender,
          saveText,
          deleteText,
          cancelText,
          deletePopconfirmMessage,
        },
        scope,
        recordKey,
        actions,
        name,
        newLineRecordCache,
        preEditRows,
        defaultSize,
        render,
      } = props

      const cancelEditable = actions?.cancelEditable
      const addEditRecord = actions?.addEditRecord

      if (!isEditable.value) {
        const result = actions ? render(actions) : undefined
        if (!result) {
          return null
        }
        return Array.isArray(result) ? <Fragment>{result}</Fragment> : result
      }

      const doms: ActionRenderDefaultDom = {
        save: (
          <el-button
            class="btn-save"
            link
            type="primary"
            size={defaultSize}
            loading={saveLoading.value}
            onClick={handleSave}
            key="save"
          >
            {saveText}
          </el-button>
        ),
        delete: (
          <el-popover
            visible={visible.value}
            onUpdate:visible={(value: boolean) => { visible.value = value }}
            placement="top"
            popper-class="editable-pro-table__popover--delete"
            trigger="click"
            width="auto"
            key="delete"
            v-slots={{
              reference: () => (
                <el-button link type="primary" size={defaultSize}>{deleteText}</el-button>
              ),
              default: () => (
                <div class="editable-pro-table__popover-delete">
                  <el-icon color="#ff9900"><InfoFilled /></el-icon>
                  <span>{deletePopconfirmMessage}</span>
                  <div class="editable-pro-table__popover-delete-actions">
                    <el-button link size="small" onClick={() => { visible.value = false }}>
                      {t('elProComponents.editableProTable.cancelButtonText')}
                    </el-button>
                    <el-button
                      type="primary"
                      size="small"
                      loading={deleteLoading.value}
                      onClick={handleDelete}
                    >
                      {t('elProComponents.editableProTable.confirmButtonText')}
                    </el-button>
                  </div>
                </div>
              ),
            }}
          />
        ),
        cancel: (
          <el-button
            class="btn-cancel"
            link
            type="primary"
            size={defaultSize}
            onClick={handleCancel}
            key="cancel"
          >
            {cancelText}
          </el-button>
        ),
      }

      const row = scope?.row
      const config: ActionRenderConfig = {
        editableKeys,
        setEditableRowKeys: (keys) => onChange?.(keys, []),
        recordKey: recordKey!,
        preEditRow: preEditRows?.get(recordKey!)!,
        index: scope?.$index,
        onSave: onSave!,
        onDelete,
        onCancel: onCancel!,
        cancelEditable: cancelEditable!,
        newLineConfig: newLineRecordCache,
        saveText,
        deleteText,
        cancelText,
        deletePopconfirmMessage: deletePopconfirmMessage!,
        addEditRecord: addEditRecord as ActionRenderConfig['addEditRecord'],
        tableName: name,
      }

      const defaultDoms = [doms.save, !isNewLineRecordCache.value && doms.delete, doms.cancel].filter(Boolean)
      const actionDoms = typeof actionRender === 'function' && row
        ? actionRender(row, config, doms)
        : defaultDoms

      return <Fragment>{actionDoms}</Fragment>
    }
  },
})
