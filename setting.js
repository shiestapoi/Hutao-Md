import path from 'path'

const timeZone = 'Asia/Jakarta'

const tempName = 'temp'
global.tempDir = path.resolve(new URL('.', import.meta.url).pathname, tempName)

const owner = [
    ['6283897390164', 'NeofetchNpc'],
    ['6283897390164']
]

const defaultPrefix = ['/', '!', '#', '.', '-', '🗿']

const EmojiSw = ["🖤", "🤎", "💜", "💙", "💚", "💛", "🧡", "❤️", "🤍"];

export { timeZone, owner, defaultPrefix, EmojiSw }
