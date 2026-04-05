import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL || 'postgresql://demo:password@ep-demo-db.us-east-2.aws.neon.tech/extraordinary');
export const db = drizzle(sql, { schema });
