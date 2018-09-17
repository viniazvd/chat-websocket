import io from 'socket.io-client'

function emit (event, payload) {
  console.log(event, payload)
  const listener = this.listeners.find(listener => event === listener.key)

  if (listener && listener.callback) listener.callback.call(this, payload)
}

export default {
  install (Vue, connection) {
    if (!connection) throw new Error('[vue-coe-websocket] cannot locate connection')

    Vue.mixin({
      created () {
        const socket = io(connection)
        socket.onevent = packet => emit.apply(this, packet.data)

        Vue.prototype.$socket = socket

        const sockets = this.$options['sockets']

        if (sockets) {
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

          Object.keys(sockets).forEach(key => (this.$options.sockets[key] = sockets[key]))
        }
      },

      data () {
        return {
          listeners: []
        }
      },

      // methods: {
      //   emit ([ event, payload ]) {
      //     const listener = this.listeners.find(listener => event === listener.key)

      //     if (listener && listener.callback) listener.callback.call(this, payload)
      //   }
      // },

      beforeDestroy () {
        if (this.$options['sockets']) {
          Object.keys(this.$options['sockets']).forEach(key => delete this.$options.sockets[key])
        }
      }
    })
  }
}
