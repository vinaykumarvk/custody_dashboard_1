require('dotenv').config();
const { db, pool } = require('./db');
const schema = require('../shared/schema');

async function seed() {
  console.log('Starting database seeding...');
  
  try {
    // Check if we have existing data
    try {
      const { rows: tables } = await pool.query(`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      `);
      
      const tableNames = tables.map(t => t.tablename);
      
      if (!tableNames.includes('customers')) {
        console.log('Customer table doesn\'t exist yet, skipping seed');
        return true;
      }
      
      const { rows: customersCount } = await pool.query(`
        SELECT COUNT(*) FROM customers
      `);
      
      if (parseInt(customersCount[0].count) > 0) {
        console.log('Database already has customer data, skipping seed');
        return true;
      }
    } catch (error) {
      // Tables probably don't exist yet, continue with seeding
      console.log('Error checking existing data, will try seeding:', error.message);
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
    
    // Check if customers already exist and insert them if not
    for (const customer of customers) {
      try {
        const { rows } = await pool.query(
          `SELECT COUNT(*) FROM customers WHERE account_number = $1`,
          [customer.accountNumber]
        );
        
        if (parseInt(rows[0].count) === 0) {
          await pool.query(
            `INSERT INTO customers (name, account_number, type, status) 
             VALUES ($1, $2, $3, $4)`,
            [customer.name, customer.accountNumber, customer.type, customer.status]
          );
        }
      } catch (error) {
        console.log(`Error seeding customer ${customer.name}:`, error.message);
      }
    }
    
    // Seed accounts
    console.log('Seeding accounts...');
    let customerIndex = 0;
    for (let i = 0; i < 10; i++) {
      const customerId = (customerIndex % 5) + 1; // 1-5
      const accountNumber = `A-2000${i}`;
      
      try {
        // Check if account already exists
        const { rows } = await pool.query(
          `SELECT COUNT(*) FROM accounts WHERE account_number = $1`,
          [accountNumber]
        );
        
        if (parseInt(rows[0].count) === 0) {
          // Insert new account
          await pool.query(
            `INSERT INTO accounts (customer_id, account_number, type, status) 
             VALUES ($1, $2, $3, $4)`,
            [
              customerId,
              accountNumber,
              i % 3 === 0 ? 'Custody' : i % 3 === 1 ? 'Trading' : 'Settlement',
              'active'
            ]
          );
        }
      } catch (error) {
        console.log(`Error seeding account ${accountNumber}:`, error.message);
      }
      
      customerIndex++;
    }
    
    // Seed trades with two years of historical data
    console.log('Seeding trades...');
    
    // Check if trades table has data
    try {
      const { rows: tradesCount } = await pool.query(`
        SELECT COUNT(*) FROM trades LIMIT 1
      `);
      
      if (parseInt(tradesCount[0].count) > 0) {
        console.log('Trades table already has data, skipping trade seeding');
      } else {
        const assetClasses = ['Equities', 'Fixed Income', 'Commodities', 'FX', 'Funds'];
        const exchanges = ['NYSE', 'NASDAQ', 'LSE', 'TSE', 'HKEX'];
        const settlementLocations = ['DTC', 'Euroclear', 'Clearstream', 'JASDEC', 'HKSCC'];
        const statuses = ['Completed', 'Pending', 'Failed'];
        const tickers = [
          // Equities
          {name: 'Apple Inc.', ticker: 'AAPL', class: 'Equities'},
          {name: 'Microsoft Corp.', ticker: 'MSFT', class: 'Equities'},
          {name: 'Alphabet Inc.', ticker: 'GOOGL', class: 'Equities'},
          {name: 'Amazon.com Inc.', ticker: 'AMZN', class: 'Equities'},
          {name: 'Meta Platforms Inc.', ticker: 'META', class: 'Equities'},
          // Fixed Income
          {name: 'US Treasury 10Y', ticker: 'T10Y', class: 'Fixed Income'},
          {name: 'US Treasury 5Y', ticker: 'T5Y', class: 'Fixed Income'},
          {name: 'US Treasury 2Y', ticker: 'T2Y', class: 'Fixed Income'},
          {name: 'Corporate Bond ETF', ticker: 'LQD', class: 'Fixed Income'},
          {name: 'High Yield Bond ETF', ticker: 'HYG', class: 'Fixed Income'},
          // Commodities
          {name: 'Gold Futures', ticker: 'GC', class: 'Commodities'},
          {name: 'WTI Crude Oil', ticker: 'CL', class: 'Commodities'},
          {name: 'Silver Futures', ticker: 'SI', class: 'Commodities'},
          {name: 'Platinum Futures', ticker: 'PL', class: 'Commodities'},
          {name: 'Natural Gas Futures', ticker: 'NG', class: 'Commodities'},
          // FX
          {name: 'EUR/USD', ticker: 'EURUSD', class: 'FX'},
          {name: 'GBP/USD', ticker: 'GBPUSD', class: 'FX'},
          {name: 'USD/JPY', ticker: 'USDJPY', class: 'FX'},
          {name: 'USD/CAD', ticker: 'USDCAD', class: 'FX'},
          {name: 'AUD/USD', ticker: 'AUDUSD', class: 'FX'},
          // Funds
          {name: 'S&P 500 ETF', ticker: 'SPY', class: 'Funds'},
          {name: 'Nasdaq 100 ETF', ticker: 'QQQ', class: 'Funds'},
          {name: 'Russell 2000 ETF', ticker: 'IWM', class: 'Funds'},
          {name: 'Vanguard Total Stock Market ETF', ticker: 'VTI', class: 'Funds'},
          {name: 'iShares MSCI Emerging Markets ETF', ticker: 'EEM', class: 'Funds'},
        ];
        
        // Create start date 2 years ago
        const startTradeDate = new Date();
        startTradeDate.setFullYear(startTradeDate.getFullYear() - 2);
        
        // We'll create about 1000 trades over 2 years
        // This gives a realistic volume while keeping seed time reasonable
        const totalTrades = 1000;
        
        // Monthly patterns with Q1/Q2/Q3/Q4 trading intensity
        const monthlyTradeFactors = [
          0.7,  // January - light trading
          0.8,  // February 
          1.2,  // March - quarter end activity
          1.0,  // April - new quarter
          0.9,  // May
          1.1,  // June - quarter end
          0.6,  // July - summer lull
          0.5,  // August - vacation season
          1.0,  // September - back to work
          1.1,  // October
          0.9,  // November - holiday slowdown
          0.8   // December - year end, holiday slowdown
        ];
          
        console.log(`Creating ${totalTrades} trades spanning 2 years...`);
        
        for (let i = 0; i < totalTrades; i++) {
          // Calculate a date between 2 years ago and today
          // Weighted to have more recent trades for realism
          const dayOffset = Math.floor(Math.pow(Math.random(), 1.5) * 730); // More weighted toward recent dates
          const tradeDate = new Date(startTradeDate);
          tradeDate.setDate(tradeDate.getDate() + dayOffset);
          
          // Apply monthly seasonality
          const month = tradeDate.getMonth();
          const monthFactor = monthlyTradeFactors[month];
          
          // Skip some days based on monthly factor (fewer trades in slow months)
          if (Math.random() > monthFactor) {
            continue;
          }
          
          // Weekend check - significantly fewer trades on weekends
          const dayOfWeek = tradeDate.getDay(); // 0 = Sunday, 6 = Saturday
          if ((dayOfWeek === 0 || dayOfWeek === 6) && Math.random() > 0.2) {
            continue; // 80% chance to skip weekend trades
          }
          
          const customerId = (i % 5) + 1; // 1-5
          const customerName = customers[customerId - 1].name;
          
          // Select ticker based on modulus, but with some randomness
          const tickerIndex = (i + Math.floor(Math.random() * 3)) % tickers.length;
          const ticker = tickers[tickerIndex];
          const assetClass = ticker.class;
          
          const settlementDate = new Date(tradeDate);
          settlementDate.setDate(settlementDate.getDate() + 2); // T+2 settlement
          
          // More realistic price action with base + drift
          const basePrice = 50 + (tickerIndex * 20); // Different base prices for different assets
          const priceDrift = Math.sin(dayOffset / 30) * 10; // Cyclical price component
          const randomness = (Math.random() - 0.5) * 20; // Random component
          const price = Math.max(5, basePrice + priceDrift + randomness).toFixed(2);
          
          // Quantity varies by asset class
          let baseQuantity;
          switch (assetClass) {
            case 'Equities':
              baseQuantity = 500 + Math.floor(Math.random() * 1500);
              break;
            case 'Fixed Income':
              baseQuantity = 100000 + Math.floor(Math.random() * 500000);
              break;
            case 'Commodities':
              baseQuantity = 10 + Math.floor(Math.random() * 100);
              break;
            case 'FX':
              baseQuantity = 1000000 + Math.floor(Math.random() * 5000000);
              break;
            case 'Funds':
              baseQuantity = 1000 + Math.floor(Math.random() * 9000);
              break;
            default:
              baseQuantity = 1000;
          }
          
          // Larger customers tend to trade in larger sizes
          const customerSizeFactor = 0.5 + (customerId / 5) * 1.5;
          const quantity = Math.floor(baseQuantity * customerSizeFactor);
          
          // Calculate total value
          const amount = price * quantity;
          
          // Status distribution (more completed trades than failures for realism)
          const statusRandom = Math.random();
          const status = statusRandom < 0.85 ? 'Completed' : 
                        (statusRandom < 0.95 ? 'Pending' : 'Failed');
          
          const tradeId = `T-${100000 + i}`;
          
          try {
            // Check if trade exists by ID
            const { rows } = await pool.query(
              `SELECT COUNT(*) FROM trades WHERE trade_id = $1`,
              [tradeId]
            );
            
            if (parseInt(rows[0].count) === 0) {
              // Insert new trade
              await pool.query(`
                INSERT INTO trades (
                  trade_id, trade_date, customer_id, customer_name, 
                  asset_name, asset_class, amount, quantity, price, 
                  type, status, settlement_date, settlement_status, 
                  exchange, settlement_location
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
              `, [
                tradeId,
                tradeDate.toISOString(),
                customerId,
                customerName,
                `${ticker.name} (${ticker.ticker})`,
                assetClass,
                amount,
                quantity,
                price,
                Math.random() < 0.55 ? 'Buy' : 'Sell', // Slightly more buys than sells
                status,
                settlementDate.toISOString(),
                status === 'Completed' ? 'Completed' : status === 'Pending' ? 'Pending' : 'Failed',
                exchanges[Math.floor(Math.random() * exchanges.length)],
                settlementLocations[Math.floor(Math.random() * settlementLocations.length)]
              ]);
            }
          } catch (error) {
            console.log(`Error seeding trade ${tradeId}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.log('Error checking trades table:', error.message);
    }
    
    // Seed corporate actions with two years of historical data
    console.log('Seeding corporate actions...');
    
    // Check if corporate actions table has data
    try {
      const { rows: caCount } = await pool.query(`
        SELECT COUNT(*) FROM corporate_actions LIMIT 1
      `);
      
      if (parseInt(caCount[0].count) > 0) {
        console.log('Corporate actions table already has data, skipping seeding');
      } else {
        const caTypes = ['Dividend', 'Stock Split', 'Rights Issue', 'Merger', 'Acquisition', 'Spin-off', 'Tender Offer', 'Redemption', 'Name Change'];
        const caStatuses = ['Announced', 'Pending', 'Processing', 'Completed', 'Canceled'];
        
        // Create a list of companies for corporate actions
        const companies = [
          // Large Cap
          {ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology'},
          {ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology'},
          {ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical'},
          {ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services'},
          {ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services'},
          {ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical'},
          {ticker: 'BRK.B', name: 'Berkshire Hathaway Inc.', sector: 'Financial Services'},
          {ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare'},
          {ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services'},
          {ticker: 'V', name: 'Visa Inc.', sector: 'Financial Services'},
          
          // Mid Cap
          {ticker: 'SBUX', name: 'Starbucks Corp.', sector: 'Consumer Cyclical'},
          {ticker: 'AMD', name: 'Advanced Micro Devices Inc.', sector: 'Technology'},
          {ticker: 'UBER', name: 'Uber Technologies Inc.', sector: 'Technology'},
          {ticker: 'RIVN', name: 'Rivian Automotive Inc.', sector: 'Consumer Cyclical'},
          {ticker: 'ABNB', name: 'Airbnb Inc.', sector: 'Consumer Cyclical'},
          
          // International
          {ticker: 'TCEHY', name: 'Tencent Holdings Ltd.', sector: 'Communication Services'},
          {ticker: 'BABA', name: 'Alibaba Group Holding Ltd.', sector: 'Consumer Cyclical'},
          {ticker: 'TTE', name: 'TotalEnergies SE', sector: 'Energy'},
          {ticker: 'SONY', name: 'Sony Group Corp.', sector: 'Technology'},
          {ticker: 'RY', name: 'Royal Bank of Canada', sector: 'Financial Services'},
          
          // ETFs for fixed income related corporate actions
          {ticker: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', sector: 'Fixed Income'},
          {ticker: 'LQD', name: 'iShares iBoxx $ Investment Grade Corporate Bond ETF', sector: 'Fixed Income'},
          {ticker: 'HYG', name: 'iShares iBoxx $ High Yield Corporate Bond ETF', sector: 'Fixed Income'},
          {ticker: 'MUB', name: 'iShares National Muni Bond ETF', sector: 'Fixed Income'},
          {ticker: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', sector: 'Fixed Income'},
        ];
        
        // Set start date to 2 years ago
        const caStartDate = new Date();
        caStartDate.setFullYear(caStartDate.getFullYear() - 2);
        
        // Generate about 150 corporate actions over 2 years
        const totalCorporateActions = 150;
        
        console.log(`Creating ${totalCorporateActions} corporate actions spanning 2 years...`);
        
        // Map of typical corporate action frequencies by type (events per year per company)
        const typeFrequencies = {
          'Dividend': 4, // Quarterly dividends are common
          'Stock Split': 0.05, // Rare event
          'Rights Issue': 0.1, // Uncommon
          'Merger': 0.05, // Very rare
          'Acquisition': 0.05, // Very rare
          'Spin-off': 0.05, // Very rare
          'Tender Offer': 0.1, // Uncommon
          'Redemption': 0.2, // For bonds/fixed income
          'Name Change': 0.02 // Extremely rare
        };
        
        // Generate weighted distribution of corporate action types
        const weightedTypes = [];
        for (const type of caTypes) {
          const frequency = typeFrequencies[type] || 0.1;
          const count = Math.round(frequency * 100);
          for (let i = 0; i < count; i++) {
            weightedTypes.push(type);
          }
        }
        
        for (let i = 0; i < totalCorporateActions; i++) {
          // Select a random company with some weighting toward more active companies
          const companyIndex = Math.floor(Math.pow(Math.random(), 1.2) * companies.length);
          const company = companies[companyIndex];
          
          // Weight corporate action types by their typical frequency
          const typeIndex = Math.floor(Math.random() * weightedTypes.length);
          const type = weightedTypes[typeIndex];
          
          // Choose announcement date between start date and today
          // With some weighting toward more recent dates
          const dayOffset = Math.floor(Math.pow(Math.random(), 1.1) * 730);
          const announcementDate = new Date(caStartDate);
          announcementDate.setDate(announcementDate.getDate() + dayOffset);
          
          // Different types have different timing patterns
          let recordDateOffset, paymentDateOffset;
          
          switch (type) {
            case 'Dividend':
              recordDateOffset = 10 + Math.floor(Math.random() * 5); // 10-15 days after announcement
              paymentDateOffset = 20 + Math.floor(Math.random() * 10); // 20-30 days after announcement
              break;
            case 'Stock Split':
              recordDateOffset = 15 + Math.floor(Math.random() * 10); // 15-25 days after announcement
              paymentDateOffset = 20 + Math.floor(Math.random() * 10); // 20-30 days after announcement
              break;
            case 'Rights Issue':
              recordDateOffset = 5 + Math.floor(Math.random() * 5); // 5-10 days after announcement
              paymentDateOffset = 15 + Math.floor(Math.random() * 15); // 15-30 days after announcement
              break;
            case 'Merger':
            case 'Acquisition':
              recordDateOffset = 30 + Math.floor(Math.random() * 30); // 30-60 days after announcement
              paymentDateOffset = 60 + Math.floor(Math.random() * 60); // 60-120 days after announcement
              break;
            case 'Spin-off':
              recordDateOffset = 20 + Math.floor(Math.random() * 10); // 20-30 days after announcement
              paymentDateOffset = 40 + Math.floor(Math.random() * 20); // 40-60 days after announcement
              break;
            default:
              recordDateOffset = 10 + Math.floor(Math.random() * 10); // 10-20 days after announcement
              paymentDateOffset = 15 + Math.floor(Math.random() * 15); // 15-30 days after announcement
          }
          
          const recordDate = new Date(announcementDate);
          recordDate.setDate(recordDate.getDate() + recordDateOffset);
          
          const paymentDate = new Date(announcementDate);
          paymentDate.setDate(paymentDate.getDate() + paymentDateOffset);
          
          // Status depends on dates relative to today
          const today = new Date();
          let status;
          
          if (paymentDate < today) {
            status = 'Completed';
          } else if (recordDate < today && paymentDate > today) {
            status = 'Processing';
          } else if (announcementDate < today && recordDate > today) {
            status = 'Pending';
          } else {
            status = 'Announced';
          }
          
          // Some corporate actions will be canceled (small percentage)
          if (Math.random() < 0.05) {
            status = 'Canceled';
          }
          
          // Only certain types have mandatory vs voluntary distinction
          let mandatory = true;
          if (['Rights Issue', 'Tender Offer'].includes(type)) {
            mandatory = false; // These are typically voluntary
          } else if (['Merger', 'Spin-off'].includes(type)) {
            mandatory = Math.random() < 0.5; // These can be either
          }
          
          // Only voluntary actions can have pending elections
          const pendingElection = !mandatory && status !== 'Completed' && Math.random() < 0.7;
          
          // Priority is typically higher for near-term and certain event types
          let priority;
          const daysToRecord = Math.max(0, (recordDate - today) / (1000 * 60 * 60 * 24));
          
          if (['Merger', 'Acquisition'].includes(type)) {
            priority = 'high'; // These are always high priority
          } else if (daysToRecord < 5 && status !== 'Completed') {
            priority = 'high'; // Near-term events are high priority
          } else if (daysToRecord < 15 && status !== 'Completed') {
            priority = 'normal'; // Medium-term events are normal priority
          } else {
            priority = 'low'; // Long-term or completed events are low priority
          }
          
          const actionId = `CA-${200000 + i}`;
          
          try {
            // Check if corporate action exists by ID
            const { rows } = await pool.query(
              `SELECT COUNT(*) FROM corporate_actions WHERE action_id = $1`,
              [actionId]
            );
            
            if (parseInt(rows[0].count) === 0) {
              // Insert new corporate action
              await db.insert(schema.corporateActions).values({
                actionId: actionId,
                type: type,
                assetName: `${company.name} (${company.ticker})`,
                mandatory: mandatory,
                announcementDate: announcementDate.toISOString().split('T')[0],
                recordDate: recordDate.toISOString().split('T')[0],
                paymentDate: paymentDate.toISOString().split('T')[0],
                status: status,
                priority: priority,
                pendingElection: pendingElection
              });
            }
          } catch (error) {
            console.log(`Error seeding corporate action ${actionId}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.log('Error checking corporate actions table:', error.message);
    }
    
    // Seed assets under custody historical data
    console.log('Seeding assets under custody data...');
    
    // Create a start date 2 years ago
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);
    
    // Calculate the number of days for 2 years of data
    const days = 2 * 365;
    
    // Begin AUC at a slightly lower base to show growth over time
    const baseAucValue = 3500000000000; // 3.5 trillion base
    
    // Create quarterly growth factors to show business cycles
    const quarterlyGrowth = [
      1.02, // Q1 - moderate growth
      1.04, // Q2 - strong growth
      0.99, // Q3 - slight contraction
      1.03  // Q4 - recovery
    ];
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      // Determine which quarter we're in based on the day number
      const quarterIndex = Math.floor((i % 365) / 91.25);
      
      // Use the appropriate quarterly growth factor
      const quarterlyFactor = quarterlyGrowth[quarterIndex];
      
      // Create a trend with some randomness
      const dayFactor = 1 + (i * 0.0002); // Smaller daily increase for more realistic long-term growth
      
      // Add more variety to daily fluctuations
      const dailyRandomFactor = 0.995 + (Math.random() * 0.01); // Daily fluctuations of 0.5% to 1.0%
      
      // Add occasional market events (significant spikes or drops)
      const marketEventFactor = (i % 180 === 0) ? 0.95 + (Math.random() * 0.1) : 1; // Every ~6 months, possible larger swing
      
      // Calculate total value with all factors
      const totalValue = baseAucValue * dayFactor * quarterlyFactor * dailyRandomFactor * marketEventFactor;
      
      // Adjust asset allocation over time to reflect market trends
      // Calculate days since start as percentage of total period
      const periodProgress = i / days;
      
      // Equity allocation starts lower and gradually increases
      const equityAllocation = 0.40 + (periodProgress * 0.08);
      // Fixed income gradually decreases
      const fixedIncomeAllocation = 0.40 - (periodProgress * 0.06);
      // Alternative assets gradually increase
      const alternativeAllocation = 0.10 + (periodProgress * 0.06);
      // Cash is the remainder, generally decreases
      const cashAllocation = 1 - equityAllocation - fixedIncomeAllocation - alternativeAllocation;
      
      // Add some randomness to allocations
      const equitiesValue = totalValue * equityAllocation * (0.97 + (Math.random() * 0.06));
      const fixedIncomeValue = totalValue * fixedIncomeAllocation * (0.97 + (Math.random() * 0.06));
      const alternativeAssetsValue = totalValue * alternativeAllocation * (0.97 + (Math.random() * 0.06));
      
      // Cash is calculated to ensure the total adds up exactly
      const cashValue = totalValue - equitiesValue - fixedIncomeValue - alternativeAssetsValue;
      
      // Check if this date already has AUC data
      try {
        const { rows } = await pool.query(
          `SELECT COUNT(*) FROM assets_under_custody WHERE date = $1`,
          [currentDate.toISOString().split('T')[0]]
        );
        
        if (parseInt(rows[0].count) === 0) {
          await db.insert(schema.assetsUnderCustody).values({
            date: currentDate.toISOString().split('T')[0],
            totalValue: totalValue,
            equitiesValue: equitiesValue,
            fixedIncomeValue: fixedIncomeValue,
            alternativeAssetsValue: alternativeAssetsValue,
            cashValue: cashValue
          });
        }
      } catch (error) {
        console.log(`Error seeding AUC for date ${currentDate.toISOString().split('T')[0]}:`, error.message);
      }
    }
    
    // Seed trades by asset with 2 years of data
    console.log('Seeding trades by asset data...');
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
    
    // Generate 2 years of data for each asset class
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      // Get month for seasonal factor
      const month = currentDate.getMonth();
      const monthFactor = monthlyFactors[month];
      
      // Year-over-year growth factor (10% more trades in year 2)
      const yearFactor = (i < 365) ? 1 : 1.1;
      
      for (const assetClass of assetClassesForStats) {
        // Base count with weekly pattern (M-F business pattern)
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Realistic trading volume pattern through the week
        let dayFactor;
        switch (dayOfWeek) {
          case 0: // Sunday
            dayFactor = 0.1; // Very low weekend activity
            break;
          case 1: // Monday
            dayFactor = 1.1; // High - start of week
            break;
          case 2: // Tuesday
            dayFactor = 1.2; // Highest
            break;
          case 3: // Wednesday
            dayFactor = 1.0; // Medium
            break;
          case 4: // Thursday
            dayFactor = 0.9; // Medium-low
            break;
          case 5: // Friday
            dayFactor = 0.7; // Lower end of week
            break;
          case 6: // Saturday
            dayFactor = 0.1; // Very low weekend activity
            break;
          default:
            dayFactor = 1.0;
        }
        
        // Base count with seasonal and weekly patterns
        let baseCount = 15 * monthFactor * dayFactor * yearFactor;
        
        // Asset-specific multipliers - adjusted to be more realistic
        const assetMultiplier = 
          assetClass === 'Equity' ? 4.0 : 
          assetClass === 'Fixed Income' ? 2.5 : 
          assetClass === 'FX' ? 1.8 : 
          assetClass === 'Fund' ? 1.2 : 
          0.9; // Commodity
        
        // Add randomness - more variation for realism
        const randomFactor = 0.7 + (Math.random() * 0.6); // 0.7 to 1.3
        
        // Calculate final count
        const tradeCount = Math.round(baseCount * assetMultiplier * randomFactor);
        
        // Check if this date and asset class already has trade data
        try {
          const { rows } = await pool.query(
            `SELECT COUNT(*) FROM trades_by_asset WHERE date = $1 AND asset_class = $2`,
            [currentDate.toISOString().split('T')[0], assetClass]
          );
          
          if (parseInt(rows[0].count) === 0) {
            await db.insert(schema.tradesByAsset).values({
              date: currentDate.toISOString().split('T')[0],
              assetClass: assetClass,
              tradeCount: tradeCount
            });
          }
        } catch (error) {
          console.log(`Error seeding trades for date ${currentDate.toISOString().split('T')[0]} and asset ${assetClass}:`, error.message);
        }
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