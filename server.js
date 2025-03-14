const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Import database and storage functions
const { db, pool } = require('./server/db');
const storage = require('./server/storage');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// CORS configuration for cross-origin requests
const corsOptions = {
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Add specific route for bundle.js
app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bundle.js'));
});

// Add custom middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to database at:', res.rows[0].now);
  }
});

// Initialize the database with tables
const initializeDatabase = async () => {
  try {
    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        time VARCHAR(100) NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create dashboard_metrics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dashboard_metrics (
        id SERIAL PRIMARY KEY,
        total_customers INTEGER NOT NULL,
        active_customers INTEGER NOT NULL,
        monthly_growth DECIMAL(10,2) NOT NULL,
        total_income DECIMAL(15,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create monthly_data table for time series data
    await pool.query(`
      CREATE TABLE IF NOT EXISTS monthly_data (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        category VARCHAR(100) NOT NULL,
        metric VARCHAR(100) NOT NULL,
        value DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        available_formats TEXT[] NOT NULL,
        last_generated TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create scheduled_reports table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scheduled_reports (
        id SERIAL PRIMARY KEY,
        schedule_id VARCHAR(100) NOT NULL,
        report_name VARCHAR(255) NOT NULL,
        frequency VARCHAR(50) NOT NULL,
        next_run TIMESTAMP NOT NULL,
        recipients INTEGER NOT NULL,
        format VARCHAR(50) NOT NULL,
        created_by VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created');
    
    // Check if data needs to be populated
    const { rows } = await pool.query('SELECT COUNT(*) FROM notifications');
    if (parseInt(rows[0].count) === 0) {
      console.log('Populating database with initial data...');
      await populateSampleData();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Populate sample data
const populateSampleData = async () => {
  try {
    // Populate notifications
    const notifications = [
      {
        type: 'warning',
        message: 'Settlement deadline approaching for T-78950',
        time: '10 minutes ago',
        read: false,
        category: 'Settlements'
      },
      {
        type: 'info',
        message: 'New corporate action announced for AAPL',
        time: '30 minutes ago',
        read: false,
        category: 'Corporate Actions'
      },
      {
        type: 'success',
        message: 'Trade T-78946 successfully settled',
        time: '1 hour ago',
        read: false,
        category: 'Trades'
      },
      {
        type: 'info',
        message: 'Client statement generated for BlackRock Inc.',
        time: '2 hours ago',
        read: true,
        category: 'Reports'
      },
      {
        type: 'warning',
        message: 'System maintenance scheduled for tonight 22:00-23:00 UTC',
        time: '3 hours ago',
        read: true,
        category: 'System'
      },
      {
        type: 'info',
        message: 'New income posted for Fidelity account',
        time: '4 hours ago',
        read: true,
        category: 'Income'
      },
      {
        type: 'warning',
        message: 'Upcoming corporate action for MSFT requires attention',
        time: '5 hours ago',
        read: true,
        category: 'Corporate Actions'
      },
      {
        type: 'success',
        message: 'Customer onboarding completed for JP Morgan',
        time: '7 hours ago',
        read: true,
        category: 'Customers'
      },
      {
        type: 'info',
        message: 'Scheduled reports successfully generated',
        time: '1 day ago',
        read: true,
        category: 'Reports'
      },
      {
        type: 'success',
        message: 'System backup completed successfully',
        time: '1 day ago',
        read: true,
        category: 'System'
      }
    ];

    const notificationQuery = `
      INSERT INTO notifications (type, message, time, read, category)
      VALUES ($1, $2, $3, $4, $5)
    `;

    for (const notification of notifications) {
      await pool.query(notificationQuery, [
        notification.type,
        notification.message,
        notification.time,
        notification.read,
        notification.category
      ]);
    }
    console.log('Notifications data populated');

    // Populate dashboard metrics
    const dashboardData = {
      total_customers: 19632,
      active_customers: 18245,
      monthly_growth: 2.3,
      total_income: 5837291.45,
    };

    await pool.query(`
      INSERT INTO dashboard_metrics 
      (total_customers, active_customers, monthly_growth, total_income, category)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      dashboardData.total_customers,
      dashboardData.active_customers,
      dashboardData.monthly_growth,
      dashboardData.total_income,
      'main'
    ]);
    console.log('Dashboard metrics populated');

    // Populate monthly data (customers)
    const customerMonthlyData = [
      { date: '2024-03-31', total_customers: 1230, new_customers: 3419 },
      { date: '2024-04-30', total_customers: 2955, new_customers: 3357 },
      { date: '2024-05-31', total_customers: 4514, new_customers: 2755 },
      { date: '2024-06-30', total_customers: 5886, new_customers: 3311 },
      { date: '2024-07-31', total_customers: 7578, new_customers: 3415 },
      { date: '2024-08-31', total_customers: 9396, new_customers: 3321 },
      { date: '2024-09-30', total_customers: 11047, new_customers: 3050 },
      { date: '2024-10-31', total_customers: 13018, new_customers: 3092 },
      { date: '2024-11-30', total_customers: 14759, new_customers: 3619 },
      { date: '2024-12-31', total_customers: 16462, new_customers: 3394 },
      { date: '2025-01-31', total_customers: 18009, new_customers: 3365 },
      { date: '2025-02-28', total_customers: 19407, new_customers: 3097 },
      { date: '2025-03-31', total_customers: 19632, new_customers: 436 }
    ];

    const monthlyDataQuery = `
      INSERT INTO monthly_data (date, category, metric, value)
      VALUES ($1, $2, $3, $4)
    `;

    for (const data of customerMonthlyData) {
      await pool.query(monthlyDataQuery, [
        data.date,
        'customers',
        'total_customers',
        data.total_customers
      ]);
      
      await pool.query(monthlyDataQuery, [
        data.date,
        'customers',
        'new_customers',
        data.new_customers
      ]);
    }
    console.log('Customer monthly data populated');

    // Populate monthly data (income)
    const incomeMonthlyData = [
      { date: '2024-03-31', total_income: 967982, new_income: 93658 },
      { date: '2024-04-30', total_income: 1203977, new_income: 235995 },
      { date: '2024-05-31', total_income: 1428305, new_income: 224328 },
      { date: '2024-06-30', total_income: 1651982, new_income: 223677 },
      { date: '2024-07-31', total_income: 2056239, new_income: 404257 },
      { date: '2024-08-31', total_income: 2387982, new_income: 331743 },
      { date: '2024-09-30', total_income: 2687251, new_income: 299269 },
      { date: '2024-10-31', total_income: 3092857, new_income: 405606 },
      { date: '2024-11-30', total_income: 3428291, new_income: 335434 },
      { date: '2024-12-31', total_income: 3824905, new_income: 396614 },
      { date: '2025-01-31', total_income: 4372845, new_income: 547940 },
      { date: '2025-02-28', total_income: 5628945, new_income: 1256100 },
      { date: '2025-03-31', total_income: 5837291, new_income: 208346 }
    ];

    for (const data of incomeMonthlyData) {
      await pool.query(monthlyDataQuery, [
        data.date,
        'income',
        'total_income',
        data.total_income
      ]);
      
      await pool.query(monthlyDataQuery, [
        data.date,
        'income',
        'new_income',
        data.new_income
      ]);
    }
    console.log('Income monthly data populated');

    // Populate reports data
    const reports = [
      {
        name: 'Daily Settlement Summary',
        category: 'Settlements',
        description: 'A summary of all settlements processed in the last 24 hours',
        available_formats: ['pdf', 'xlsx', 'csv'],
        last_generated: '2025-03-06T14:30:00'
      },
      {
        name: 'Corporate Actions Report',
        category: 'Corporate Actions',
        description: 'Details of all corporate actions processed in the selected period',
        available_formats: ['pdf', 'xlsx'],
        last_generated: '2025-03-05T09:15:00'
      },
      {
        name: 'Customer Activity Report',
        category: 'Customers',
        description: 'Overview of customer activity including logins, trades, and settings changes',
        available_formats: ['pdf', 'xlsx', 'csv'],
        last_generated: '2025-03-04T16:45:00'
      },
      {
        name: 'Income Statement',
        category: 'Income',
        description: 'Detailed breakdown of all income by type and client',
        available_formats: ['pdf', 'xlsx', 'json'],
        last_generated: '2025-02-28T11:20:00'
      },
      {
        name: 'Trade Execution Report',
        category: 'Trades',
        description: 'Analysis of trade execution times and efficiency metrics',
        available_formats: ['pdf', 'xlsx', 'csv'],
        last_generated: '2025-03-06T08:30:00'
      },
      {
        name: 'Compliance Audit Log',
        category: 'Compliance',
        description: 'Log of all compliance-related events and exceptions',
        available_formats: ['pdf', 'xlsx'],
        last_generated: '2025-03-01T10:00:00'
      },
      {
        name: 'System Performance Metrics',
        category: 'System',
        description: 'Technical metrics about system performance and reliability',
        available_formats: ['pdf', 'json'],
        last_generated: null
      },
      {
        name: 'Client Asset Statement',
        category: 'Customers',
        description: 'Statement of assets under custody for client reporting',
        available_formats: ['pdf'],
        last_generated: '2025-03-01T09:00:00'
      }
    ];

    const reportsQuery = `
      INSERT INTO reports (name, category, description, available_formats, last_generated)
      VALUES ($1, $2, $3, $4, $5)
    `;

    for (const report of reports) {
      await pool.query(reportsQuery, [
        report.name,
        report.category,
        report.description,
        report.available_formats,
        report.last_generated
      ]);
    }
    console.log('Reports data populated');

    // Populate scheduled reports
    const scheduledReports = [
      {
        schedule_id: 'S-23456',
        report_name: 'Daily Trade Summary',
        frequency: 'Daily',
        next_run: '2025-03-08T06:00:00',
        recipients: 12,
        format: 'PDF',
        created_by: 'System Administrator'
      },
      {
        schedule_id: 'S-23457',
        report_name: 'Weekly Settlement Status',
        frequency: 'Weekly',
        next_run: '2025-03-11T07:00:00',
        recipients: 8,
        format: 'XLSX',
        created_by: 'System Administrator'
      },
      {
        schedule_id: 'S-23458',
        report_name: 'Monthly Performance Report',
        frequency: 'Monthly',
        next_run: '2025-04-01T06:00:00',
        recipients: 15,
        format: 'PDF',
        created_by: 'System Administrator'
      },
      {
        schedule_id: 'S-23459',
        report_name: 'Quarterly Compliance Review',
        frequency: 'Quarterly',
        next_run: '2025-06-01T06:00:00',
        recipients: 7,
        format: 'PDF',
        created_by: 'System Administrator'
      },
      {
        schedule_id: 'S-23460',
        report_name: 'Daily Corporate Actions Alert',
        frequency: 'Daily',
        next_run: '2025-03-08T06:30:00',
        recipients: 10,
        format: 'XLSX',
        created_by: 'Operations Manager'
      }
    ];

    const scheduledReportsQuery = `
      INSERT INTO scheduled_reports (schedule_id, report_name, frequency, next_run, recipients, format, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    for (const report of scheduledReports) {
      await pool.query(scheduledReportsQuery, [
        report.schedule_id,
        report.report_name,
        report.frequency,
        report.next_run,
        report.recipients,
        report.format,
        report.created_by
      ]);
    }
    console.log('Scheduled reports data populated');

  } catch (error) {
    console.error('Error populating sample data:', error);
  }
};

// Generate trade data for the database
const generateTradeData = async () => {
  try {
    // Create trade_data table first
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trade_data (
        id SERIAL PRIMARY KEY,
        trade_id VARCHAR(10) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_id VARCHAR(10) NOT NULL,
        type VARCHAR(10) NOT NULL,
        asset_class VARCHAR(50) NOT NULL,
        asset_name VARCHAR(100) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        trade_date TIMESTAMP NOT NULL,
        settlement_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if we already have trade data
    const { rows } = await pool.query('SELECT COUNT(*) FROM trade_data');
    if (parseInt(rows[0].count) > 0) {
      return; // Skip if data already exists
    }

    // Table exists and is empty, continue with data generation

    // Create trade_monthly table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trade_monthly (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        total_trades INTEGER NOT NULL,
        trade_volume DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create data_uploads table for storing uploaded files
    await pool.query(`
      CREATE TABLE IF NOT EXISTS data_uploads (
        id SERIAL PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_size INTEGER NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        data JSONB,
        metadata JSONB,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if status column exists, and add it if it doesn't
    try {
      // First check if the column exists
      const columnCheckResult = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'data_uploads' AND column_name = 'status'
      `);
      
      // If the column doesn't exist, add it
      if (columnCheckResult.rows.length === 0) {
        await pool.query(`
          ALTER TABLE data_uploads 
          ADD COLUMN status VARCHAR(50) DEFAULT 'Processed'
        `);
        console.log('Added status column to data_uploads table');
      }
    } catch (error) {
      console.error('Error checking/adding status column:', error);
    }

    console.log('Trade tables created');
    
    // Generate monthly trade data
    const months = 13;
    const startDate = new Date('2024-03-01');
    
    for (let i = 0; i < months; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      // Increasing trade volume over time
      const baseVolume = 10000000;
      const growth = 1 + (i * 0.15);
      const tradeVolume = baseVolume * growth;
      
      // Increasing trades count over time
      const baseTrades = 5000;
      const tradeGrowth = 1 + (i * 0.12);
      const totalTrades = Math.round(baseTrades * tradeGrowth);
      
      await pool.query(`
        INSERT INTO trade_monthly (date, total_trades, trade_volume)
        VALUES ($1, $2, $3)
      `, [
        date.toISOString().split('T')[0],
        totalTrades,
        tradeVolume
      ]);
    }
    console.log('Monthly trade data generated');
    
    // Generate individual trade data
    const tradeTypes = ['Buy', 'Sell'];
    const assetClasses = ['Equity', 'Fixed Income', 'Fund', 'FX', 'Commodity'];
    const assetNames = {
      'Equity': ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'FB', 'TSLA', 'BRK.A', 'V', 'JPM', 'JNJ'],
      'Fixed Income': ['US Treasury', 'Corporate Bond', 'Municipal Bond', 'High Yield', 'Mortgage-Backed'],
      'Fund': ['Vanguard 500', 'Fidelity Growth', 'BlackRock Global', 'State Street ETF', 'PIMCO Income'],
      'FX': ['EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 'USD/CAD'],
      'Commodity': ['Gold', 'Silver', 'Crude Oil', 'Natural Gas', 'Corn']
    };
    const statuses = ['Completed', 'Pending', 'Processing', 'Failed', 'Cancelled'];
    const customerNames = ['BlackRock', 'Vanguard', 'Fidelity', 'State Street', 'JPMorgan', 'Goldman Sachs', 'Morgan Stanley', 'BNY Mellon', 'PIMCO', 'Capital Group'];
    
    const numTrades = 100;
    for (let i = 0; i < numTrades; i++) {
      const tradeId = `T-${100000 + i}`;
      const customerId = `C-${10000 + Math.floor(Math.random() * 100)}`;
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const type = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
      const assetClass = assetClasses[Math.floor(Math.random() * assetClasses.length)];
      const assetName = assetNames[assetClass][Math.floor(Math.random() * assetNames[assetClass].length)];
      const amount = Math.round(10000 + Math.random() * 990000) / 100;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Random date within the last 30 days
      const tradeDate = new Date();
      tradeDate.setDate(tradeDate.getDate() - Math.floor(Math.random() * 30));
      
      // Settlement date is 2 business days after trade date for completed trades
      const settlementDate = status === 'Completed' ? 
        new Date(tradeDate.getTime() + (2 * 24 * 60 * 60 * 1000)) : null;
      
      await pool.query(`
        INSERT INTO trade_data (
          trade_id, customer_name, customer_id, type, asset_class, 
          asset_name, amount, status, trade_date, settlement_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        tradeId, customerName, customerId, type, assetClass,
        assetName, amount, status, tradeDate, settlementDate
      ]);
    }
    console.log('Individual trade data generated');
    
  } catch (error) {
    console.error('Error generating trade data:', error);
  }
};

// Initialize database
initializeDatabase().then(() => {
  generateTradeData();
});

// API Routes

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'healthy',
      database: 'connected', 
      message: 'API is operational',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected', 
      message: 'API is experiencing issues',
      timestamp: new Date().toISOString()
    });
  }
});

