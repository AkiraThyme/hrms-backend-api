// libs
const { Server } = require('socket.io')
const _ = require('lodash')

// config
const redis = require('@config/redis')

// constants
const env = require('@constants/env')

class Socket {
  constructor () {
    this.client = null
  }

  get namespaces () {
    return new Set()
  }

  async start () {
    this.client = new Server(env.SOCKET.PORT, {
      transports: ['websocket', 'polling'],
      rejectUnauthorized: false,
      maxHttpBufferSize: 1e8
    })

    this.namespaces.forEach(namespace => {
      const ns = `ns${_.capitalize(namespace)}`
      this[ns] = this.client.of(namespace)
    })

    await this.listenToRedis()
  }

  async listenToRedis () {
    const sub = await redis.duplicate()

    sub.pSubscribe('socket:*', (message, channel) => {
      this.handleRedisEmit(message, channel)
    })
  }

  handleRedisEmit (message, channel) {
    const channelArray = channel.split(':')

    if (channelArray.length < 3) {
      return
    }

    const namespace = channelArray[1]
    const event = channelArray[2]

    if (this.namespaces.has(namespace)) {
      this[`ns${_.capitalize(namespace)}`].emit(event, message)
    }
  }
}

module.exports = new Socket()
