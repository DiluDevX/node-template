import express, { ErrorRequestHandler } from 'express';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { environment } from './config/environment';
import { errorHandler } from './middleware/error-handler.middleware';
import { rateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import routes from './routes';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// global rate limiter
app.use(rateLimiterMiddleware);

// Routes
app.use(routes);

// Global error handler (must be last middleware)
app.use(errorHandler as ErrorRequestHandler);

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(environment.port, () => {
      logger.info(
        { port: environment.port, env: environment.env, service: environment.serviceName },
        'Server started successfully'
      );
    });
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();
