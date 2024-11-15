import { DataSource } from 'typeorm';
import { UserAdmin } from '../entities/AuthAdmin';
import { Application } from '../entities/Application';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGODB_URI,
  useUnifiedTopology: true,
  synchronize: true,
  logging: true,
  entities: [UserAdmin, Application],
});
