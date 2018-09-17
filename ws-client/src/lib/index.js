import io from 'socket.io-client'

export default {
  install (Vue, connection) {
    if (!connection) throw new Error('[vue-coe-websocket] cannot locate connection')

    Vue.mixin({
      created () {
        const socket = io(connection)
        socket.onevent = packet => this.emit(packet.data)

        Vue.prototype.$socket = socket

        // objeto dos sockets registrados
        const sockets = this.$options['sockets']

        if (sockets) {
          // cria um objeto Proxy e algumas traps
          // this.$options.sockets = Proxy{}
          this.$options.sockets = new Proxy({}, {
            set: (obj, key, callback) => {
              this.listeners = [
                ...this.listeners,
                { key, callback }
              ]

              return Reflect.set(obj, key, callback)
            },

            // fix later
            deleteProperty: (target, event) => Reflect.deleteProperty(target, event)
          })

          // registra todos os objetos de socket para o Proxy
          // this.$options.sockets = Proxy{ fn1: ƒ, fn2: ƒ, ... }
          Object.keys(sockets).forEach(key => (this.$options.sockets[key] = sockets[key]))
        }
      },

      data () {
        return {
          listeners: []
        }
      },

      methods: {
        emit ([ event, payload ]) {
          const listener = this.listeners.find(listener => event === listener.key)

          if (listener && listener.callback) listener.callback.call(this, payload)
        }
      },

      beforeDestroy () {
        if (this.$options['sockets']) {
          Object.keys(this.$options['sockets']).forEach(key => delete this.$options.sockets[key])
        }
      }
    })
  }
}
