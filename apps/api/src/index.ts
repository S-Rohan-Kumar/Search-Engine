import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { dbPool } from './db.js';
import { redisClient } from './redis.js';
import type { HealthStatus } from '@crawlscope/shared-types';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config();

const app = express();
const port = parseInt(process.env.API_PORT || '4000', 10);
const startTime = Date.now();

app.use(express.json());

app.get('/health', async (_req: Request, res: Response) => {
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    services: {
      postgres: { status: 'down' },
      redis: { status: 'down' },
    },
  };

  const pgStart = Date.now();
  try {
    await dbPool.query('SELECT 1');
    health.services.postgres = {
      status: 'up',
      latencyMs: Date.now() - pgStart,
    };
  } catch (err: any) {
    health.services.postgres = {
      status: 'down',
      error: err.message,
    };
    health.status = 'degraded';
  }

  const redisStart = Date.now();
  try {
    if (redisClient.status !== 'ready' && redisClient.status !== 'connecting') {
      await redisClient.connect();
    }
    const pong = await redisClient.ping();
    if (pong === 'PONG') {
      health.services.redis = {
        status: 'up',
        latencyMs: Date.now() - redisStart,
      };
    } else {
      throw new Error(`Unexpected Redis response: ${pong}`);
    }
  } catch (err: any) {
    health.services.redis = {
      status: 'down',
      error: err.message,
    };
    health.status = 'degraded';
  }

  if (health.services.postgres.status === 'down' && health.services.redis.status === 'down') {
    health.status = 'unhealthy';
  }

  const httpStatus = health.status === 'healthy' ? 200 : 503;
  return res.status(httpStatus).json(health);
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'CrawlScope API',
    version: '0.1.0',
    endpoints: {
      health: '/health',
    },
  });
});

app.listen(port, () => {
  console.log(`[CrawlScope API] Server listening on http://localhost:${port}`);
  console.log(`[CrawlScope API] Health check available at http://localhost:${port}/health`);
});