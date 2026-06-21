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
        submitter: { resetText, submitText, resetButtonProps, submitButtonProps },
        actions: { reset, submit },
        render,
      } = props
      const doms = [
        <el-button { ...resetButtonProps } onClick={reset} key='reset'>{ resetText }</el-button>,
        <el-button type="primary" { ...submitButtonProps } onClick={submit} key='submit'>{ submitText }</el-button>,
      ]

      return render
        ? <Fragment>{ render(props.actions, doms) }</Fragment>
        : <el-form-item class="pro-form__submitter">
          {doms}
        </el-form-item>
    }
  },
})
