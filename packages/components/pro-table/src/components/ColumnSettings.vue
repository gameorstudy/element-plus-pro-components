<script lang="ts">
import { computed, defineComponent, inject, type PropType } from 'vue';
import type { ColumnSettings } from '../pro-table';
import type { OnColumnSettingsChange, SettingColumns } from '../column-settings';
import ColumnSettingsItem from './ColumnSettingsItem.vue'

export default defineComponent({
  name: 'ColumnSettings',
  components: {
    ColumnSettingsItem,
  },
  props: {
    // Columns
    columns: {
      type: Array as PropType<SettingColumns[]>,
      required: true
    },
    // Column settings
    columnSettings: {
      type: Object as PropType<ColumnSettings>,
      required: true
    }
  },
  setup(props) {
    const leftFixedColumns = computed(() => {
      return props.columns.filter(item => item.fixed === 'left')
    })

    const noFixedColumns = computed(() => {
      return props.columns.filter(item => item.fixed !== 'left' && item.fixed !== 'right')
    })

    const rightFixedColumns = computed(() => {
      return props.columns.filter(item => item.fixed === 'right')
    })

    const checkAll = computed(() => {
      return props.columns.length === props.columns.filter(item => item.checkable).length
    })

    const isIndeterminate = computed(() => {
      return !checkAll.value && props.columns.filter(item => !item.disabled && item.checkable).length > 0
    })

    // Inject method from ProTable
    const onColumnSettingsChange = inject<OnColumnSettingsChange>('onColumnSettingsChange')


    const handleChange = (checked: boolean) => {
      onColumnSettingsChange?.({ event: "checkAll", checked })
    }

    const handleReset = () => {
      onColumnSettingsChange?.({ event: "reset" })
    }

    return {
      leftFixedColumns,
      noFixedColumns,
      rightFixedColumns,
      checkAll,
      isIndeterminate,
      handleChange,
      handleReset
    }
  }
})
</script>

<template>
  <el-popover
    popper-class="column-settings-popover"
    placement="bottom-end"
    trigger="click"
    width="auto"
  >
    <template #reference>
      <div class="pro-table__toolbar-item">
        <el-tooltip :content="columnSettings.columnSetting" placement="top">
          <el-icon><Setting /></el-icon>
        </el-tooltip>
      </div>
    </template>
    <div class="popover-header">
      <el-checkbox
        v-if="columnSettings.checkable"
        v-model="checkAll" 
        :indeterminate="isIndeterminate"
        @change="handleChange"
      >
        {{ columnSettings.columnDisplay }}
      </el-checkbox>
      <span class="column-display" v-else>{{ columnSettings.columnDisplay }}</span>
      <a type="text" class="btn-reset" @click="handleReset">{{ columnSettings.resetText }}</a>
    </div>
    <div class="popover-content">
      <!-- Fix top -->
      <!-- start -->
      <ColumnSettingsItem
        :columns="leftFixedColumns"
        :columnSettings="columnSettings"
      />
      <!-- end -->
      <!-- No fix -->
      <!-- start -->
      <ColumnSettingsItem
        :columns="noFixedColumns"
        :columnSettings="columnSettings"
      />
      <!-- end -->
      <!-- Fix bottom -->
      <!-- start -->
      <ColumnSettingsItem
        :columns="rightFixedColumns"
        :columnSettings="columnSettings"
      />
      <!-- end -->
    </div>
  </el-popover>
</template>

<style lang="less" scoped>
.pro-table__toolbar-item {
  display: flex;
  margin-block: 0;
  margin-inline: 4px;
  color: rgba(42, 46, 54, 0.88);
  font-size: 16px;
  cursor: pointer;

  svg {
    outline: none;
  }

  &:hover {
    color: #409eff;
  }
}

.column-settings-popover {
  .popover-header {
    display: flex;
    justify-content: space-between;

    :deep(.el-checkbox__label) {
      padding-inline-start: 8px;
    }

    .btn-reset {
      color: #409EFF;
      font-weight: 500;
      cursor: pointer;

      &:hover {
        color: #66b1ff;
      }
    }
    
    :deep(.el-checkbox__label),
    .column-display,
    .btn-reset {
      line-height: 32px;
    }
  }

  .popover-content {
    width: 200px;
    padding-block: 0;
    padding-inline: 0;
    padding-block-end: 8px;
  }
}
</style>