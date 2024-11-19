import { ytbmp3downloader } from 'neastooapi';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    if (!args[0] || !args[0].match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/)) {
        return m.reply(`Example: *${usedPrefix}${command}* https://youtu.be/v37ECJeIjBw`);
    }

    try {
        m.reply('⏳ Processing, please wait...');

        let data = await ytbmp3downloader(args[0]);

        if (!data || !data.audioUrl) {
            throw 'Error: Failed to fetch MP3 URL. Please check the input and try again.';
        }

        await conn.sendMessage(m.chat, {
            document: { url: data.audioUrl },
            mimetype: 'audio/mpeg',
            fileName: data.filename,
            caption: `*Title:* ${data.filename}`
        }, { quoted: m });
    } catch (e) {
        console.error(e);
        await m.reply('❌ Error: Unable to process your request.');
    }
};

handler.tags = ['downloader'];
handler.help = ['ytmp3 <url>'];
handler.command = /^(yt(a(udio)?|mp3))$/i;

handler.register = true;
handler.limit = true;

export default handler;
