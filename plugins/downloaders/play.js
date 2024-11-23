import ytSearch from 'yt-search';
import { ytbmp3downloader } from 'neastooapi';

export const cmd = {
    name: ['play'],
    command: ['play'],
    category: ['download'],
    detail: {
        desc: 'Mencari dan mengunduh audio dari YouTube',
        use: 'query'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) {
            return m.reply(`Masukkan judul audio yang ingin dicari.\nContoh: ${prefix + command} windah batubara`);
        }

        try {
            // Cari video di YouTube berdasarkan query
            const res = await ytSearch(text);
            if (!res || res.videos.length === 0) {
                return m.reply('Audio tidak ditemukan.');
            }

            // Ambil metadata dari video pertama hasil pencarian
            const video = res.videos[0];
            const videoUrl = video.url;
            const title = video.title;
            const thumbnail = video.thumbnail;
            const duration = video.timestamp;

            console.log('URL Audio:', videoUrl);

            // Kirim pesan sementara dengan thumbnail
            await conn.sendMessage(m.from, {
                image: { url: thumbnail },
                caption: `🎶 *Audio sedang dikirim...*\n\n📌 *Judul*: ${title}\n⏱️ *Durasi*: ${duration}\n🔗 *URL*: ${videoUrl}`
            }, { quoted: m });

            // Unduh audio menggunakan ytbmp3downloader
            const downloadData = await ytbmp3downloader(videoUrl);
            if (!downloadData || !downloadData.url) {
                return m.reply('Gagal mengunduh audio.');
            }

            // Kirim audio ke WhatsApp
            const audioUrlToSend = downloadData.url;
            const fileName = downloadData.filename || `${title}.mp3`;

            console.log('Download URL:', audioUrlToSend);
            console.log('File Name:', fileName);

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
