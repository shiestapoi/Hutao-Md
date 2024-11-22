import { InstagramDL } from 'neastooapi'
import axios from 'axios'

export const cmd = {
    name: ['igdl'],
    command: ['igdl'],
    category: ['download'],
    detail: {
        desc: 'Mendownload video dari Instagram',
        use: 'url Instagram'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) return m.reply(`Masukkan URL Instagramnya.\nExample: ${prefix + command} https://www.instagram.com/p/example`)
        try {
            // Panggil modul InstagramDL untuk mendapatkan data video
            const response = await InstagramDL(text);
            if (response.success && response.data && response.data.length > 0) {
                const videoUrl = response.data[0].url;  // Ambil URL video

                // Kirim pesan dengan video ke WhatsApp
                conn.sendMessage(m.from, { video: { url: videoUrl }, caption: 'Ini video dari Instagram' }, { quoted: m });

                m.reply(`Video ditemukan dan sedang dikirim...`);
            } else {
                m.reply('Tidak ditemukan video pada URL yang diberikan.');
            }
        } catch (error) {
            console.log(error);
            m.reply('Gagal mendownload video.');
        }
    }
}
