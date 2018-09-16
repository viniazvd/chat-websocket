import Vue from 'vue'
import Chat from './Chat.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Chat)
}).$mount('#app')
