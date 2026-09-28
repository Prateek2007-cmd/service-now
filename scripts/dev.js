// HERE unified dev runner.
//
// The chat UI calls POST /api/chat. Vite proxies /api to the Express backend
// on port 5000 -- but running `vite` alone leaves that port unbound, the proxy
// returns ECONNREFUSED, and the frontend silently falls back to its local
// rule-based engine, which is why replies read as canned.
//
// Rather than run a second HTTP server, the Express app is mounted as Vite
// middleware. One port, no proxy target to keep in sync, and no way for the
// preview to latch onto the API instead of the app. The API is still reachable
// on its own port via `npm run server` for the test suite and tooling.

import { createServer } from 'vite';
import { app } from '../backend/server.js';

// PORT is injected by the preview and is the port the preview proxy forwards
// to, so the dev server must listen on exactly that port.
const previewPort = Number(process.env.PORT) || 5173;

const server = await createServer({
  // Fail loudly instead of silently moving to the next free port. When the
  // preview injects a port that is already taken, drifting to another port
  // leaves the proxy watching a port nothing is listening on, and the preview
  // looks broken with no obvious cause.
  server: { port: previewPort, strictPort: true },
  plugins: [
    {
      name: 'here-api',
      configureServer(viteServer) {
        viteServer.middlewares.use(app);
      }
    }
  ]
});

try {
  await server.listen();
} catch (err) {
  if (err.code === 'EADDRINUSE') {
    console.error('');
    console.error(`[HERE] Port ${previewPort ?? 5173} is already in use by another process.`);
    console.error('[HERE] A previous dev server is likely still running and holding the port.');
    console.error('[HERE] Stop it, then restart the preview.');
  }
  throw err;
}

console.log('');
console.log('  HERE dev stack');
console.log('  ───────────────────────────────────────────');
console.log(`  frontend + API   ${server.resolvedUrls?.local?.[0] ?? ''}`);
console.log('  health           GET  /api/health');
console.log('  chat             POST /api/chat');
console.log('  ───────────────────────────────────────────');
console.log('');

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close().finally(() => process.exit(0));
  });
}
