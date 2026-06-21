import type { RenderActions } from 'element-plus-pro-components/packages/types/form'
import { defineComponent, Fragment, type PropType, type VNode } from 'vue'
import type { SubmitterProps } from '../submitter'

type Render = (actions: RenderActions, doms: VNode[]) => VNode[] | undefined

export default defineComponent({
  name: 'Submitter',
  props: {
    render: {
      type: [Function, null] as PropType<Render | null>,
      required: true
    },
    submitter: {
      type: Object as PropType<SubmitterProps>,
      required: true
    },
    actions: {
      type: Object as PropType<RenderActions>,
      required: true
    }
  },
  setup(props) {
    return () => {
      const {
        submitter: { cancelText, confirmText, cancelButtonProps, confirmButtonProps },
        actions: { close, submit },
        render,
      } = props
      const doms = [
        <el-button { ...cancelButtonProps } onClick={close} key='close'>{ cancelText }</el-button>,
        <el-button type="primary" { ...confirmButtonProps } onClick={submit} key='submit'>{ confirmText }</el-button>,
      ]

      return render
        ? <Fragment>{ render(props.actions, doms) }</Fragment>
        : <span class="dialog-form__submitter">
          {doms}
        </span>
    }
  },
})
