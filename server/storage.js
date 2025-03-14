const { db } = require('./db');
const { desc, eq, sql, and, between } = require('drizzle-orm');
const schema = require('../shared/schema');

// Helper to format date for PostgreSQL
const formatDate = (date) => {
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return date.toISOString();
};

// Customer operations
const getCustomers = async () => {
  return await db.select().from(schema.customers);
};

const getActiveCustomers = async () => {
  return await db.select().from(schema.customers)
    .where(eq(schema.customers.status, 'active'));
};

// Account operations
const getAccounts = async () => {
  return await db.select().from(schema.accounts);
};

// Trade operations
const getTrades = async (filters = {}) => {
  let query = db.select().from(schema.trades);
  
  // Apply filters
  if (filters.startDate && filters.endDate) {
    query = query.where(
      between(
        schema.trades.tradeDate,
        formatDate(filters.startDate),
        formatDate(filters.endDate)
      )
    );
  }
  
  if (filters.assetClass) {
    query = query.where(eq(schema.trades.assetClass, filters.assetClass));
  }
  
  if (filters.status) {
    query = query.where(eq(schema.trades.status, filters.status));
  }
  
  if (filters.settlementStatus) {
    query = query.where(eq(schema.trades.settlementStatus, filters.settlementStatus));
  }
  
  if (filters.type) {
    query = query.where(eq(schema.trades.type, filters.type));
  }
  
  // Order by trade date (descending)
  query = query.orderBy(desc(schema.trades.tradeDate));
  
  // Add pagination if needed
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  return await query;
};

// Corporate actions operations
const getCorporateActions = async (filters = {}) => {
  let query = db.select().from(schema.corporateActions);
  
  // Apply filters
  if (filters.type) {
    query = query.where(eq(schema.corporateActions.type, filters.type));
  }
  
  if (filters.status) {
    query = query.where(eq(schema.corporateActions.status, filters.status));
  }
  
  if (filters.priority) {
    query = query.where(eq(schema.corporateActions.priority, filters.priority));
  }
  
  // Order by announcement date (descending)
  query = query.orderBy(desc(schema.corporateActions.announcementDate));
  
  return await query;
};

// Assets under custody operations
const getAssetsUnderCustody = async (filters = {}) => {
  let query = db.select().from(schema.assetsUnderCustody);
  
  // Apply date range filter if provided
  if (filters.startDate && filters.endDate) {
    query = query.where(
      between(
        schema.assetsUnderCustody.date,
        formatDate(filters.startDate).split('T')[0],
        formatDate(filters.endDate).split('T')[0]
      )
    );
  }
  
  // Order by date (ascending)
  query = query.orderBy(schema.assetsUnderCustody.date);
  
  return await query;
};

// Trades by asset operations
const getTradesByAsset = async (filters = {}) => {
  let query = db.select().from(schema.tradesByAsset);
  
  // Apply date range filter if provided
  if (filters.startDate && filters.endDate) {
    query = query.where(
      between(
        schema.tradesByAsset.date,
        formatDate(filters.startDate).split('T')[0],
        formatDate(filters.endDate).split('T')[0]
      )
    );
  }
  
  // Order by date (ascending)
  query = query.orderBy(schema.tradesByAsset.date);
  
  return await query;
};

