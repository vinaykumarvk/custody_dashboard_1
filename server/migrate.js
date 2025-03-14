require('dotenv').config();
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { db, pool } = require('./db');
const schema = require('../shared/schema');

// Execute migrations
async function runMigration() {
  console.log('Starting database migration...');
  
  try {
    // Since we're not using drizzle-kit for migrations in this setup,
    // we'll push the schema directly to the database (similar to drizzle-kit push)
    // This works for development, but in production you'd want proper migrations
    await pool.query(`
      CREATE SCHEMA IF NOT EXISTS public;
    `);
    
    // Create tables based on our schema
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS customers (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          account_number VARCHAR(50) NOT NULL UNIQUE,
          type VARCHAR(50) NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS accounts (
          id SERIAL PRIMARY KEY,
          customer_id INTEGER NOT NULL REFERENCES customers(id),
          account_number VARCHAR(50) NOT NULL UNIQUE,
          type VARCHAR(50) NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS trades (
          id SERIAL PRIMARY KEY,
          trade_id VARCHAR(50) NOT NULL UNIQUE,
          trade_date TIMESTAMP NOT NULL,
          customer_id INTEGER NOT NULL REFERENCES customers(id),
          customer_name VARCHAR(255) NOT NULL,
          asset_name VARCHAR(255) NOT NULL,
          asset_class VARCHAR(50) NOT NULL,
          quantity REAL NOT NULL,
          price REAL NOT NULL,
          amount REAL NOT NULL,
          type VARCHAR(10) NOT NULL,
          status VARCHAR(20) NOT NULL,
          settlement_date TIMESTAMP,
          settlement_status VARCHAR(20),
          exchange VARCHAR(50),
          settlement_location VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS corporate_actions (
          id SERIAL PRIMARY KEY,
          action_id VARCHAR(50) NOT NULL UNIQUE,
          type VARCHAR(50) NOT NULL,
          asset_name VARCHAR(255) NOT NULL,
          mandatory BOOLEAN NOT NULL DEFAULT TRUE,
          announcement_date DATE NOT NULL,
          record_date DATE,
          payment_date DATE,
          status VARCHAR(20) NOT NULL,
          priority VARCHAR(10) NOT NULL DEFAULT 'normal',
          pending_election BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS assets_under_custody (
          id SERIAL PRIMARY KEY,
          date DATE NOT NULL,
          total_value REAL NOT NULL,
          equities_value REAL NOT NULL,
          fixed_income_value REAL NOT NULL,
          alternative_assets_value REAL NOT NULL,
          cash_value REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS trades_by_asset (
          id SERIAL PRIMARY KEY,
          date DATE NOT NULL,
          asset_class VARCHAR(50) NOT NULL,
          trade_count INTEGER NOT NULL
        );
      `);
    } catch (tableError) {
      console.warn('Some tables may already exist:', tableError.message);
    }
    
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