import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import pino from 'pino'

import { getName, formatDateInTimeZone } from './func.js'
import { timeZone } from '../../setting.js'

const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

export function colors(text, color) {
    const colorCodes = {
        reset: "\x1b[0m",
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        bgBlack: "\x1b[40m",
        bgRed: "\x1b[41m",
        bgGreen: "\x1b[42m",
        bgYellow: "\x1b[43m",
        bgBlue: "\x1b[44m",
        bgMagenta: "\x1b[45m",
        bgCyan: "\x1b[46m",
        bgWhite: "\x1b[47m",
    }

    if (color === 'rainbow') {
        const rainbowColors = [
            colorCodes.red,
            colorCodes.yellow,
            colorCodes.green,
            colorCodes.cyan,
            colorCodes.blue,
            colorCodes.magenta,
        ]

        return text.split('').map((char, index) => {
            return `${rainbowColors[index % rainbowColors.length]}${char}${colorCodes.reset}`
        }).join('')
    }

    return `${colorCodes[color] || colorCodes.reset}${text}${colorCodes.reset}`
}

export function displayTitle() {
    console.log(`
${colors('========================================', 'cyan')}
${colors('       WELCOME TO LINUCXMD PROJECT         ', 'rainbow')}
${colors('========================================', 'cyan')}
${colors(' ', 'green')}
${colors('          ╭╮╭╮╭┳━━━┳━━╮╭━━━┳━━━━╮', 'white')}
${colors('          ┃┃┃┃┃┃╭━╮┃╭╮┃┃╭━╮┃╭╮╭╮┃', 'white')}
${colors('          ┃┃┃┃┃┃┃╱┃┃╰╯╰┫┃╱┃┣╯┃┃╰╯', 'white')}
${colors('          ┃╰╯╰╯┃╰━╯┃╭━╮┃┃╱┃┃╱┃┃', 'white')}
${colors('          ╰╮╭╮╭┫╭━╮┃╰━╯┃╰━╯┃╱┃┃', 'white')}
${colors('          ╱╰╯╰╯╰╯╱╰┻━━━┻━━━╯╱╰╯', 'white')}
${colors(`.                     ${version} `, 'white')}
${colors('========================================', 'cyan')}
`)
}

export async function printLog(context) {
    const { m, conn, args, command, groupName, isGroup, isCommand } = context

    const number = (await PhoneNumber('+' + m.sender.split('@')[0])).getNumber('international')
    const text = m.text
        .replace(/\*(.*?)\*/g, (match, p1) => colors(p1, 'bold'))
        .replace(/_(.*?)_/g, (match, p1) => colors(p1, 'italic'))
        .replace(/~(.*?)~/g, (match, p1) => colors(p1, 'strikethrough'))
        .replace(/```([^`]*)```/g, (match, p1) => colors(p1.split('').join(' '), 'white'))
        .replace(/@(\d+)/g, (match, p1) => colors(
            m.mentions.includes(p1 + '@s.whatsapp.net') 
            ? '@' + getName(p1 + '@s.whatsapp.net') 
            : '@' + p1, 'green')
        )
        .replace(/(https?:\/\/[^\s]+)/g, (match, p1) => colors(p1, 'blue'))

    const header = colors(` ${isGroup ? groupName : 'Private Message'} `, 'bgGreen')
    const userInfo = `${colors('@' + (conn.user.jid === m.sender ? (conn.user?.name || 'bot') : m.pushName), 'rgb(255, 153, 0)')} (${colors(number, 'green')})`
    const commandInfo = `${colors(command, 'magenta')} [${colors(args.length.toString(), 'yellow')}]`
    const separator = colors('-'.repeat(50), 'gray')

    const log = '\n'
        + `${header} ${colors(formatDateInTimeZone(new Date(), timeZone) + ` (${timeZone})`, 'dim')}` + '\n'
        + `${userInfo} ${colors('==', 'white')} ${colors(m.from, 'blue')}` + '\n' 
        + separator + '\n' 
        + ` • ${colors('Command :', 'green')} ${isCommand ? commandInfo : colors('false', 'yellow')}` + '\n' 
        + ` • ${colors('Text :', 'green')} ${colors(text, 'white')}` + '\n' 
        + ` • ${colors('Message Type :', 'green')} ${colors(m.type, 'bgYellow')}` + '\n' 
        + separator

    console.log(log)
}