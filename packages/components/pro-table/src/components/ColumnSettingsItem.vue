<script lang="ts">
import { computed, defineComponent, inject, ref, type PropType } from 'vue';
import HolderIcon from './svg/HolderIcon.vue';
import ColumnAlignSettings from './ColumnAlignSettings.vue';
import { useProLocale } from 'element-plus-pro-components/packages/locale';
import type { OnColumnSettingsChange, SettingColumns } from '../column-settings';
import type { ColumnSettings } from '../pro-table';

export default defineComponent({
  name: 'ColumnSettingsItem',
  components: {
    HolderIcon,
    ColumnAlignSettings
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
    const { t } = useProLocale()

    // Template refs
    const dragDropZoneRef = ref<HTMLDivElement>()
    
    // Drag state
    const dragIndex = ref(-1) // Index of the dragging item
    const dropIndex = ref(-1) // Index of the droppable target
    
    // Inject method from ProTable
    const onColumnSettingsChange = inject<OnColumnSettingsChange>('onColumnSettingsChange')
    
    // Computed: column group title
    const title = computed(() => {
      const { columns } = props
      if (Array.isArray(columns) && columns.length) {
        const fixed = columns[0].fixed
        return fixed === 'left'
          ? t('elProComponents.tableToolBar.leftFixedTitle')
          : fixed === 'right'
          ? t('elProComponents.tableToolBar.rightFixedTitle')
          : t('elProComponents.tableToolBar.noFixedTitle')
      }
      return ''
    })
    
    // Draggable
    const draggable = computed(() => {
      return props.columnSettings.draggable && props.columns?.length > 1
    })
    
    // Dynamic component type (checkbox or span)
    const dynamicComponent = computed(() => {
      return props.columnSettings.checkable ? 'el-checkbox' : 'span'
    })
    
    /**
     * Handle change event for checkbox
     * @param checked - Checkbox state
     * @param prop - Column property name
     */
    const handleChange = (checked: boolean, prop: string) => {
      if (onColumnSettingsChange) {
        onColumnSettingsChange({ event: 'check', checked, prop })
      }
    }
    
    /**
     * Get cursor position relative to the target element
     * @param e - Drag event
     * @returns 'top' or 'bottom'
     */
    const getCursorPos = (e: DragEvent): 'top' | 'bottom' => {
      // Get element position and size
      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      
      // Get mouse position relative to the element
      const relativeY = e.clientY - rect.top
      
      // Determine if cursor is in the top or bottom half of the target
      return relativeY < rect.height / 2 ? 'top' : 'bottom'
    }
    
    /**
     * Get the target drop index based on cursor position
     * @param e - Drag event
     * @param targetIndex - Index of the drop target
     * @returns Drop index position, -1 if no change
     */
    const getDropIndex = (e: DragEvent, targetIndex: number): number => {
      // Get cursor position
      const cursorPos = getCursorPos(e)
      
      // Insert above if cursor is in top half, below if in bottom half
      let targetDropIndex = cursorPos === 'top' ? targetIndex : targetIndex + 1
      
      // Drag direction
      const dragDirection = dragIndex.value < targetIndex ? 'down' : 'up'
      
      // Same position as drag start
      if (targetDropIndex === dragIndex.value) {
        return -1
      }
      
      // Adjacent items in downward drag - no change
      const isNear = Math.abs(targetDropIndex - dragIndex.value) === 1
      if (isNear && dragDirection === 'down') {
        return -1
      }
      
      return targetDropIndex
    }
    
    /**
     * Drag start handler
     * @param e - Drag event
     * @param index - Index of the dragged item
     */
    const onDragstart = (e: DragEvent, index: number) => {
      if (!draggable.value) return
      e.dataTransfer!.effectAllowed = 'move'
      e.dataTransfer!.dropEffect = 'move'
      dragIndex.value = index
    }
    
    /**
     * Drag enter handler
     * @param e - Drag event
     */
    const onDragenter = (e: DragEvent) => {
      if (dragIndex.value === -1) {
        e.dataTransfer!.dropEffect = 'none'
      } else {
        e.dataTransfer!.dropEffect = 'move'
      }
    }
    
    /**
     * Drag over handler
     * @param e - Drag event
     * @param targetIndex - Index of the drop target
     */
    const onDragover = (e: DragEvent, targetIndex: number) => {
      // If dragging from another area
      if (dragIndex.value < 0) {
        e.dataTransfer!.dropEffect = 'none'
        return
      }
      
      // Same as drag start target
      if (dragIndex.value === targetIndex) {
        dropIndex.value = -1
        return
      }
      
      // Get drop position index
      dropIndex.value = getDropIndex(e, targetIndex)
    }
    
    /**
     * Drag leave handler
     * @param e - Drag event
     */
    const onDragleave = (e: DragEvent) => {
      // Check if still within the drag zone
      if (dragDropZoneRef.value?.contains(e.relatedTarget as Node)) {
        return
      }
      dropIndex.value = -1
    }
    
    /**
     * Drop handler
     * @param e - Drag event
     * @param targetIndex - Index of the drop target
     */
    const onDrop = (e: DragEvent, targetIndex: number) => {
      if (dragIndex.value === targetIndex) {
        dropIndex.value = -1
        return
      }
      
      // Get drop position index
      const index = getDropIndex(e, targetIndex)
      if (index > -1) {
        const { columns } = props
        const fromProp = columns[dragIndex.value].prop
        const isAfter = index === props.columns.length
        const toProp = isAfter ? columns[index - 1].prop : columns[index].prop
        onColumnSettingsChange?.({ event: 'drop', fromProp, toProp, isAfter })
      }
    };
    
    /**
     * Drag end handler
     */
    const onDragend = () => {
      dragIndex.value = -1;
      dropIndex.value = -1;
    };
    
    return {
      dragDropZoneRef,
      dragIndex,
      dropIndex,
      title,
      draggable,
      dynamicComponent,
      handleChange,
      onDragstart,
      onDragenter,
      onDragover,
      onDragleave,
      onDrop,
      onDragend
    };
  }
});
</script>

