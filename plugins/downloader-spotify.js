import axios from 'axios';
import { SpotifyDL } from 'neastooapi';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Usage: ${usedPrefix + command} <url>`;

    let url = args[0];

    m.reply('⏳ Processing, please wait...');

    try {
        let response = await SpotifyDL(url);

        if (!response) throw 'Error: Failed to fetch data. Please check the URL and try again.';

        let { title, artist, album, cover, releaseDate, audioUrl } = response;

        if (!audioUrl) throw 'Error: Failed to fetch the audio URL.';

        let audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        let audioBuffer = audioResponse.data;

        await conn.sendMessage(m.chat, {
            document: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: `
*Title:* ${title}
*Artist(s):* ${artist}
*Album:* ${album}
*Release Date:* ${releaseDate}
*Cover:* ${cover}`,
        }, { quoted: m });
    } catch (err) {
        console.error(err);
        throw `Error: ${err.message}`;
    }
};

handler.help = ['spotify <url>'];
handler.tags = ['downloader'];
handler.command = /^(spotify(dl)?)$/i;

handler.limit = 2;
handler.register = true;

export default handler;
