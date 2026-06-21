import { Fragment, defineComponent, type PropType, type VNode } from "vue";

export default defineComponent({
  name: 'CustomRender',
  props: {
    render: {
      type: Function as PropType<() => VNode | VNode[] | undefined>,
      required: true
    }
  },
  setup(props) {
    return () => <Fragment>{props.render()}</Fragment>
  }
})