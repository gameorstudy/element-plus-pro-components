<script setup lang="tsx">
import { Warning } from '@element-plus/icons-vue'
import type { FormProps } from 'element-plus'
import {
  EditableProTable,
  ProForm,
  type EditableColumnsConfig,
  type ProFormItemProps,
  type ProFormSubmitterProps,
  type RecordKey,
  type TableRowEditable,
} from '@rasmusxiong/element-plus-pro-components'
import { computed, ref } from 'vue'

interface LabelRow {
  id: string
  label?: string
  type?: string
}

const createId = () => Math.random().toString().slice(2, 10)

interface ActivityForm {
  name1?: string
  name2?: string
  name3?: string
  region1?: string
  region2?: string
  region3?: string
  region4?: string
  type?: string[]
  type2?: string[]
  date?: string
  category?: string[]
  resource?: string
  labels: LabelRow[]
}

const loading = ref(false)
const editableKeys = ref<RecordKey[]>([])

const formProps: FormProps = {
  labelPosition: 'top',
}

const cascaderOptions = [
  {
    label: '球类',
    value: 'ball',
    children: [
      { label: '乒乓', value: '1' },
      { label: '篮球', value: '2' },
      { label: '足球', value: '3' },
    ],
  },
  {
    label: '铁人三项',
    value: 'other',
    children: [
      { label: '游泳', value: '11' },
      { label: '跑步', value: '22' },
      { label: '骑行', value: '33' },
    ],
  },
]

const formItems = computed<ProFormItemProps[]>(() => [
  {
    renderLabel: () => (
      <span>
        自定义活动名称
        <el-icon style="margin-left: 4px"><Warning /></el-icon>
      </span>
    ),
    prop: 'name1',
    valueType: 'input',
    fieldProps: { placeholder: 'valueType' },
    rules: [{ required: true, message: '请输入', trigger: 'blur' }],
    initialValue: 'hello',
  },
  {
    label: '活动名称2',
    prop: 'name2',
    valueType: 'slot',
    rules: [{ required: true, message: '请输入', trigger: 'blur' }],
  },
  {
    label: '活动名称3',
    prop: 'name3',
    renderField: ({ form }) => (
      <el-input
        modelValue={form.name3}
        onUpdate:modelValue={(val: string) => { form.name3 = val }}
        placeholder="renderField"
      />
    ),
    rules: [{ required: true, message: '请输入', trigger: 'blur' }],
  },
  {
    label: '活动区域1',
    prop: 'region1',
    valueType: 'select',
    fieldProps: {
      placeholder: 'fieldProps.options',
      options: [
        { label: '区域一', value: 'region1' },
        { label: '区域二', value: 'region2' },
      ],
    },
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
  {
    label: '活动区域2',
    prop: 'region2',
    valueType: 'select',
    fieldProps: { placeholder: 'valueEnum: Object' },
    valueEnum: {
      region1: '区域一',
      region2: '区域二',
    },
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
  {
    label: '活动区域3',
    prop: 'region3',
    valueType: 'select',
    fieldProps: { placeholder: 'valueEnum: Map' },
    valueEnum: new Map([
      ['region1', '区域一'],
      ['region2', '区域二'],
    ]),
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
  {
    label: '活动区域4',
    prop: 'region4',
    valueType: 'select',
    fieldProps: { placeholder: 'optionLoader' },
    optionLoader: () => new Promise<Array<{ label: string; value: string }>>((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '区域一', value: 'region1' },
          { label: '区域二', value: 'region2' },
        ])
      }, 100)
    }),
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
  {
    label: '活动类型1',
    prop: 'type',
    valueType: 'cascader',
    fieldProps: {
      placeholder: 'fieldProps.options',
      options: cascaderOptions,
    },
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
  {
    label: '活动类型2',
    prop: 'type2',
    valueType: 'cascader',
    fieldProps: { placeholder: 'optionLoader' },
    optionLoader: () => new Promise<typeof cascaderOptions>((resolve) => {
      setTimeout(() => resolve(cascaderOptions), 500)
    }),
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
  {
    label: '活动时间',
    prop: 'date',
    valueType: 'date-picker',
    fieldProps: { valueFormat: 'YYYY-MM-DD' },
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
  {
    label: '活动性质',
    prop: 'category',
    valueType: 'checkbox-group',
    fieldProps: {
      options: [
        { label: '美食/餐厅线上活动', value: '美食/餐厅线上活动' },
        { label: '地推活动', value: '地推活动' },
        { label: '线下主题活动', value: '线下主题活动' },
        { label: '单纯品牌曝光', value: '单纯品牌曝光' },
      ],
    },
    initialValue: [],
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
  {
    label: '特殊资源',
    prop: 'resource',
    valueType: 'radio-group',
    fieldProps: {
      options: [
        { label: '线上品牌商赞助', value: '线上品牌商赞助' },
        { label: '线下场地免费', value: '线下场地免费' },
      ],
    },
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
  {
    prop: 'labels',
    label: '活动标签',
    valueType: 'slot',
    rules: [{ required: true, message: '请至少添加一条', trigger: 'change' }],
    initialValue: [],
  },
])

const initialValues = {
  name1: 'world',
  name2: 'hello world',
  labels: [] as LabelRow[],
}

const columns = computed(() => [
  {
    label: '标签名称',
    prop: 'label',
    valueType: 'input',
    formItemProps: {
      rules: [{ required: true, message: '请输入', trigger: 'blur' }],
    },
  },
  {
    label: '标签类型',
    prop: 'type',
    valueType: 'select',
    valueEnum: {
      '1': '类型一',
      '2': '类型二',
      '3': '类型三',
    },
    fieldProps: { clearable: true },
    formItemProps: {
      rules: [{ required: true, message: '请选择', trigger: 'change' }],
    },
  },
  {
    width: 80,
    label: '操作',
    valueType: 'option',
    fixed: 'right' as const,
    renderCell: () => null,
  },
] as unknown as EditableColumnsConfig[])

const editable = computed<TableRowEditable>(() => ({
  type: 'multiple',
  editableKeys: editableKeys.value,
  onChange: (keys) => {
    editableKeys.value = keys
  },
  actionRender: (_row, _config, defaultDoms) => [defaultDoms.delete],
}))

const recordCreatorProps = {
  newRecordType: 'dataSource' as const,
  record: () => ({ id: createId() }),
}

const submitter = computed<ProFormSubmitterProps>(() => ({
  submitButtonProps: { loading: loading.value },
}))

const onFinish = (formData: ActivityForm) => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    console.log('form', formData)
  }, 200)
}
</script>

<template>
  <div class="example-page">
    <ProForm
      :form-props="formProps"
      :form-items="formItems"
      :submitter="submitter"
      :initial-values="initialValues"
      @on-finish="onFinish"
    >
      <template #name2="{ form }: { form: ActivityForm }">
        <el-input v-model="form.name2" placeholder="slot" />
      </template>
      <template #labels="{ form }: { form: ActivityForm }">
        <EditableProTable
          :data-source="form.labels"
          :columns="columns"
          :editable="editable"
          name="labels"
          :record-creator-props="recordCreatorProps"
          row-key="id"
        />
      </template>
    </ProForm>
  </div>
</template>

<style scoped>
.example-page {
  padding: 24px;
  max-width: 960px;
}
</style>
