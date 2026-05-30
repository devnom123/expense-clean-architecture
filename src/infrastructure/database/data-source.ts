import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'wxpense',
  password: process.env.DB_PASSWORD ?? 'wxpense',
  database: process.env.DB_NAME ?? 'wxpense',
  entities: ['src/infrastructure/persistence/entities/*.entity.ts'],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: false,
});