// Dashboard summary data
const getDashboardSummary = async () => {
  try {
    // Get total customers
    const customersCount = await db
      .select({ count: sql`count(*)` })
      .from(schema.customers);
    
    // Get active customers
    const activeCustomersCount = await db
      .select({ count: sql`count(*)` })
      .from(schema.customers)
      .where(eq(schema.customers.status, 'active'));
    
    // Get total accounts
    const accountsCount = await db
      .select({ count: sql`count(*)` })
      .from(schema.accounts);
    
    // Get total trades
    const tradesCount = await db
      .select({ count: sql`count(*)` })
      .from(schema.trades);
    
    // Get trading volume (sum of all trade amounts)
    const tradingVolume = await db
      .select({ sum: sql`sum(amount)` })
      .from(schema.trades);
    
    // Get pending trades
    const pendingTradesCount = await db
      .select({ count: sql`count(*)` })
      .from(schema.trades)
      .where(eq(schema.trades.status, 'Pending'));
    
    // Get corporate actions data
    const corporateActions = await db
      .select()
      .from(schema.corporateActions);
    
    // Calculate corporate actions statistics
    const caStats = {
      mandatory: corporateActions.filter(ca => ca.mandatory).length,
      voluntary: corporateActions.filter(ca => !ca.mandatory).length,
      total: corporateActions.length,
      high_priority: corporateActions.filter(ca => ca.priority === 'high').length,
      pending_elections: corporateActions.filter(ca => ca.pendingElection).length,
      status: [
        { status: 'Completed', count: corporateActions.filter(ca => ca.status === 'Completed').length },
        { status: 'Pending', count: corporateActions.filter(ca => ca.status === 'Pending').length },
        { status: 'Announced', count: corporateActions.filter(ca => ca.status === 'Announced').length },
        { status: 'Processing', count: corporateActions.filter(ca => ca.status === 'Processing').length }
      ],
      types: [
        { type: 'Dividend', count: corporateActions.filter(ca => ca.type === 'Dividend').length },
        { type: 'Stock Split', count: corporateActions.filter(ca => ca.type === 'Stock Split').length },
        { type: 'Rights Issue', count: corporateActions.filter(ca => ca.type === 'Rights Issue').length },
        { type: 'Merger', count: corporateActions.filter(ca => ca.type === 'Merger').length },
        { type: 'Redemption', count: corporateActions.filter(ca => ca.type === 'Redemption').length }
      ]
    };
    
    // Get assets under custody data
    const latestAUC = await db
      .select()
      .from(schema.assetsUnderCustody)
      .orderBy(desc(schema.assetsUnderCustody.date))
      .limit(1);
    
    // Get historical AUC data
    const aucHistory = await db
      .select()
      .from(schema.assetsUnderCustody)
      .orderBy(schema.assetsUnderCustody.date);
    
    // Return formatted dashboard data
    return {
      totalCustomers: Number(customersCount[0]?.count || 0),
      activeCustomers: Number(activeCustomersCount[0]?.count || 0),
      totalAccounts: Number(accountsCount[0]?.count || 0),
      totalTrades: Number(tradesCount[0]?.count || 0),
      tradingVolume: Number(tradingVolume[0]?.sum || 0),
      pendingTrades: Number(pendingTradesCount[0]?.count || 0),
      openEvents: corporateActions.filter(ca => ca.status !== 'Completed').length,
      corporateActions: caStats,
      dealProcessing: {
        completed: corporateActions.filter(ca => ca.status === 'Completed').length,
        pending: corporateActions.filter(ca => ca.status === 'Pending').length,
        failed: 0 // This would need a new status field or a separate table
      },
      assetsUnderCustody: {
        total: latestAUC[0]?.totalValue || 0,
        byAssetClass: [
          { label: 'Equities', value: latestAUC[0]?.equitiesValue || 0 },
          { label: 'Fixed Income', value: latestAUC[0]?.fixedIncomeValue || 0 },
          { label: 'Alternative Assets', value: latestAUC[0]?.alternativeAssetsValue || 0 },
          { label: 'Cash & Equivalents', value: latestAUC[0]?.cashValue || 0 }
        ],
        history: aucHistory.map(item => ({
          date: item.date,
          value: item.totalValue
        }))
      }
    };
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    throw error;
  }
};

module.exports = {
  getCustomers,
  getActiveCustomers,
  getAccounts,
  getTrades,
  getCorporateActions,
  getAssetsUnderCustody,
  getTradesByAsset,
  getDashboardSummary
};