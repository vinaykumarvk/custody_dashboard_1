require('dotenv').config();
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { db } = require('./db');

// Execute migrations
async function runMigration() {
  console.log('Starting database migration...');
  
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();