import { createSticker } from 'sticker-maker-wa';
import { packname, author } from '../../setting.js';
import ffmpegPath from 'ffmpeg-static';

export const cmd = {
    name: ['sticker'],
    command: ['sticker', 's'],
    category: ['tools'],
    detail: {
        desc: 'Membuat gambar/video menjadi sticker (max video 10 detik)',
        use: 'reply/kirim media'
    },
    async start({ m, quoted, conn }) {
        let stiker = false;
        try {
            let mediaToDownload;

            if (m.quoted) {
                const isQuotedImage = m.quoted.type === 'imageMessage';
                const isQuotedVideo = m.quoted.type === 'videoMessage';

                if (!isQuotedImage && !isQuotedVideo) {
                    return m.reply('Media yang di-reply harus berupa gambar/video');
                }
                mediaToDownload = m.quoted;
            } else if (m.type === 'imageMessage' || m.type === 'videoMessage') {
                mediaToDownload = m;
            } else {
                return m.reply('Silakan reply atau kirim gambar/video dengan caption [prefix]sticker atau [prefix]s');
            }

            const media = await mediaToDownload.download();

            if (!media) throw 'Failed to download media';

            // Check video duration if it's a video
            if (mediaToDownload.type === 'videoMessage') {
                const duration = mediaToDownload.media.seconds;
                if (duration > 10) {
                    return m.reply('Durasi video maksimal 10 detik!');
                }
            }

            stiker = await createSticker(media, {
                ffmpeg: ffmpegPath,
                metadata: {
                    packname: packname || 'Sticker',
                    author: author || 'Bot'
                }
            });

        } catch (e) {
            console.error(e);
            return m.reply('Gagal membuat sticker, pastikan media yang dikirim adalah gambar/video');
        } finally {
            if (stiker) {
                await conn.sendMessage(m.from, { sticker: stiker }, { quoted: m });
            }
        }
    }
}