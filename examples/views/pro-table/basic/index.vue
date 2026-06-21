<script setup lang="tsx">
import {
  ProTable,
  type ColumnsConfig,
  type ProTableInstance,
} from '@rasmusxiong/element-plus-pro-components'
import { computed, Fragment, ref } from 'vue'

interface SearchProps {
  name?: string
  label?: string
  date?: string
  minAmount?: string
  maxAmount?: string
  status?: string
  title?: string
  a?: {
    b?: string
  }
  pageNum: number
  pageSize: number
}

interface ResponseProps {
  id: number
  name: string
  label: string
  date: string
  amount: string
  status: string
  title: string
}

const labelOptions = [
  { label: '标签一', value: '1' },
  { label: '标签二', value: '2' },
]

const columns = computed(() => {
  const cols: ColumnsConfig[] = [
    {
      label: '名称',
      prop: 'name',
      valueType: 'input',
      fieldProps: {
        placeholder: '请输入名称',
      },
    },
    {
      label: '标签',
      prop: 'label',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择标签',
        options: labelOptions,
      },
      formatter: (_, __, cellValue) => {
        const obj: Record<string, string> = labelOptions.reduce(
          (accumulator, cur) => ({ ...accumulator, [cur.value]: cur.label }),
          {},
        )
        return <span>{obj[cellValue] || cellValue}</span>
      },
    },
    {
      label: '日期',
      prop: 'date',
      valueType: 'date-picker',
      fieldProps: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      label: '金额',
      prop: 'amount',
      renderField: ({ form }: { form: SearchProps }) => (
        <Fragment>
          <el-form-item prop="minAmount">
            <el-input v-model={form.minAmount} placeholder="最小金额" />
          </el-form-item>
          <span style="margin: 0 10px">-</span>
          <el-form-item prop="maxAmount">
            <el-input v-model={form.maxAmount} placeholder="最大金额" />
          </el-form-item>
        </Fragment>
      ),
    },
    {
      label: '状态',
      prop: 'status',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择状态',
      },
      valueEnum: {
        '1': '待处理',
        '2': '处理中',
        '3': '已完成',
      },
    },
    {
      label: '标题',
      prop: 'title',
      valueType: 'input',
      showOverflowTooltip: true,
    },
    {
      label: `['a', 'b']`,
      formItemProps: {
        prop: ['a', 'b'],
      },
      fieldProps: {
        placeholder: 'hide in table',
      },
      valueType: 'input',
      hideInTable: true,
    },
  ]

  return cols
})

const proTableRef = ref<ProTableInstance>()

const setFieldValue = () => {
  proTableRef.value?.setFieldValue('name', 'hello world')
}

const setFieldsValue = () => {
  proTableRef.value?.setFieldsValue({
    status: '1',
  })
}

const TOTAL_RECORDS = 256

const loading = ref(false)
const dataSource = ref<ResponseProps[]>()
const total = ref(0)

const onParams = (params: SearchProps) => {
  console.log('params', params)

  const { pageSize, pageNum } = params
  const data = Array.from({ length: TOTAL_RECORDS }, (_, index) => ({
    id: index,
    name: '名称' + Math.random().toString().slice(2, 6),
    label: index % 3 === 0 ? '1' : '2',
    date: '2026-05-04',
    amount: '100.00',
    status: index % 3 === 0 ? '1' : index % 3 === 1 ? '2' : '3',
    title: '这是一段很长很长很长很长很长很长很长很长很长很长很长很长的内容',
  }))
  loading.value = true
  setTimeout(() => {
    loading.value = false
    dataSource.value = data.slice((pageNum - 1) * pageSize, pageNum * pageSize)
    total.value = TOTAL_RECORDS
  }, 200)
}
</script>

<template>
  <div class="example-page">
    <ProTable
      ref="proTableRef"
      :columns="columns"
      :loading="loading"
      :data-source="dataSource"
      :total="total"
      @on-params="onParams"
    >
      <div>
        <el-button @click="setFieldValue">setFieldValue</el-button>
        <el-button @click="setFieldsValue">setFieldsValue</el-button>
      </div>
    </ProTable>
  </div>
</template>

<style scoped>
.example-page {
  padding: 24px;
}
</style>
