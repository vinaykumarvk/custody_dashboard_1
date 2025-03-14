require('dotenv').config();
const { db } = require('./db');
const schema = require('../shared/schema');

async function seed() {
  console.log('Starting database seeding...');
  
  try {
    // Check if we have existing data
    try {
      const customersCount = await db.select({ count: 'count(*)' }).from(schema.customers);
      if (customersCount.length > 0 && parseInt(customersCount[0].count) > 0) {
        console.log('Database already has data, skipping seed');
        return true;
      }
    } catch (error) {
      // Tables probably don't exist yet, continue with seeding
      console.log('Tables not yet created, proceeding with seeding');
    }
    
    // Seed customers
    console.log('Seeding customers...');
    const customers = [
      {
        name: 'BlackRock Inc.',
        accountNumber: 'C-10001',
        type: 'Institutional',
        status: 'active'
      },
      {
        name: 'Vanguard Group',
        accountNumber: 'C-10002',
        type: 'Institutional',
        status: 'active'
      },
      {
        name: 'Fidelity Investments',
        accountNumber: 'C-10003',
        type: 'Institutional',
        status: 'active'
      },
      {
        name: 'State Street Global',
        accountNumber: 'C-10004',
        type: 'Institutional',
        status: 'active'
      },
      {
        name: 'PIMCO',
        accountNumber: 'C-10005',
        type: 'Institutional',
        status: 'active'
      }
    ];
    
    // Insert customers
    for (const customer of customers) {
      await db.insert(schema.customers).values(customer);
    }
    
    // Seed accounts
    console.log('Seeding accounts...');
    let customerIndex = 0;
    for (let i = 0; i < 10; i++) {
      const customerId = (customerIndex % 5) + 1; // 1-5
      await db.insert(schema.accounts).values({
        customerId: customerId,
        accountNumber: `A-2000${i}`,
        type: i % 3 === 0 ? 'Custody' : i % 3 === 1 ? 'Trading' : 'Settlement',
        status: 'active'
      });
      customerIndex++;
    }
    
    // Seed trades
    console.log('Seeding trades...');
    const assetClasses = ['Equities', 'Fixed Income', 'Commodities', 'FX', 'Funds'];
    const exchanges = ['NYSE', 'NASDAQ', 'LSE', 'TSE', 'HKEX'];
    const settlementLocations = ['DTC', 'Euroclear', 'Clearstream', 'JASDEC', 'HKSCC'];
    const statuses = ['Completed', 'Pending', 'Failed'];
    
    for (let i = 0; i < 50; i++) {
      const customerId = (i % 5) + 1; // 1-5
      const customerName = customers[customerId - 1].name;
      const assetClass = assetClasses[i % assetClasses.length];
      const tradeDate = new Date();
      tradeDate.setDate(tradeDate.getDate() - (i % 30)); // Last 30 days
      
      const settlementDate = new Date(tradeDate);
      settlementDate.setDate(settlementDate.getDate() + 2); // T+2 settlement
      
      const price = 100 + (i * 5); // Varies from 100 to 345
      const quantity = 1000 + (i * 100); // Varies from 1000 to 5900
      const amount = price * quantity;
      
      const status = statuses[i % statuses.length];
      
      await db.insert(schema.trades).values({
        tradeId: `T-${100000 + i}`,
        tradeDate: tradeDate.toISOString(),
        customerId: customerId,
        customerName: customerName,
        assetName: `${['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB'][i % 5]} ${assetClass}`,
        assetClass: assetClass,
        amount: amount,
        quantity: quantity,
        price: price,
        type: i % 2 === 0 ? 'Buy' : 'Sell',
        status: status,
        settlementDate: settlementDate.toISOString(),
        settlementStatus: status === 'Completed' ? 'Completed' : status === 'Pending' ? 'Pending' : 'Failed',
        exchange: exchanges[i % exchanges.length],
        settlementLocation: settlementLocations[i % settlementLocations.length]
      });
    }
    
    // Seed corporate actions
    console.log('Seeding corporate actions...');
    const caTypes = ['Dividend', 'Stock Split', 'Rights Issue', 'Merger', 'Redemption'];
    const caStatuses = ['Announced', 'Pending', 'Completed', 'Processing'];
    
    for (let i = 0; i < 20; i++) {
      const announcementDate = new Date();
      announcementDate.setDate(announcementDate.getDate() - (i % 60)); // Last 60 days
      
      const recordDate = new Date(announcementDate);
      recordDate.setDate(recordDate.getDate() + 10); // 10 days after announcement
      
      const paymentDate = new Date(recordDate);
      paymentDate.setDate(paymentDate.getDate() + 5); // 5 days after record date
      
      await db.insert(schema.corporateActions).values({
        actionId: `CA-${200000 + i}`,
        type: caTypes[i % caTypes.length],
        assetName: `${['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB'][i % 5]} Equity`,
        mandatory: i % 3 !== 0, // 2/3 are mandatory
        announcementDate: announcementDate.toISOString().split('T')[0],
        recordDate: recordDate.toISOString().split('T')[0],
        paymentDate: paymentDate.toISOString().split('T')[0],
        status: caStatuses[i % caStatuses.length],
        priority: i % 5 === 0 ? 'high' : i % 5 === 1 ? 'low' : 'normal',
        pendingElection: i % 5 === 0 // 20% have pending elections
      });
    }
    
    // Seed assets under custody historical data
    console.log('Seeding assets under custody data...');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 180); // 180 days of data
    
    for (let i = 0; i < 180; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      // Create a trend with some randomness
      const baseValue = 4000000000000; // 4 trillion base
      const dayFactor = 1 + (i * 0.0005); // Small increase per day
      const randomFactor = 0.98 + (Math.random() * 0.04); // Random fluctuation between 0.98 and 1.02
      
      const totalValue = baseValue * dayFactor * randomFactor;
      const equitiesValue = totalValue * 0.44 * (0.98 + (Math.random() * 0.04));
      const fixedIncomeValue = totalValue * 0.36 * (0.98 + (Math.random() * 0.04));
      const alternativeAssetsValue = totalValue * 0.12 * (0.98 + (Math.random() * 0.04));
      const cashValue = totalValue - equitiesValue - fixedIncomeValue - alternativeAssetsValue;
      
      await db.insert(schema.assetsUnderCustody).values({
        date: currentDate.toISOString().split('T')[0],
        totalValue: totalValue,
        equitiesValue: equitiesValue,
        fixedIncomeValue: fixedIncomeValue,
        alternativeAssetsValue: alternativeAssetsValue,
        cashValue: cashValue
      });
    }
    
    // Seed trades by asset
    console.log('Seeding trades by asset data...');
    const assetClassesForStats = ['Equity', 'Fixed Income', 'FX', 'Fund', 'Commodity'];
    
    // Generate 180 days of data for each asset class
    for (let i = 0; i < 180; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      for (const assetClass of assetClassesForStats) {
        // Base count with weekly pattern (higher on certain days)
        let baseCount = 10 + (i % 7 === 3 ? 15 : i % 7 === 4 ? 10 : 0);
        
        // Asset-specific multipliers
        const assetMultiplier = 
          assetClass === 'Equity' ? 3 : 
          assetClass === 'Fixed Income' ? 2 : 
          assetClass === 'FX' ? 1.5 : 
          assetClass === 'Fund' ? 1.2 : 
          1; // Commodity
        
        // Add randomness
        const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
        
        // Calculate final count
        const tradeCount = Math.round(baseCount * assetMultiplier * randomFactor);
        
        await db.insert(schema.tradesByAsset).values({
          date: currentDate.toISOString().split('T')[0],
          assetClass: assetClass,
          tradeCount: tradeCount
        });
      }
    }
    
    console.log('Seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

// Export for use in server.js
module.exports = { seed };

// Run if called directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}