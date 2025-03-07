const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.SERVER_PORT || 3000;

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

// Add custom middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});



// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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

// Initialize database
initializeDatabase();

// API Routes
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});