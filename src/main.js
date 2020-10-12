import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ajax from './axios'
import mixin from './mixin'
import vuetify from './plugins/vuetify'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import { messages } from 'vee-validate/dist/locale/en.json'
import './assets/style/index.scss'
import './assets/style/highlighter.scss'
import './assets/style/tooltip.scss'
import DataLsp from '@/components/DataLsp'
import Notify from '@/components/Notify'
import Loading from '@/components/Loading'
import CodeForm from '@/components/CodeForm'
import CodePreview from '@/components/CodePreview'

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  })
})

Vue.config.productionTip = false

Vue.prototype.$axios = ajax()

Vue.component('data-lsp', DataLsp)
Vue.component('validate', ValidationProvider)
Vue.component('validate-all', ValidationObserver)
Vue.component(Notify.name, Notify)
Vue.component(Loading.name, Loading)
Vue.component(CodeForm.name, CodeForm)
Vue.component(CodePreview.name, CodePreview)

Vue.mixin(mixin)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
