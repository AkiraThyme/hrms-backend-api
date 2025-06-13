// libs
const redis = require('redis')
const destr = require('destr')

// constants
const env = require('@constants/env')
class Redis {
  constructor () {
    this.client = null
    this.publisher = null
    this.subscriber = null
  }

  async start () {
    this.client = await this.connect()
    this.publisher = await this.duplicate()
  }

  async connect () {
    if (this.client) {
      console.log('A client is already registered. Use `duplicate` instead')
      return this.client
    }

    const instance = redis.createClient({
      url: `redis://@${env.REDIS.HOST}:${env.REDIS.PORT}/${env.REDIS.DB}`
    })

    await instance.connect()

    instance.on('error', e => console.log('Redis instance: ', e.stack))

    return instance
  }

  async subscribe (url, handler) {
    const sub = await this.duplicate()

    sub.subscribe(url, handler)
  }

  async duplicate () {
    const instance = this.client.duplicate()

    await instance.connect()

    return instance
  }

  publish (namespace, event, data) {
    if (data) {
      return this.publisher.publish(
        `${namespace}:${event}`,
        JSON.stringify(data)
      )
    } else {
      return this.publisher.publish(
        `${namespace}:${event}`,
        '1'
      )
    }
  }

  async get (key) {
    const data = await this.client.get(key)
    return destr(data)
  }

  async set (key, value, ttl) {
    await this.client.set(key, JSON.stringify(value), {
      EX: ttl || env.REDIS.CACHE_TTL
    })
  }

  async sAdd (referenceKey, key) {
    await this.client.sAdd(referenceKey, key)
  }

  async dynamicDelete (referenceKey) {
    const keys = await this.client.sMembers(referenceKey)

    if (keys.length) {
      await this.client.del(...keys)
      await this.client.del(referenceKey)
    }
  }

  async delete (key) {
    await this.client.del(key)
  }

  async rpush (key, value, ttl) {
    const data = await this.get(key)
    if (data && data.length > 0) {
      data.push(value)
      await this.set(key, data, ttl)
    } else {
      await this.set(key, [value], ttl)
    }
  }

  async lpush (key, value, ttl) {
    const data = await this.get(key)
    if (data && data.length > 0) {
      data.unshift(value)
      await this.set(key, data, ttl)
    } else {
      await this.set(key, [value], ttl)
    }
  }

  async getCacheKeyValuePairs (referenceKey) {
    const keysInSet = await this.client.sMembers(referenceKey)

    if (keysInSet.length) {
      const keyValuePairs = await Promise.all(
        keysInSet.map(async key => {
          const value = await this.client.get(key)
          return { key, value }
        })
      )

      return keyValuePairs
    }

    return []
  }
}

module.exports = new Redis()
