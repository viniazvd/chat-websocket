const express = require('express')
const app = express()

const server = app.listen(4000)

const socket = require('socket.io')(server)
const channel = socket.of('/main')

function log ({ user, message }) {
  console.log('Log message:')
  console.log(`The user <${user}> sent the message: ${message}.`)
  console.log()
}

channel.on('connection', chat => {

  chat.on('CONNECT', () => {
    channel.emit('IS_CONNECTED', 'connected')
  })

  chat.on('SEND_MESSAGE', payload => {
    log(payload)

    channel.emit('NEW_MESSAGE', payload)
  })
})
