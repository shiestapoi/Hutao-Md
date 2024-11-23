import { facebookDl } from 'neastooapi';

export const cmd = {
    name: ['facebook'],
    command: ['fb', 'facebook', 'fbdl'],
    category: ['download'],
    detail: {
        desc: 'Unduh dan putar video MP4 dari Facebook menggunakan tautan',
        use: 'link facebook'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) {
            return m.reply(`Masukkan link Facebook untuk mengunduh video MP4.\nContoh: ${prefix + command} https://www.facebook.com/example`);
        }

        // Validasi apakah teks adalah tautan Facebook
        const fbLinkPattern = /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/;
        if (!fbLinkPattern.test(text)) {
            return m.reply('Harap masukkan tautan Facebook yang valid.');
        }

        try {
            // Unduh video menggunakan facebookDl
            const downloadData = await facebookDl(text);
            if (!downloadData || !downloadData.data || !downloadData.data.length) {
                return m.reply('Gagal mengunduh video dari tautan yang diberikan.');
            }

            // Ambil URL dengan resolusi 720p (HD)
            const hdVideo = downloadData.data.find(item => item.resolution === '720p (HD)');
            if (!hdVideo) {
                return m.reply('Video dengan resolusi 720p (HD) tidak ditemukan.');
            }

            const videoUrlToSend = hdVideo.url;

            // Kirim video sebagai media yang bisa diputar
            await conn.sendMessage(m.from, {
                video: { url: videoUrlToSend },
                mimetype: 'video/mp4',
                caption: '🎥 *Video ditemukan...*'
            }, { quoted: m });

        } catch (error) {
            console.log('Error:', error);
            m.reply('Terjadi kesalahan saat memproses permintaan.');
        }
    }
};
