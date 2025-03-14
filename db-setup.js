// Run complete database setup (migration + seeding + historical data)
async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Run migrations
    await require('./server/migrate').migrate();
    console.log('Database migrations completed');
    
    // Run seeding
    await require('./server/seed').seed();
    console.log('Database seeding completed');
    
    // Inject historical data
    console.log('Injecting historical data...');
    await require('./server/inject-historical-data').injectHistoricalData();
    console.log('Historical data injection completed');
    
    console.log('Database setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Database setup failed:', error);
    return false;
  }
}

setupDatabase()
  .then(success => {
    process.exit(success ? 0 : 1);
  });