// Run database seeding
require('./server/seed').seed()
  .then(() => {
    console.log('Database seeding completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database seeding failed:', err);
    process.exit(1);
  });