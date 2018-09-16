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
import io from 'socket.io-client'

export default {
  data () {
    return {
      user: '',
      message: '',
      messages: [],
      socket: io('localhost:3001')
    }
  },

  methods: {
    sendMessage () {
      const payload = { user: this.user, message: this.message }

      // emite um evento para o backend
      this.socket.emit('SEND_MESSAGE', payload)

      // reseta o campo após enviar a mensagem
      this.message = ''
    }
  },

  mounted () {
    // adiciona uma escuta
    this.socket.on('MESSAGE', msg => {
      this.messages = [...this.messages, msg]
    })
  }
}
</script>
