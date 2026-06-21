<script setup lang="tsx">
import {
  EditableProTable,
  type ActionConfig,
  type EditableColumnsConfig,
  type EditableProTableInstance,
  type RecordKey,
  type TableRowEditable,
} from '@rasmusxiong/element-plus-pro-components'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

interface EditableRow {
  id: string
  name: string
  date: string
  province: string
  address: string
}

const createId = () => Math.random().toString().slice(2, 10)

const provinceOptions = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'zhejiang', label: '浙江' },
]

const initialRows = (): EditableRow[] => [
  {
    id: '1',
    name: 'hello',
    date: '2026-03-21',
    province: 'beijing',
    address: '北京xxxxxxxx路xxxxxxxx街道',
  },
  {
    id: '2',
    name: 'world',
    date: '2026-03-22',
    province: 'shanghai',
    address: '上海xxxxxxxx路xxxxxxxx街道',
  },
]

const loading = ref(false)
const dataSource = ref<EditableRow[]>([])
const editableKeys = ref<RecordKey[]>([])
const tableRef = ref<EditableProTableInstance>()

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    dataSource.value = initialRows()
  }, 200)
})

const editable = computed<TableRowEditable>(() => ({
  editableKeys: editableKeys.value,
  onChange: (keys) => {
    editableKeys.value = keys
  },
}))

const columns = computed(() => [
  {
    minWidth: 180,
    label: '名称',
    prop: 'name',
    valueType: 'input',
    fieldProps: { placeholder: '请输入名称' },
    formItemProps: {
      rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    },
  },
  {
    minWidth: 200,
    label: '日期',
    prop: 'date',
    valueType: 'date-picker',
    fieldProps: { valueFormat: 'YYYY-MM-DD' },
    formItemProps: {
      rules: [{ required: true, message: '请选择日期', trigger: 'change' }],
    },
  },
  {
    minWidth: 200,
    label: '省/直辖市',
    prop: 'province',
    valueType: 'select',
    fieldProps: {
      options: provinceOptions,
    },
    formItemProps: {
      rules: [{ required: true, message: '请选择省份', trigger: 'change' }],
    },
  },
  {
    minWidth: 240,
    label: '地址',
    prop: 'address',
    valueType: 'input',
    fieldProps: { type: 'textarea' },
    showOverflowTooltip: true,
    formItemProps: {
      rules: [{ required: true, message: '请输入地址', trigger: 'blur' }],
    },
  },
  {
    width: 220,
    label: '操作',
    fixed: 'right' as const,
    valueType: 'option',
    renderCell: (scope: { row: EditableRow }, actions?: ActionConfig) => [
      <el-button type="primary" link onClick={() => actions?.startEditable(scope.row.id)}>
        编辑
      </el-button>,
      <el-button
        type="danger"
        link
        onClick={() => {
          dataSource.value = dataSource.value.filter(item => item.id !== scope.row.id)
        }}
      >
        删除
      </el-button>,
      <el-button
        type="primary"
        link
        onClick={() => actions?.addEditRecord({ ...scope.row, id: createId() })}
      >
        复制
      </el-button>,
    ],
  },
] as unknown as EditableColumnsConfig[])

const validateTable = async () => {
  const formRef = tableRef.value?.getFormRef()
  if (!formRef) {
    return
  }
  const valid = await formRef.validate().catch(() => false)
  ElMessage[valid ? 'success' : 'error'](valid ? '表格校验通过' : '表格校验失败')
}
</script>

<template>
  <div class="example-page">
    <div class="example-actions">
      <el-button type="primary" @click="validateTable">校验表格</el-button>
    </div>
    <EditableProTable
      ref="tableRef"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      row-key="id"
      name="table"
      :max-length="5"
      :editable="editable"
      :record-creator-props="{
        position: 'top',
        record: () => ({ id: createId() }),
      }"
    />
  </div>
</template>

<style scoped>
.example-page {
  padding: 24px;
}

.example-actions {
  margin-bottom: 16px;
}
</style>
