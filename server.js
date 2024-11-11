import express from 'express';
import fetch from 'node-fetch';
import axios from 'axios';
import { exec } from 'child_process';
// import path from 'path';

const app = global.app = express();

function connect(PORT) {
    app.get('/', (req, res) => res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hello World</title>
        </head>
        <body>
            <h1>Hello, World!</h1>
        </body>
        </html>
    `));

    // Uncomment this section to use an external HTML file
    // app.get('/', (req, res) => {
    //     const indexPath = path.join(__dirname, 'views', 'index.html');
    //     res.sendFile(indexPath);
    // });

    app.get('/nowa', async (req, res) => {
        const q = req.query.number;
        const regex = /x/g;

        if (!q) return res.send('Input Parameter Number Parameter');
        if (!q.match(regex)) return res.send('Parameter Number Must Fill With One Letter "x"');

        const random = q.match(regex).length;
        const total = Math.pow(10, random);
        const array = [];

        for (let i = 0; i < total; i++) {
            const list = [...i.toString().padStart(random, '0')];
            const result = q.replace(regex, () => list.shift()) + '@s.whatsapp.net';

            if (await conn.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
                const info = await conn.fetchStatus(result).catch(() => {});
                array.push({ jid: result, exists: true, ...info });
            } else {
                array.push({ jid: result, exists: false });
            }
        }

        res.json({ result: array });
    });

    app.get('/speedtest', (req, res) => {
        exec('speedtest', (error, stdout, stderr) => {
            if (error) {
                res.status(500).send(`<p>Speedtest failed</p><p>Error: ${error.message}</p>`);
                return;
            }

            res.status(200).send(`
                <h2>Speedtest Results</h2>
                <pre>${stdout}</pre>
            `);
        });
    });

    app.get('/ping', (req, res) => {
        res.status(200).send('Ping successful');
    });

    app.get('/ping2', async (req, res) => {
        const pingResults = [];

        for (let i = 0; i < 10; i++) {
            try {
                const response = await axios.get(`http://dono-03.danbot.host:2346`);
                pingResults.push(`Ping result ${i + 1}: ${response.data} ${response.status}<br />`);
            } catch (error) {
                pingResults.push(`Error pinging ${i + 1}: ${error}`);
            }
        }

        res.status(200).send(pingResults.join('\n\n\n'));
    });

    app.listen(PORT, () => {
        keepAlive();
        console.log('App listened on port', PORT);
    });
}

function keepAlive() {
    const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
    const url2 = 'http://dono-03.danbot.host:2346';

    if (!/(\/\/|\.)undefined\./.test(url)) {
        setInterval(() => fetch(url).catch(console.log), 30 * 1000);
    }

    if (!/(\/\/|\.)undefined\./.test(url2)) {
        setInterval(() => fetch(url2).catch(console.log), 30 * 1000);
    }
}

function formatDate(n, locale = 'id') {
    const d = new Date(n);
    return d.toLocaleDateString(locale, { timeZone: 'Asia/Jakarta' });
}

export default connect;
