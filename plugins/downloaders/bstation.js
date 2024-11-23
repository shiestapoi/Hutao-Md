import fetch from 'node-fetch';

export const cmd = {
    name: ['bstation'],
    command: ['bstation', 'bilibili'],
    category: ['download'],
    detail: {
        desc: 'Unduh video dari bilibili.tv',
        use: 'url'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) {
            return m.reply(`Masukkan URL video bilibili.tv.\nContoh: ${prefix + command} https://www.bilibili.tv/id/video/4793141561528832?bstar_from=bstar-web.homepage.trending.all`);
        }

        try {
            const apiUrl = `https://api.neastooid.xyz/api/downloader/bstasion?url=${encodeURIComponent(text)}`;
            const response = await fetch(apiUrl);
            const result = await response.json();

            if (!result.status || !result.data.mediaList.videoList[0]?.url) {
                return m.reply('Gagal mengunduh video. Pastikan URL yang diberikan valid.');
            }

            // Ambil data dari respon API
            const videoData = result.data.mediaList.videoList[0];
            const videoUrl = videoData.url;
            const fileName = videoData.filename || 'video.mp4';

            console.log('Mengirim video:', fileName);

            // Streaming video langsung ke WhatsApp
            const videoResponse = await fetch(videoUrl);

            if (!videoResponse.ok) {
                return m.reply('Gagal mengunduh video dari URL.');
            }

            await conn.sendMessage(m.from, {
                document: { url: videoUrl },
                mimetype: 'video/mp4',
                fileName: fileName
            }, { quoted: m });

            console.log('Video berhasil dikirim.');

        } catch (error) {
            console.error('Error:', error);
            m.reply('Terjadi kesalahan saat memproses permintaan.');
        }
    }
};