<template>
  <div v-if="columns.length" class="column-settings-item-list">
    <div class="title">{{ title }}</div>
    <div ref="dragDropZoneRef" class="drag-drop-zone">
      <div
        class="column-settings-item"
        v-for="(column, index) in columns"
        :class="{ draggable, dragging: dragIndex === index }"
        :draggable="draggable"
        @dragstart="(e) => onDragstart(e, index)"
        @dragenter.prevent="onDragenter"
        @dragover.prevent="(e) => onDragover(e, index)"
        @dragleave="onDragleave"
        @drop="(e) => onDrop(e, index)"
        @dragend="onDragend"
        :key="column.prop"
      >
        <span v-if="draggable" class="icon icon-holder">
          <HolderIcon />
        </span>
        <span class="switcher"></span>
        <component
          :is="dynamicComponent"
          v-bind="dynamicComponent === 'el-checkbox'
            ? { modelValue: column.checkable, disabled: column.disabled }
            : { class: 'text-wrapper' }"
          v-on="dynamicComponent === 'el-checkbox'
            ? { change: (checked: boolean) => handleChange(checked, column.prop as string) }
            : {}"
        >
          <span class="label">{{ column.label }}</span>
          <ColumnAlignSettings :column="column" />
          <!-- Drag indicator element -->
          <!-- start -->
          <!-- ::before pseudo-element -->
          <!-- start -->
          <div v-if="index === 0 && dropIndex === index" class="indicator head-indicator"></div>
          <!-- end -->
          <!-- ::after pseudo-element -->
          <!-- start -->
          <div v-else-if="dropIndex === index + 1" class="indicator tail-indicator"></div>
          <!-- end -->
          <!-- end -->
        </component>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.column-settings-item-list {
  > .title {
    margin-block-start: 6px;
    margin-block-end: 6px;
    padding-inline-start: 24px;
    color: rgba(42, 46, 54, 0.65);
    font-size: 12px;
  }

  .column-settings-item {
    display: flex;
    align-items: center;
    padding: 0 0 4px 0;
    outline: none;
    color: rgba(42, 46, 54, 0.88);

    &.draggable {
      cursor: grab;
    }

    &.dragging {
      position: relative;

      &::after {
        position: absolute;
        top: 0;
        inset-inline-end: 0;
        bottom: 4px;
        inset-inline-start: 0;
        border: 1px solid #1677ff;
        opacity: 0;
        animation-name: fade;
        animation-duration: 0.3s;
        animation-play-state: running;
        animation-fill-mode: forwards;
        content: '';
        pointer-events: none;
      }
    }

    .indicator {
      width: calc(100% - 4px);
      height: 2px;
      background-color: #1677ff;
      border-radius: 1px;
      pointer-events: none;
      position: absolute;
      z-index: 1;
      bottom: -3px;

      &.head-indicator {
        top: 0;
      }

      &::before,
      &::after {
        position: absolute;
        left: 0;
        top: -3px;
        inset-inline-start: -6px;
        width: 8px;
        height: 8px;
        background-color: transparent;
        border: 2px solid #1677ff;
        border-radius: 50%;
        content: '';
        box-sizing: border-box;
      }
    }

    .icon-holder {
      flex-shrink: 0;
      width: 24px;
      line-height: 24px;
      text-align: center;
      visibility: visible;
      opacity: 0.2;
      transition: opacity 0.3s;
    }

    .switcher {
      flex: none;
      align-self: stretch;
      width: 24px;
      margin: 0;
      line-height: 24px;
      text-align: center;
      cursor: unset;
      user-select: none;
      transition: all 0.3s;
      border-radius: 6px;
    }

    :deep(.el-checkbox),
    .text-wrapper {
      height: 24px;
      flex: 1;
    }

    :deep(.el-checkbox__label),
    .text-wrapper {
      display: inline-flex;
      padding: 0 4px;
      line-height: 24px;
      border-radius: 6px;
      box-sizing: border-box;
      transition: background-color 0.2s;
      position: relative;
    }

    :deep(.el-checkbox__label) {
      width: calc(100% - 18px);
      margin-left: 4px;
    }

    :deep(.label) {
      display: inline-block;
      max-width: 80px;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;

      &:empty::before {
        content: '\00a0';
      }
    }

    &:hover {
      :deep(.el-checkbox__label),
      .text-wrapper {
        background: rgba(42, 46, 54, 0.04);
      }

      .icon-align-group {
        display: inline-flex;
      }
    }
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>