// Run database migration
require('./server/migrate').migrate()
  .then(() => {
    console.log('Database schema push completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database schema push failed:', err);
    process.exit(1);
  });