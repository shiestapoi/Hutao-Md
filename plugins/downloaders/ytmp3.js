import { ytbmp3downloader } from 'neastooapi';

export const cmd = {
    name: ['ytmp3'],
    command: ['ytmp3'],
    category: ['download'],
    detail: {
        desc: 'Unduh audio MP3 dari YouTube menggunakan tautan',
        use: 'Link YouTube'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) {
            return m.reply(`Masukkan link YouTube untuk mengunduh audio MP3.\nContoh: ${prefix + command} https://youtu.be/example`);
        }

        // Validasi apakah teks adalah tautan YouTube
        const ytLinkPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        if (!ytLinkPattern.test(text)) {
            return m.reply('Harap masukkan tautan YouTube yang valid.');
        }

        try {
            // Unduh audio menggunakan ytbmp3downloader
            const downloadData = await ytbmp3downloader(text);
            if (!downloadData || !downloadData.url) {
                return m.reply('Gagal mengunduh audio dari tautan yang diberikan.');
            }

            const audioUrlToSend = downloadData.url;
            const fileName = downloadData.filename || `audio.mp3`;

            console.log('Download URL:', audioUrlToSend);
            console.log('File Name:', fileName);

            // Kirim pesan sementara
            await conn.sendMessage(m.from, {
                text: '🎶 *Audio sedang dikirim...*'
            }, { quoted: m });

            // Kirim audio sebagai dokumen
            await conn.sendMessage(m.from, {
                document: { url: audioUrlToSend },
                mimetype: 'audio/mpeg',
                fileName: fileName
            }, { quoted: m });

        } catch (error) {
            console.log('Error:', error);
            m.reply('Terjadi kesalahan saat memproses permintaan.');
        }
    }
};
