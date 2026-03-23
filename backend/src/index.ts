/**
 * Server Entry Point
 *
 * Imports the configured Express app and starts the HTTP server on port 3000.
 * This file is NOT imported by tests — supertest uses app.ts directly.
 */

import app from './app';

const PORT = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
