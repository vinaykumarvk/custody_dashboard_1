// Run only the historical data injection
async function injectHistoricalData() {
  try {
    console.log('Starting historical data injection...');
    
    // Inject historical data
    await require('./server/inject-historical-data').injectHistoricalData();
    
    console.log('Historical data injection completed successfully!');
    return true;
  } catch (error) {
    console.error('Historical data injection failed:', error);
    return false;
  }
}

injectHistoricalData()
  .then(success => {
    process.exit(success ? 0 : 1);
  });