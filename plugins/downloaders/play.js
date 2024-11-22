import ytSearch from 'yt-search';
import { ytbmp4downloader } from 'neastooapi';

export const cmd = {
    name: ['play'],
    command: ['play'],
    category: ['download'],
    detail: {
        desc: 'Mencari dan mengunduh video dari YouTube',
        use: 'play <query>'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) {
            return m.reply(`Masukkan judul video yang ingin dicari.\nContoh: ${prefix + command} windah batubara`);
        }

        try {
            // Cari video di YouTube berdasarkan query
            const res = await ytSearch(text);
            if (!res || res.videos.length === 0) {
                return m.reply('Video tidak ditemukan.');
            }

            // Ambil URL video pertama dari hasil pencarian
            const videoUrl = res.videos[0].url;
            console.log('URL Video:', videoUrl);

            // Unduh video menggunakan ytbmp4downloader
            const downloadData = await ytbmp4downloader(videoUrl);
            if (downloadData.status !== 'tunnel') {
                return m.reply('Gagal mengunduh video.');
            }

            // Kirim video ke WhatsApp
            const videoUrlToSend = downloadData.url;
            const fileName = downloadData.filename;

            console.log('Download URL:', videoUrlToSend);
            console.log('File Name:', fileName);

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
