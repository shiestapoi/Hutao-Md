import { SpotifyDL } from 'neastooapi';
import axios from 'axios';

export const cmd = {
    name: ['spotify'],
    command: ['spotify'],
    category: ['download'],
    detail: {
        desc: 'Mendownload lagu dari Spotify',
        use: 'Url Spotify'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) return m.reply(`Masukkan URL Spotifynya.\nExample: ${prefix + command} https://open.spotify.com/track/example`);
        try {
            // Panggil modul SpotifyDL untuk mendapatkan data lagu
            const response = await SpotifyDL(text);
            if (response.success && response.metadata) {
                const { title, artists, album, cover } = response.metadata;
                const downloadUrl = response.link; // Link untuk mendownload lagu

                // Kirim pesan dengan informasi lagu dan thumbnail cover
                const caption = `Lagu: ${title}\n\nArtis: ${artists}\nAlbum: ${album}\nLink: ${downloadUrl}`;
                
                // Kirim file musik ke WhatsApp
                conn.sendMessage(m.from, { 
                    audio: { url: downloadUrl }, 
                    mimetype: 'audio/mp4', 
                    fileName: `${title}.mp3`, 
                    ptt: false 
                }, { quoted: m });

                m.reply(`Lagu ditemukan dan sedang dikirim...\nJudul: ${title}\nArtis: ${artists}`);
            } else {
                m.reply('Tidak ditemukan lagu pada URL yang diberikan.');
            }
        } catch (error) {
            console.log(error);
            m.reply('Gagal mendownload lagu.');
        }
    }
};
