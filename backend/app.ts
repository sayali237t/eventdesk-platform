import express from 'express';
import requirementsRouter from './routes/requirements.ts';
import { getHealthStatus } from './controllers/requirementController.ts';
import { corsMiddleware, errorHandler } from './middleware/errorHandler.ts';

export function createBackendApp() {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json());

  // API Routes
  app.use('/api/requirements', requirementsRouter);
  app.get('/api/health', getHealthStatus);

  // Error Handler
  app.use(errorHandler);

  return app;
}