// Get all notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE notifications SET read = TRUE WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all notifications as read
app.put('/api/notifications/read/all', async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET read = TRUE');
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Get dashboard metrics
app.get('/api/dashboard', async (req, res) => {
  try {
    // Get main dashboard metrics
    const metricsResult = await pool.query('SELECT * FROM dashboard_metrics WHERE category = $1', ['main']);
    const metrics = metricsResult.rows[0] || {};
    
    // Get customer monthly data
    const customerMonthlyDataResult = await pool.query(`
      SELECT date, metric, value 
      FROM monthly_data 
      WHERE category = $1 
      ORDER BY date
    `, ['customers']);
    
    // Get income monthly data
    const incomeMonthlyDataResult = await pool.query(`
      SELECT date, metric, value 
      FROM monthly_data 
      WHERE category = $1 
      ORDER BY date
    `, ['income']);
    
    // Get monthly trade data
    let tradeMonthlyData = [];
    try {
      const tradeMonthlyResult = await pool.query(`
        SELECT date, total_trades, trade_volume 
        FROM trade_monthly 
        ORDER BY date
      `);
      tradeMonthlyData = tradeMonthlyResult.rows;
    } catch (err) {
      console.log('Trade monthly data not available yet');
    }
    
    // Get trade statistics
    let tradeStats = {
      total_trades: 0,
      pending_trades: 0,
      total_volume: 0,
      trades_by_asset: []
    };
    
    try {
      // Get total trade count
      const totalTradesResult = await pool.query(`SELECT COUNT(*) FROM trade_data`);
      tradeStats.total_trades = parseInt(totalTradesResult.rows[0].count);
      
      // Get pending trades count
      const pendingTradesResult = await pool.query(`
        SELECT COUNT(*) FROM trade_data WHERE status = 'Pending'
      `);
      tradeStats.pending_trades = parseInt(pendingTradesResult.rows[0].count);
      
      // Get total trade volume
      const volumeResult = await pool.query(`
        SELECT SUM(amount) as total_volume FROM trade_data
      `);
      tradeStats.total_volume = parseFloat(volumeResult.rows[0].total_volume) || 0;
      
      // Get trades by asset class
      const assetClassResult = await pool.query(`
        SELECT asset_class, COUNT(*) as count 
        FROM trade_data 
        GROUP BY asset_class
      `);
      
      tradeStats.trades_by_asset = assetClassResult.rows.map(row => ({
        label: row.asset_class,
        value: parseInt(row.count)
      }));
    } catch (err) {
      console.log('Trade statistics not available yet');
    }
    
    // Get reports data
    const reportsResult = await pool.query('SELECT * FROM reports');
    
    // Get scheduled reports data
    const scheduledReportsResult = await pool.query('SELECT * FROM scheduled_reports');
    
    // Format data for frontend
    const customerMonthlyData = [];
    const incomeMonthlyData = [];
    
    // Process customer data
    const customerDataByDate = {};
    customerMonthlyDataResult.rows.forEach(row => {
      if (!customerDataByDate[row.date]) {
        customerDataByDate[row.date] = {};
      }
      customerDataByDate[row.date][row.metric] = parseFloat(row.value);
    });
    
    // Convert to array format
    Object.keys(customerDataByDate).forEach(date => {
      customerMonthlyData.push({
        date,
        total_customers: customerDataByDate[date].total_customers || 0,
        new_customers: customerDataByDate[date].new_customers || 0
      });
    });
    
    // Process income data
    const incomeDataByDate = {};
    incomeMonthlyDataResult.rows.forEach(row => {
      if (!incomeDataByDate[row.date]) {
        incomeDataByDate[row.date] = {};
      }
      incomeDataByDate[row.date][row.metric] = parseFloat(row.value);
    });
    
    // Convert to array format
    Object.keys(incomeDataByDate).forEach(date => {
      incomeMonthlyData.push({
        date,
        total_income: incomeDataByDate[date].total_income || 0,
        new_income: incomeDataByDate[date].new_income || 0
      });
    });
    
    // Sort by date
    customerMonthlyData.sort((a, b) => new Date(a.date) - new Date(b.date));
    incomeMonthlyData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Format reports data
    const reportCategories = [...new Set(reportsResult.rows.map(report => report.category))].map(category => {
      return {
        category,
        count: reportsResult.rows.filter(r => r.category === category).length
      };
    });
    
    // Build response object
    const response = {
      total_customers: metrics.total_customers || 0,
      active_customers: metrics.active_customers || 0,
      monthly_growth: metrics.monthly_growth || 0,
      total_income: metrics.total_income || 0,
      total_trades: tradeStats.total_trades,
      pending_trades: tradeStats.pending_trades,
      trading_volume: tradeStats.total_volume,
      trade_monthly: tradeMonthlyData,
      trades_by_asset: tradeStats.trades_by_asset,
      customers_monthly: customerMonthlyData,
      income_monthly: incomeMonthlyData,
      available_reports: reportsResult.rows.length,
      report_categories: reportCategories,
      reports: reportsResult.rows.map(r => ({
        id: r.id,
        name: r.name,
        category: r.category,
        description: r.description,
        available_formats: r.available_formats,
        last_generated: r.last_generated
      })),
      scheduled_reports: scheduledReportsResult.rows.map(r => ({
        schedule_id: r.schedule_id,
        report_name: r.report_name,
        frequency: r.frequency,
        next_run: r.next_run,
        recipients: r.recipients,
        format: r.format,
        created_by: r.created_by
      })),
      generated_reports_mtd: 386,  // Placeholder for now
      favorite_reports: 5,         // Placeholder for now
      recent_reports: [            // Placeholder for now
        {
          report_id: "R-123456",
          name: "Daily Settlement Summary",
          category: "Settlements",
          generated_date: "2025-03-06T14:30:00",
          format: "PDF",
          status: "Completed"
        },
        {
          report_id: "R-123455",
          name: "Corporate Actions Report",
          category: "Corporate Actions",
          generated_date: "2025-03-05T09:15:00",
          format: "XLSX",
          status: "Completed"
        },
        {
          report_id: "R-123454",
          name: "Customer Activity Report",
          category: "Customers",
          generated_date: "2025-03-04T16:45:00",
          format: "PDF",
          status: "Completed"
        }
      ]
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get trades data
app.get('/api/trades', async (req, res) => {
  try {
    // Get query parameters
    const { limit = 50, offset = 0, status, assetClass, customerId, sortBy = 'trade_date', sortOrder = 'desc' } = req.query;
    
    // Build query conditionally based on filters
    let query = 'SELECT * FROM trade_data WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;
    
    if (status) {
      query += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }
    
    if (assetClass) {
      query += ` AND asset_class = $${paramIndex}`;
      queryParams.push(assetClass);
      paramIndex++;
    }
    
    if (customerId) {
      query += ` AND customer_id = $${paramIndex}`;
      queryParams.push(customerId);
      paramIndex++;
    }
    
    // Add sorting
    const allowedSortFields = ['trade_id', 'customer_name', 'type', 'asset_class', 'amount', 'status', 'trade_date'];
    const allowedSortOrders = ['asc', 'desc'];
    
    const actualSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'trade_date';
    const actualSortOrder = allowedSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder : 'desc';
    
    query += ` ORDER BY ${actualSortBy} ${actualSortOrder.toUpperCase()}`;
    
    // Add pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM trade_data WHERE 1=1`;
    const countResult = await pool.query(countQuery);
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Execute the main query
    const result = await pool.query(query, queryParams);
    
    // Get aggregated statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_trades,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_trades,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_trades,
        SUM(CASE WHEN status = 'Processing' THEN 1 ELSE 0 END) as processing_trades,
        SUM(amount) as total_volume
      FROM trade_data
    `;
    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];
    
    // Get asset class breakdown
    const assetClassQuery = `
      SELECT asset_class, COUNT(*) as count, SUM(amount) as volume
      FROM trade_data
      GROUP BY asset_class
      ORDER BY count DESC
    `;
    const assetClassResult = await pool.query(assetClassQuery);
    
    // Build the response
    const response = {
      trades: result.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(totalCount / parseInt(limit))
      },
      stats: {
        total_trades: parseInt(stats.total_trades) || 0,
        completed_trades: parseInt(stats.completed_trades) || 0,
        pending_trades: parseInt(stats.pending_trades) || 0,
        processing_trades: parseInt(stats.processing_trades) || 0,
        total_volume: parseFloat(stats.total_volume) || 0
      },
      asset_classes: assetClassResult.rows.map(row => ({
        label: row.asset_class,
        count: parseInt(row.count),
        volume: parseFloat(row.volume)
      }))
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching trades data:', error);
    res.status(500).json({ error: 'Failed to fetch trades data' });
  }
});

// Get corporate actions data
app.get('/api/corporate_actions', async (req, res) => {
  try {
    // Create corporate_actions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS corporate_actions (
        id SERIAL PRIMARY KEY,
        action_id VARCHAR(10) NOT NULL,
        security_id VARCHAR(20) NOT NULL,
        security_name VARCHAR(100) NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        announcement_date TIMESTAMP NOT NULL,
        record_date TIMESTAMP,
        payment_date TIMESTAMP,
        status VARCHAR(20) NOT NULL,
        description TEXT,
        impact_value DECIMAL(15,4),
        currency VARCHAR(3) DEFAULT 'USD',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if we need to populate sample data
    const { rows } = await pool.query('SELECT COUNT(*) FROM corporate_actions');
    if (parseInt(rows[0].count) === 0) {
      // Generate sample corporate actions
      const actionTypes = [
        'Dividend', 'Stock Split', 'Merger', 'Acquisition', 'Spinoff', 
        'Rights Issue', 'Bonus Issue', 'Name Change', 'Tender Offer'
      ];
      
      const securityNames = [
        'Apple Inc.', 'Microsoft Corporation', 'Amazon.com, Inc.', 'Alphabet Inc.', 
        'Facebook, Inc.', 'Tesla, Inc.', 'Berkshire Hathaway', 'Visa Inc.', 
        'JPMorgan Chase & Co.', 'Johnson & Johnson'
      ];
      
      const statuses = ['Announced', 'Pending', 'Completed', 'Cancelled'];
      
      // Insert 50 sample corporate actions
      for (let i = 0; i < 20; i++) {
        const actionId = `CA-${10000 + i}`;
        const securityId = `SEC-${1000 + Math.floor(Math.random() * 100)}`;
        const securityIndex = Math.floor(Math.random() * securityNames.length);
        const securityName = securityNames[securityIndex];
        const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
        
        // Random dates within the last 90 days for announcement
        const announcementDate = new Date();
        announcementDate.setDate(announcementDate.getDate() - Math.floor(Math.random() * 90));
        
        // Record date is typically 10-15 days after announcement
        const recordDate = new Date(announcementDate);
        recordDate.setDate(recordDate.getDate() + 10 + Math.floor(Math.random() * 5));
        
        // Payment date is typically 5-10 days after record date
        const paymentDate = new Date(recordDate);
        paymentDate.setDate(paymentDate.getDate() + 5 + Math.floor(Math.random() * 5));
        
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        let description = '';
        let impactValue = null;
        
        // Generate description and impact value based on action type
        if (actionType === 'Dividend') {
          const dividendAmount = (0.1 + Math.random() * 2.9).toFixed(2);
          description = `${securityName} announced a cash dividend of $${dividendAmount} per share.`;
          impactValue = dividendAmount;
        } else if (actionType === 'Stock Split') {
          const ratio = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
          description = `${securityName} announced a ${ratio}:1 stock split.`;
          impactValue = ratio;
        } else if (actionType === 'Merger' || actionType === 'Acquisition') {
          const company = securityNames[Math.floor(Math.random() * securityNames.length)];
          description = `${securityName} to be ${actionType === 'Merger' ? 'merged with' : 'acquired by'} ${company}.`;
        } else {
          description = `${securityName} announced a ${actionType.toLowerCase()}.`;
        }
        
        await pool.query(`
          INSERT INTO corporate_actions (
            action_id, security_id, security_name, action_type, 
            announcement_date, record_date, payment_date, 
            status, description, impact_value, currency
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          actionId, securityId, securityName, actionType,
          announcementDate, recordDate, paymentDate,
          status, description, impactValue, 'USD'
        ]);
      }
      
      console.log('Corporate actions sample data generated');
    }
    
    // Get all corporate actions
    const actionsResult = await pool.query(`
      SELECT * FROM corporate_actions 
      ORDER BY announcement_date DESC
    `);
    
    // Get upcoming actions (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const upcomingActionsResult = await pool.query(`
      SELECT * FROM corporate_actions 
      WHERE record_date > CURRENT_TIMESTAMP 
      AND record_date < $1
      ORDER BY record_date ASC
    `, [thirtyDaysFromNow]);
    
    // Get action types and their counts
    const typesResult = await pool.query(`
      SELECT action_type, COUNT(*) as count
      FROM corporate_actions
      GROUP BY action_type
      ORDER BY count DESC
    `);
    
    // Get status breakdown
    const statusResult = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM corporate_actions
      GROUP BY status
      ORDER BY count DESC
    `);
    
    // Build the response
    const response = {
      actions: actionsResult.rows,
      upcoming_actions: upcomingActionsResult.rows,
      action_types: typesResult.rows.map(row => ({
        type: row.action_type,
        count: parseInt(row.count)
      })),
      status_breakdown: statusResult.rows.map(row => ({
        status: row.status,
        count: parseInt(row.count)
      })),
      total_actions: actionsResult.rows.length,
      upcoming_count: upcomingActionsResult.rows.length
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching corporate actions data:', error);
    res.status(500).json({ error: 'Failed to fetch corporate actions data' });
  }
});

// Start the server
// Fallback route for client-side routing - should be placed after all API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create a function to validate file types
const fileFilter = (req, file, cb) => {
  // Accept JSON and CSV files
  if (file.mimetype === 'application/json' || 
      file.mimetype === 'text/csv' || 
      file.originalname.endsWith('.json') || 
      file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only JSON and CSV files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// API endpoint for uploading data
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'No file uploaded or invalid file type. Only JSON and CSV files are allowed.'
      });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase();
    let data;

    // Read and parse the file based on its type
    if (fileType === '.json') {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(fileContent);
    } else if (fileType === '.csv') {
      // For CSV files, we'll read the content and store it for now
      // In a future update, we'll implement proper CSV parsing
      const fileContent = fs.readFileSync(filePath, 'utf8');
      data = { rows: fileContent.split('\n').map(line => line.split(',')) };
    }

    // Validate data structure
    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid data format. Please check the file structure.'
      });
    }

    // Store in database
    const result = await pool.query(
      `INSERT INTO data_uploads (file_name, file_size, file_type, data, metadata, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        req.file.originalname,
        req.file.size,
        fileType.replace('.', ''),
        data,
        JSON.stringify({
          uploaded_at: new Date(),
          filename: req.file.filename,
          original_name: req.file.originalname
        }),
        'Processed'
      ]
    );

    // Generate a notification for the upload
    await pool.query(
      `INSERT INTO notifications (type, message, time, read, category)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'success',
        `File "${req.file.originalname}" successfully uploaded and processed`,
        'Just now',
        false,
        'Data Uploads'
      ]
    );

    // Clean up the file after it's processed
    fs.unlinkSync(filePath);

    res.status(200).json({
      status: 'success',
      message: 'File uploaded and processed successfully',
      fileName: req.file.originalname,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing the upload: ' + error.message
    });
  }
});

