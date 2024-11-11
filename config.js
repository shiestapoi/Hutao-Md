import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'

/*============== STAFF ==============*/
global.owner = [
  ['6283897390164', '❦ YusupKakuu', true] //Ganti jd nomormu sama Namamu
  // [number, dia creator/owner?, dia developer?]
] // Put your number here
global.mods = [] // Want some help?
global.prems = [] // Premium user bukan disini nambahinnya, ketik .addprem @user 10

/*============== STICKER WM ==============*/
global.stickpack = 'HutawBy YusupKakuu'
global.stickauth = `☂︎Hutaw-MD`
global.packname = 'Sticker Request By '

//------ JANGAN DIUBAH -----
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
