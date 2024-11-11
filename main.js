process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './config.js';

import path, { join } from 'path';
import { platform } from 'process';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() };
global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) };
global.__require = function require(dir = import.meta.url) { return createRequire(dir) };

import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    readFileSync,
    watch
} from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import syntaxerror from 'syntax-error';
import chalk from 'chalk';
import { tmpdir } from 'os';
import readline from 'readline';
import { format } from 'util';
import pino from 'pino';
import ws from 'ws';
import {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    PHONENUMBER_MCC
} from '@adiwajshing/baileys';
import { Low, JSONFile } from 'lowdb';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import {
    mongoDB,
    mongoDBV2
} from './lib/mongoDB.js';

const { CONNECTING } = ws;
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '');

global.timestamp = {
    start: new Date()
};

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

global.db = new Low(
    /https?:\/\//.test(opts['db'] || '') ?
        new cloudDBAdapter(opts['db']) : /mongodb(\+srv)?:\/\//i.test(opts['db']) ?
            (opts['mongodbv2'] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db'])) :
            new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
);
global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
    if (db.READ) return new Promise((resolve) => setInterval(async function () {
        if (!db.READ) {
            clearInterval(this);
            resolve(db.data == null ? global.loadDatabase() : db.data);
        }
    }, 1 * 1000));
    if (db.data !== null) return;
    db.READ = true;
    await db.read().catch(console.error);
    db.READ = null;
    db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        ...(db.data || {})
    };
    global.db.chain = chain(db.data);
};
loadDatabase();

const useStore = !process.argv.includes('--use-store');
const usePairingCode = process.argv.includes('--use-pairing-code'); // Enable pairing code option
const useMobile = process.argv.includes('--mobile');

var question = function (text) {
    return new Promise(function (resolve) {
        rl.question(text, resolve);
    });
};
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const store = useStore ? makeInMemoryStore({ level: 'silent' }) : undefined;

store?.readFromFile('./hutawirstore.json');
setInterval(() => {
    store?.writeToFile('./hutawirstore.json');
}, 10_000);

const { version, isLatest } = await fetchLatestBaileysVersion();
const { state, saveCreds } = await useMultiFileAuthState('./sessions');

// Connection options with pairing code configuration
const connectionOptions = {
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false, // QR code not needed for pairing code
    browser: ['HutawMD', 'safari', '5.1.10'],
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino().child({
            level: 'silent',
            stream: 'store'
        })),
    },
    getMessage: async key => {
        const messageData = await store.loadMessage(key.remoteJid, key.id);
        return messageData?.message || undefined;
    },
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(
            message.buttonsMessage
            || message.templateMessage
            || message.listMessage
        );
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {},
                        },
                        ...message,
                    },
                },
            };
        }
        return message;
    }
};

global.conn = makeWASocket(connectionOptions);
conn.isInit = false;

if (usePairingCode) {
    if (useMobile) throw new Error('Cannot use pairing code with mobile API');
    const { registration } = { registration: {} };
    let phoneNumber = '';
    do {
        phoneNumber = await question(chalk.blueBright('Input a Valid number start with region code. Example : 62xxx:\n'));
    } while (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v)));
    rl.close();
    phoneNumber = phoneNumber.replace(/\D/g, '');
    console.log(chalk.bgWhite(chalk.blue('Generating pairing code...')));
    setTimeout(async () => {
        let code = await conn.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join('-') || code;
        console.log(chalk.black(chalk.bgGreen(`Your Pairing Code: `)), chalk.black(chalk.white(code)));
    }, 3000);
}

// Rest of your bot setup here...
// For example, setting up event handlers, connecting to database, etc.
