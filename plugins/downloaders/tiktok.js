import { TiktokDL } from 'neastooapi';

export const cmd = {
    name: ['tiktok'],
    command: ['tiktok', 'tt'],
    category: ['download'],
    detail: {
        desc: 'Unduh video dan audio dari TikTok menggunakan tautan',
        use: 'Link TikTok'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) {
            return m.reply(`Masukkan link TikTok untuk mengunduh video.\nContoh: ${prefix + command} https://www.tiktok.com/@example/video/123456789`);
        }

        // Validasi apakah teks adalah tautan TikTok
        const tiktokLinkPattern = /^(https?:\/\/)?(www\.)?(tiktok\.com)\/.+$/;
        if (!tiktokLinkPattern.test(text)) {
            return m.reply('Harap masukkan tautan TikTok yang valid.');
        }

        try {
            // Mengunduh data TikTok menggunakan TiktokDL
            const response = await TiktokDL(text);
            if (!response || response.code !== 0 || !response.data) {
                return m.reply('Gagal mengunduh video dari tautan yang diberikan.');
            }

            const { data } = response;
            const { title, play_count, digg_count, comment_count, share_count, music, hdplay, author } = data;

            // Mengirim detail video terlebih dahulu
            const detailMessage = `🎥 *Detail Video TikTok*\n\n` +
                `📌 *Judul*: ${title}\n` +
                `👤 *Pembuat*: ${author.nickname} (@${author.unique_id})\n` +
                `▶️ *Dilihat*: ${play_count} kali\n` +
                `❤️ *Disukai*: ${digg_count}\n` +
                `💬 *Komentar*: ${comment_count}\n` +
                `🔗 *Dibagikan*: ${share_count}\n`;

            await conn.sendMessage(m.from, { text: detailMessage }, { quoted: m });

            // Mengirim video TikTok
            await conn.sendMessage(m.from, {
                video: { url: hdplay },
                mimetype: 'video/mp4',
                caption: `🎥 *Judul*: ${title}\n📥 Video diunduh tanpa watermark.`
            }, { quoted: m });

            // Mengirim audio TikTok
            await conn.sendMessage(m.from, {
                document: { url: music },
                mimetype: 'audio/mpeg',
                fileName: `audio.mp3`,
                caption: `🎵 Audio dari video TikTok.`
            }, { quoted: m });

        } catch (error) {
            console.log('Error:', error);
            m.reply('Terjadi kesalahan saat memproses permintaan.');
        }
    }
};
