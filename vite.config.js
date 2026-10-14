import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import { createApiRouter } from './server/api.js';

function expressApiPlugin() {
  return {
    name: 'express-api-middleware',
    configureServer(server) {
      const app = express();
      app.use('/api', createApiRouter());
      server.middlewares.use(app);
    },
  };
}

export default defineConfig({
  plugins: [react(), expressApiPlugin()],
  server: {
    port: 3000,
  },
});
