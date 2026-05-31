import { LogLevel } from '../infrastructure/logging/log-level.enum';

const nodeEnv = process.env.NODE_ENV ?? 'development';

export default () => ({
  nodeEnv,
  port: parseInt(process.env.PORT ?? '3000', 10),
  logging: {
    level:
      process.env.LOG_LEVEL ??
      (nodeEnv === 'production' ? LogLevel.Info : LogLevel.Debug),
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'wxpense',
    password: process.env.DB_PASSWORD ?? 'wxpense',
    name: process.env.DB_NAME ?? 'wxpense',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },
  cors: {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  },
  jwt: {
    secret:
      process.env.JWT_SECRET ??
      'dev-only-change-this-secret-key-min-32-chars',
    /** 7 days in seconds */
    expiresIn: parseInt(
      process.env.JWT_EXPIRES_IN_SECONDS ?? String(7 * 24 * 60 * 60),
      10,
    ),
  },
});
