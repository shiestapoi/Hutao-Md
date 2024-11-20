process.on('uncaughtException', console.error)

import { displayTitle } from './lib/src/print.js'
import { loadPlugins } from './lib/plugins.js'
import clearTmp from './lib/src/clearTmp.js'
import connectSock from './lib/connection.js'

displayTitle()

async function start() {
    console.log('load existing plugins....')
    await loadPlugins({ table: true })

    setInterval(async () => {
        await clearTmp()
    }, 1 * 60 * 1000)

    await connectSock()
        .catch(e => console.log(e))
}

start()