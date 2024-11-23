import { ytbmp4downloader } from 'neastooapi';

export const cmd = {
    name: ['ytmp4'],
    command: ['ytmp4'],
    category: ['download'],
    detail: {
        desc: 'Unduh video MP4 dari YouTube menggunakan tautan',
        use: 'Link YouTube'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) {
            return m.reply(`Masukkan link YouTube untuk mengunduh video MP4.\nContoh: ${prefix + command} https://youtu.be/example`);
        }

        // Validasi apakah teks adalah tautan YouTube
        const ytLinkPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        if (!ytLinkPattern.test(text)) {
            return m.reply('Harap masukkan tautan YouTube yang valid.');
        }

        try {
            // Unduh video menggunakan ytbmp4downloader
            const downloadData = await ytbmp4downloader(text);
            if (!downloadData || !downloadData.url) {
                return m.reply('Gagal mengunduh video dari tautan yang diberikan.');
            }

            const videoUrlToSend = downloadData.url;
            const fileName = downloadData.filename || `video.mp4`;

            console.log('Download URL:', videoUrlToSend);
            console.log('File Name:', fileName);

            // Kirim pesan sementara
            await conn.sendMessage(m.from, {
                text: '📹 *Video sedang dikirim...*'
            }, { quoted: m });

            // Kirim video sebagai dokumen
            await conn.sendMessage(m.from, {
                document: { url: videoUrlToSend },
                mimetype: 'video/mp4',
                fileName: fileName
            }, { quoted: m });

        } catch (error) {
            console.log('Error:', error);
            m.reply('Terjadi kesalahan saat memproses permintaan.');
        }
    }
};
