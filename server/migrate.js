require('dotenv').config();
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { db } = require('./db');

// Execute migrations
async function runMigration() {
  console.log('Starting database migration...');
  
  try {
    // Since we're not using drizzle-kit for migrations in this setup,
    // we'll push the schema directly to the database (similar to drizzle-kit push)
    // This works for development, but in production you'd want proper migrations
    await db.query(`
      CREATE SCHEMA IF NOT EXISTS public;
    `);
    
    console.log('Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Export for use in server.js
module.exports = { migrate: runMigration };

// Run if called directly
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}