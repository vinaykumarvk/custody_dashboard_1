require('dotenv').config();
const { db, pool } = require('./db');
const schema = require('../shared/schema');

async function injectHistoricalData() {
  console.log('Starting historical data injection...');
  
  try {
    // Clear existing historical data
    console.log('Clearing existing historical data...');
    await pool.query('TRUNCATE TABLE assets_under_custody');
    await pool.query('TRUNCATE TABLE trades_by_asset');
    
    // Create a start date 2 years ago
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);
    
    // Optimize by using weekly data instead of daily to reduce volume
    // This will still provide a good visualization while being much faster
    // Calculate the number of weeks for 2 years
    const totalWeeks = 2 * 52; // 104 weeks
    
    // Begin AUC at a slightly lower base to show growth over time
    const baseAucValue = 3500000000000; // 3.5 trillion base
    
    // Create quarterly growth factors to show business cycles
    const quarterlyGrowth = [
      1.02, // Q1 - moderate growth
      1.04, // Q2 - strong growth
      0.99, // Q3 - slight contraction
      1.03  // Q4 - recovery
    ];
    
    // STEP 1: Seed Assets Under Custody historical data - weekly instead of daily
    console.log('Seeding 2 years of weekly assets under custody data...');
    
    const aucBatch = [];
    
    for (let week = 0; week < totalWeeks; week++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + (week * 7)); // Weekly data points
      
      // Determine which quarter we're in based on the week number
      const quarterIndex = Math.floor((week % 52) / 13);
      
      // Use the appropriate quarterly growth factor
      const quarterlyFactor = quarterlyGrowth[quarterIndex];
      
      // Create a trend with some randomness
      const weekFactor = 1 + (week * 0.0015); // Slightly higher weekly growth
      
      // Add more variety to weekly fluctuations
      const weeklyRandomFactor = 0.99 + (Math.random() * 0.02); // Weekly fluctuations of 1% to 2%
      
      // Add occasional market events (significant spikes or drops)
      const marketEventFactor = (week % 26 === 0) ? 0.95 + (Math.random() * 0.1) : 1; // Every ~6 months
      
      // Calculate total value with all factors
      const totalValue = baseAucValue * weekFactor * quarterlyFactor * weeklyRandomFactor * marketEventFactor;
      
      // Calculate weeks since start as percentage of total period
      const periodProgress = week / totalWeeks;
      
      // Equity allocation starts lower and gradually increases
      const equityAllocation = 0.40 + (periodProgress * 0.08);
      // Fixed income gradually decreases
      const fixedIncomeAllocation = 0.40 - (periodProgress * 0.06);
      // Alternative assets gradually increase
      const alternativeAllocation = 0.10 + (periodProgress * 0.06);
      // Cash is the remainder
      const cashAllocation = 1 - equityAllocation - fixedIncomeAllocation - alternativeAllocation;
      
      // Add some randomness to allocations
      const equitiesValue = totalValue * equityAllocation * (0.97 + (Math.random() * 0.06));
      const fixedIncomeValue = totalValue * fixedIncomeAllocation * (0.97 + (Math.random() * 0.06));
      const alternativeAssetsValue = totalValue * alternativeAllocation * (0.97 + (Math.random() * 0.06));
      
      // Cash is calculated to ensure the total adds up exactly
      const cashValue = totalValue - equitiesValue - fixedIncomeValue - alternativeAssetsValue;
      
      // Add to batch for bulk insert
      aucBatch.push({
        date: currentDate.toISOString().split('T')[0],
        totalValue: totalValue,
        equitiesValue: equitiesValue,
        fixedIncomeValue: fixedIncomeValue,
        alternativeAssetsValue: alternativeAssetsValue,
        cashValue: cashValue
      });
      
      // Log progress every 10 weeks
      if (week % 10 === 0) {
        console.log(`AUC data: ${week} of ${totalWeeks} weeks processed...`);
      }
    }
    
    // Bulk insert all AUC records
    console.log(`Inserting ${aucBatch.length} AUC records...`);
    for (let i = 0; i < aucBatch.length; i += 50) {
      const batch = aucBatch.slice(i, i + 50);
      await db.insert(schema.assetsUnderCustody).values(batch);
    }
    console.log('AUC data insertion complete');
    
    // STEP 2: Seed Trades By Asset data - also weekly instead of daily
    console.log('Seeding 2 years of weekly trades by asset data...');
    const assetClassesForStats = ['Equity', 'Fixed Income', 'FX', 'Fund', 'Commodity'];
    
    // Create seasonal patterns for trade activity
    const monthlyFactors = [
      0.8,  // January - slow start to year
      0.9,  // February
      1.0,  // March - quarter end increase
      1.1,  // April - new quarter activity
      1.2,  // May - strong activity
      1.1,  // June - quarter end
      0.7,  // July - summer slowdown
      0.6,  // August - summer vacation
      0.9,  // September - back to business
      1.0,  // October
      0.95, // November
      0.85  // December - year-end slowdown
    ];
    
    // Prepare batch for trades by asset
    const tradesBatch = [];
    
    // Generate 2 years of weekly data for each asset class
    for (let week = 0; week < totalWeeks; week++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + (week * 7));
      
      // Get month for seasonal factor
      const month = currentDate.getMonth();
      const monthFactor = monthlyFactors[month];
      
      // Year-over-year growth factor (10% more trades in year 2)
      const yearFactor = (week < 52) ? 1 : 1.1;
      
      // For each asset class, generate weekly aggregated data
      for (const assetClass of assetClassesForStats) {
        // Base weekly count with seasonal patterns
        let baseWeeklyCount = 105 * monthFactor * yearFactor; // 15 per day * 7 days = 105 base weekly count
        
        // Asset-specific multipliers
        const assetMultiplier = 
          assetClass === 'Equity' ? 4.0 : 
          assetClass === 'Fixed Income' ? 2.5 : 
          assetClass === 'FX' ? 1.8 : 
          assetClass === 'Fund' ? 1.2 : 
          0.9; // Commodity
        
        // Add randomness
        const randomFactor = 0.7 + (Math.random() * 0.6); // 0.7 to 1.3
        
        // Calculate final weekly count
        const tradeCount = Math.round(baseWeeklyCount * assetMultiplier * randomFactor);
        
        // Add to batch
        tradesBatch.push({
          date: currentDate.toISOString().split('T')[0],
          assetClass: assetClass,
          tradeCount: tradeCount
        });
      }
      
      // Log progress every 10 weeks
      if (week % 10 === 0) {
        console.log(`Trades by asset data: ${week} of ${totalWeeks} weeks processed...`);
      }
    }
    
    // Bulk insert all trades by asset records
    console.log(`Inserting ${tradesBatch.length} trades by asset records...`);
    for (let i = 0; i < tradesBatch.length; i += 50) {
      const batch = tradesBatch.slice(i, i + 50);
      await db.insert(schema.tradesByAsset).values(batch);
    }
    console.log('Trades by asset data insertion complete');
    
    // Now interpolate to fill in the daily data - create daily data points between weeks
    // This will create 2 years of synthetic daily data that matches our weekly patterns
    console.log('Interpolating daily data from weekly data points...');
    
    // Get all weekly AUC data in order
    const weeklyAuc = await db.select().from(schema.assetsUnderCustody).orderBy(schema.assetsUnderCustody.date);
    
    // For each pair of consecutive weekly data points, create daily interpolations
    for (let i = 0; i < weeklyAuc.length - 1; i++) {
      const startPoint = weeklyAuc[i];
      const endPoint = weeklyAuc[i + 1];
      
      // Convert dates to Date objects
      const startDate = new Date(startPoint.date);
      const endDate = new Date(endPoint.date);
      
      // Skip if they're not 7 days apart (just a safety check)
      const dayDiff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (dayDiff !== 7) continue;
      
      // Create interpolated points for days 1-6 between the weeks
      const dailyBatch = [];
      for (let day = 1; day < 7; day++) {
        const fraction = day / 7; // How far between the points (0.14, 0.28, 0.42, 0.57, 0.71, 0.85)
        
        // Calculate date
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
        
        // Linear interpolation formula: start + (end - start) * fraction
        const totalValue = startPoint.totalValue + (endPoint.totalValue - startPoint.totalValue) * fraction;
        const equitiesValue = startPoint.equitiesValue + (endPoint.equitiesValue - startPoint.equitiesValue) * fraction;
        const fixedIncomeValue = startPoint.fixedIncomeValue + (endPoint.fixedIncomeValue - startPoint.fixedIncomeValue) * fraction;
        const alternativeAssetsValue = startPoint.alternativeAssetsValue + 
                                       (endPoint.alternativeAssetsValue - startPoint.alternativeAssetsValue) * fraction;
        
        // Add small random variations (±0.5%)
        const randomFactor = 0.995 + (Math.random() * 0.01);
        
        // Add to batch
        dailyBatch.push({
          date: currentDate.toISOString().split('T')[0],
          totalValue: totalValue * randomFactor,
          equitiesValue: equitiesValue * randomFactor,
          fixedIncomeValue: fixedIncomeValue * randomFactor,
          alternativeAssetsValue: alternativeAssetsValue * randomFactor,
          cashValue: (totalValue * randomFactor) - (equitiesValue * randomFactor) - 
                   (fixedIncomeValue * randomFactor) - (alternativeAssetsValue * randomFactor)
        });
      }
      
      // Insert daily interpolated points in batches of 50
      if (dailyBatch.length > 0) {
        await db.insert(schema.assetsUnderCustody).values(dailyBatch);
      }
      
      // Log progress every 10 weeks
      if (i % 10 === 0) {
        console.log(`Daily interpolation: ${i} of ${weeklyAuc.length - 1} week pairs processed...`);
      }
    }
    
    console.log('Historical data injected successfully!');
    await pool.end();
    return true;
  } catch (error) {
    console.error('Historical data injection failed:', error);
    await pool.end();
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  injectHistoricalData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { injectHistoricalData };