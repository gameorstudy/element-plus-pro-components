<script lang="ts">
import { computed, defineComponent, inject, type PropType } from 'vue'
import VerticalAlignTopIcon from './svg/VerticalAlignTopIcon.vue'
import VerticalAlignBottomIcon from './svg/VerticalAlignBottomIcon.vue'
import VerticalAlignMiddleIcon from './svg/VerticalAlignMiddleIcon.vue'
import { useProLocale } from 'element-plus-pro-components/packages/locale'
import type { OnColumnSettingsChange, SettingColumns } from '../column-settings'

export default defineComponent({
  name: 'ColumnAlignSettings',
  components: {
    VerticalAlignTopIcon,
    VerticalAlignMiddleIcon,
    VerticalAlignBottomIcon,
  },
  props: {
    // Single column item
    column: {
      type: Object as PropType<SettingColumns>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { t } = useProLocale()

    const leftPinText = computed(() => t('elProComponents.tableToolBar.leftPin'))
    const noPinText = computed(() => t('elProComponents.tableToolBar.noPin'))
    const rightPinText = computed(() => t('elProComponents.tableToolBar.rightPin'))

    // Inject method from ProTable
    const onColumnSettingsChange = inject<OnColumnSettingsChange>('onColumnSettingsChange')

    /**
     * Handle alignment/fixed position change
     * @param fixed - Fixed position (left/right/undefined for no pin)
     */
    const handleAlign = (fixed?: 'left' | 'right') => {
      const { prop } = props.column
      if (onColumnSettingsChange) {
        onColumnSettingsChange({ event: 'align', prop, fixed })
      }
    }

    return {
      handleAlign,
      leftPinText,
      noPinText,
      rightPinText,
    }
  },
})
</script>

<template>
  <span class="icon-align-group">
    <template v-if="column.fixed !== 'left'">
      <el-tooltip :content="leftPinText" placement="top">
        <VerticalAlignTopIcon @click.native.stop.prevent="handleAlign('left')" />
      </el-tooltip>
    </template>
    <template v-if="column.fixed === 'left' || column.fixed === 'right'">
      <el-tooltip :content="noPinText" placement="top">
        <VerticalAlignMiddleIcon @click.native.stop.prevent="handleAlign()" />
      </el-tooltip>
    </template>
    <template v-if="column.fixed !== 'right'">
      <el-tooltip :content="rightPinText" placement="top">
        <VerticalAlignBottomIcon @click.native.stop.prevent="handleAlign('right')" />
      </el-tooltip>
    </template>
  </span>
</template>

<style scoped>
.icon-align-group {
  margin-left: auto;
  align-items: center;
  gap: 8px;
  color: #1677ff;
  cursor: pointer;
  display: none;
  transition: display 0.2s;
}

.icon-align-group svg {
  outline: none;
}
</style>