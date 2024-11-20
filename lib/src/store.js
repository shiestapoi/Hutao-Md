import { makeInMemoryStore } from '@whiskeysockets/baileys'
import pino from 'pino'

const store = makeInMemoryStore({ logger: pino().child({ level: 'fatal', stream: 'store' }) })

export default store