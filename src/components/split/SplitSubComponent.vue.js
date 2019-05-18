import { XButton } from 'vux'

export default {
  name: 'split-sub-component',
  components: {
    XButton
  },
  data () {
    return {
      isChangeTitle: false,
      newTite: '标题已更改',
      changeTitle: '子功能Split部份',
      title: '按钮'
    }
  },
  methods: {
    /**
     * 更改标题
     */
    updateTitle () {
      this.title = this.isChangeTitle ? this.newTite : this.changeTitle
      this.isChangeTitle = !this.isChangeTitle
    }
  }
}
