import path from 'path'

const timeZone = 'Asia/Jakarta'

const tempName = 'tmp'
global.tempDir = path.resolve(new URL('.', import.meta.url).pathname, tempName)

const owner = [
    ['6283897390164', 'YusupKakuu'],
    ['6282xxxxxxx']
]

const defaultPrefix = ['/', '!', '#', '.', '-', '🗿']

const EmojiSw = ["🖤", "🤎", "💜", "💙", "💚", "💛", "🧡", "❤️", "🤍"];

export { timeZone, owner, defaultPrefix, EmojiSw }
