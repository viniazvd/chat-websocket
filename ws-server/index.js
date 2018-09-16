const express = require('express')
const app = express()

const server = app.listen(3001)

const socket = require('socket.io')(server)

function log ({ user, message }) {
  console.log('Log message:')
  console.log(`The user <${user}> sent the message: ${message}.`)
  console.log()
}

// aguardando alguém conectar
socket.on('connection', chat => {

  // aguardando alguém enviar uma mensagem
  chat.on('SEND_MESSAGE', payload => {
    // manipula os dados do frontend, no caso, um simples log no console
    log(payload)

    // emite uma msg de volta para o frontend, no caso, o mesmo dado que foi recebido
    socket.emit('MESSAGE', payload)
  })
})
