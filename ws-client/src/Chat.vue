<template>
  <div id="app">
    <div>
      <h3>Chat</h3>
      <div>
        <div v-for="(msg, index) in messages" :key="index">
          <p>{{ msg.user }}: {{ msg.message }}</p>
        </div>
      </div>
    </div>

    <div>
      <form @submit.prevent="sendMessage">
        <div>
          <label for="user">User:</label>
          <input type="text" v-model="user">
        </div>
        <div>
          <label for="message">Message:</label>
          <input type="text" v-model="message">
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chat',

  data () {
    return {
      user: '',
      message: '',
      messages: []
    }
  },

  socket: {
    channel: '/main',

    events: {
      IS_CONNECTED (status) {
        if (status === 'connected') {
          console.log('ws is: ', status)
        } else {
          console.warn('you are not connected')
        }
      },

      NEW_MESSAGE (msg) {
        this.messages = [ ...this.messages, msg ]
      }
    }
  },

  methods: {
    sendMessage () {
      const payload = { user: this.user, message: this.message }

      this.$socket.emit('SEND_MESSAGE', payload)

      this.message = ''
    }
  },

  mounted () {
    this.$socket.emit('CONNECT')
  }
}
</script>
