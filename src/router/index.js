import Vue from 'vue'
import Router from 'vue-router'
import SplitComponentVux from '@/components/SplitComponentVux.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SplitComponentVux',
      component: SplitComponentVux
    }
  ]
})
