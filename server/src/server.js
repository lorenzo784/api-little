import { createServer } from 'http';
import app from './app.js';
import { env } from './config/env.js';

const server = createServer(app);
const port = env.PORT || 3000;

server.listen(port, '0.0.0.0', () => {
  console.log(`[server] listening on http://0.0.0.0:${port}`);
});
