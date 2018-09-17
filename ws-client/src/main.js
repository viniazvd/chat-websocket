import Vue from 'vue'
import Chat from './Chat.vue'

import VueCoeWebSocket from './lib'

Vue.use(VueCoeWebSocket, '127.0.0.1:4000')

Vue.config.productionTip = false

new Vue({
  render: h => h(Chat)
}).$mount('#app')
