import { mediafireDl } from 'neastooapi';

export const cmd = {
    name: ['mediafire'],
    command: ['mediafire'],
    category: ['download'],
    detail: {
        desc: 'Unduh file dari MediaFire menggunakan tautan',
        use: 'link mediaFire'
    },
    async start({ m, text, prefix, command, conn }) {
        if (!text) {
            return m.reply(`Masukkan link MediaFire untuk mengunduh file.\nContoh: ${prefix + command} https://www.mediafire.com/file/example`);
        }

        // Validasi apakah teks adalah tautan MediaFire
        const mfLinkPattern = /^(https?:\/\/)?(www\.)?mediafire\.com\/file\/.+/;
        if (!mfLinkPattern.test(text)) {
            return m.reply('Harap masukkan tautan MediaFire yang valid.');
        }

        try {
            // Unduh file menggunakan mediafireDl
            const downloadData = await mediafireDl(text);
            if (!downloadData || !downloadData.downloadLink) {
                return m.reply('Gagal mengunduh file dari tautan yang diberikan.');
            }

            const fileUrlToSend = downloadData.downloadLink;
            const fileName = downloadData.fileName || 'file';
            const fileSize = downloadData.fileSize || 'Unknown size';
            const mimeType = downloadData.mimeType || 'application/octet-stream'; // Generic MIME type

            console.log('Download URL:', fileUrlToSend);
            console.log('File Name:', fileName);
            console.log('File Size:', fileSize);
            console.log('Mime Type:', mimeType);

            // Kirim pesan sementara
            await conn.sendMessage(m.from, {
                text: `📂 *File sedang dikirim...*\nNama file: ${fileName}\nUkuran file: ${fileSize}\nTipe MIME: ${mimeType}`
            }, { quoted: m });

            // Kirim file sebagai media (tidak spesifik ke mp3, tetapi bisa berbagai jenis file)
            await conn.sendMessage(m.from, {
                document: { url: fileUrlToSend },
                mimetype: mimeType,
                fileName: fileName,
                caption: `📂 *File dari MediaFire*`
            }, { quoted: m });

        } catch (error) {
            console.log('Error:', error);
            m.reply('Terjadi kesalahan saat memproses permintaan.');
        }
    }
};
