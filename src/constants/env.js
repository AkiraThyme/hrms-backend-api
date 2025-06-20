/* eslint-disable no-process-env */
require('dotenv').config()

const env = process.env

module.exports = {
  NODE_ENV: env.NODE_ENV,
  CLUSTER_COUNT: env.CLUSTER_COUNT,
  APP: {
    HOST: env.APP_HOST,
    SECRET_KEY: env.APP_SECRET_KEY,
    PORT: env.APP_PORT
  },
  SOCKET: {
    HOST: env.SOCKET_HOST,
    PORT: env.SOCKET_PORT
  },
  DB: {
    HOST: env.DB_HOST,
    USER: env.DB_USER,
    PASS: env.DB_PASS,
    NAME: env.DB_NAME,
    PORT: env.DB_PORT
  },
  REDIS: {
    HOST: env.REDIS_HOST,
    PORT: env.REDIS_PORT,
    DB: env.REDIS_DB,
    CACHE_TTL: env.REDIS_CACHE_TTL
  },
  JWT: {
    EXPIRES_IN: env.JWT_EXPIRES_IN,
    SECRET_KEY: env.JWT_SECRET_KEY
  }
}
