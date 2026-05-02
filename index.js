import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { createBareServer } from '@tomphttp/bare-server-node';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bare = createBareServer('/bare/');
const app = express();

app.use(express.static(path.join(__dirname, 'static')));
app.use('/uv/', express.static(uvPath));

app.get('/s', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'search.html'));
});

const server = createServer();

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.route(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen(3000, () => console.log('Running on http://localhost:3000'));
