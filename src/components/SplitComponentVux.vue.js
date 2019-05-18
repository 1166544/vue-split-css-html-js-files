import { Group, Cell } from 'vux'
import SplitSubComponent from './split/SplitSubComponent.vue'
import DemoComponent from './demo/DemoComponent.vue'

export default {
  components: {
    Group,
    Cell,
    SplitSubComponent,
    DemoComponent
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Vux From init component'
    }
  }
}
