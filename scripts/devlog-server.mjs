// Receives the launcher's development log from the TV and appends it to logs/tv.jsonl.
// The TV must be able to reach this computer on the port below; its firewall may need to allow it.
// Under WSL the TV cannot reach Linux directly, so run this with Node on Windows or forward the port.
import { createServer } from 'node:http';
import { appendFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const port = Number(process.env.PORT) || 8099;
const dir = resolve(import.meta.dirname, '..', 'logs');
const file = resolve(dir, 'tv.jsonl');
mkdirSync(dir, { recursive: true });

createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') {
        res.writeHead(204).end();
        return;
    }
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
        appendFileSync(file, body.replace(/\n/g, ' ') + '\n');
        try {
            const entry = JSON.parse(body);
            console.log(entry.t, entry.message, entry.data ? '(+data)' : '');
        } catch {
            console.log(body.slice(0, 200));
        }
        res.writeHead(204).end();
    });
}).listen(port, '0.0.0.0', () => {
    console.log(`Dev log listening on port ${port}, writing ${file}`);
});
