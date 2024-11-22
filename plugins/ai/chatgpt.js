import { chatGPT } from 'neastooapi';

export const cmd = {
    name: ['chatgpt'],
    command: ['chatgpt'],
    category: ['ai'],
    detail: {
        desc: 'AI ChatGPT',
        use: 'text'
    },
    async start({ m, text }) {
        const quoted = m.quoted && m.quoted.text ? m.quoted.text : '';
        const teks = quoted ? `${quoted} ${text || ''}`.trim() : (text || '');
        if (!teks) return m.reply(`Mau nanya apa?`);
        try {
            const response = await chatGPT(teks); // Memanggil API chatGPT
            m.reply(response); // Mengirimkan hasil ke chat
        } catch (error) {
            console.error(error);
            m.reply('Gagal.');
        }
    }
};
