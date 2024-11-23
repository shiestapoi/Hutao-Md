import os from 'os';
import osUtils from 'os-utils';

export const cmd = {
    name: ['ping'],
    command: ['ping'],
    category: ['main'],
    detail: {
        desc: 'Menampilkan status RAM, CPU, dan uptime sistem'
    },
    async start({ m, text, prefix, command, conn }) {
        try {
            // Mendapatkan informasi CPU, RAM, dan uptime
            const cpuUsage = await new Promise((resolve) => {
                osUtils.cpuUsage((v) => resolve(v));
            });

            const totalMemory = os.totalmem(); // Total RAM
            const freeMemory = os.freemem(); // Free RAM
            const usedMemory = totalMemory - freeMemory; // Used RAM
            const uptime = os.uptime(); // Uptime sistem dalam detik

            // Menghitung dalam format yang mudah dibaca
            const usedMemoryMB = (usedMemory / 1024 / 1024).toFixed(2); // MB
            const totalMemoryMB = (totalMemory / 1024 / 1024).toFixed(2); // MB
            const freeMemoryMB = (freeMemory / 1024 / 1024).toFixed(2); // MB
            const uptimeHrs = (uptime / 3600).toFixed(2); // Uptime dalam jam

            // Kirim status ke WhatsApp
            const response = `
Status Sistem:
- CPU Usage: ${ (cpuUsage * 100).toFixed(2) }%
- RAM Usage: ${ usedMemoryMB }MB / ${ totalMemoryMB }MB
- Free RAM: ${ freeMemoryMB }MB
- Uptime: ${ uptimeHrs } hours
`;

            m.reply(response);
        } catch (error) {
            console.log(error);
            m.reply('Gagal mengambil status sistem.');
        }
    }
};
