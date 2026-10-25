import dotenv from 'dotenv';
import { connectDatabase } from './config/database.ts';
import { createBackendApp } from './app.ts';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = createBackendApp();

async function startBackend() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`EventDesk Backend API server running on http://localhost:${PORT}`);
  });
}

startBackend().catch((err) => {
  console.error('Failed to start backend server:', err);
  process.exit(1);
});