// API endpoint to get a list of uploaded data files
app.get('/api/uploads', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, file_name, file_size, file_type, upload_date, status, 
       (data IS NOT NULL) as has_data
       FROM data_uploads
       ORDER BY upload_date DESC`
    );
    
    res.json({
      status: 'success',
      uploads: rows
    });
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching uploads: ' + error.message
    });
  }
});

// API endpoint to get a specific uploaded file by ID
app.get('/api/uploads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT * FROM data_uploads WHERE id = $1`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Upload not found'
      });
    }
    
    res.json({
      status: 'success',
      upload: rows[0]
    });
  } catch (error) {
    console.error('Error fetching upload:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the upload: ' + error.message
    });
  }
});

// API endpoint to download a file
app.get('/api/download/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT file_name, file_type, data FROM data_uploads WHERE id = $1`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }
    
    const upload = rows[0];
    
    // Set appropriate headers based on file type
    if (upload.file_type === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${upload.file_name}`);
      res.send(JSON.stringify(upload.data, null, 2));
    } else if (upload.file_type === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${upload.file_name}`);
      // For CSV files, convert the stored rows back to CSV format
      if (upload.data && upload.data.rows) {
        const csvContent = upload.data.rows.map(row => row.join(',')).join('\n');
        res.send(csvContent);
      } else {
        res.send(upload.data);
      }
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Unsupported file type for download'
      });
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while downloading the file: ' + error.message
    });
  }
});

// API endpoint to delete an uploaded file
app.delete('/api/upload/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if the file exists
    const checkResult = await pool.query(
      `SELECT id FROM data_uploads WHERE id = $1`,
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }
    
    // Delete the file from the database
    await pool.query(
      `DELETE FROM data_uploads WHERE id = $1`,
      [id]
    );
    
    res.json({
      status: 'success',
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting the file: ' + error.message
    });
  }
});

// Start the server
// Add fallback route for client-side routing (SPA)
app.get('*', (req, res) => {
  // Exclude API routes from the fallback
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // For all other routes, serve the index.html file
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});