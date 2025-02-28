
import { env } from './config';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupDatabase() {
  console.log('Setting up database...');
  
  try {
    const sql = neon(env.DATABASE_URL);
    
    // Read and execute SQL migration file
    const migrationFile = path.join(__dirname, '../migrations/initial-schema.sql');
    const migrationSql = fs.readFileSync(migrationFile, 'utf8');
    
    await sql(migrationSql);
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Execute if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase };
