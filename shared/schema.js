const { pgTable, serial, varchar, date, boolean, real, integer, text, timestamp } = require('drizzle-orm/pg-core');

// Customers table
const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  accountNumber: varchar('account_number', { length: 50 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(), // Institutional, Retail, etc.
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, inactive, suspended
  createdAt: timestamp('created_at').defaultNow()
});

// Accounts table
const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  accountNumber: varchar('account_number', { length: 50 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(), // Custody, Trading, Settlement
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, inactive, suspended
  createdAt: timestamp('created_at').defaultNow()
});

// Trades table
const trades = pgTable('trades', {
  id: serial('id').primaryKey(),
  tradeId: varchar('trade_id', { length: 50 }).notNull().unique(),
  tradeDate: timestamp('trade_date').notNull(),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  assetName: varchar('asset_name', { length: 255 }).notNull(),
  assetClass: varchar('asset_class', { length: 50 }).notNull(), // Equities, Fixed Income, Commodities, etc.
  quantity: real('quantity').notNull(),
  price: real('price').notNull(),
  amount: real('amount').notNull(),
  type: varchar('type', { length: 10 }).notNull(), // Buy, Sell
  status: varchar('status', { length: 20 }).notNull(), // Completed, Pending, Failed
  settlementDate: timestamp('settlement_date'),
  settlementStatus: varchar('settlement_status', { length: 20 }), // Completed, Pending, Failed
  exchange: varchar('exchange', { length: 50 }),
  settlementLocation: varchar('settlement_location', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow()
});

// Corporate Actions table
const corporateActions = pgTable('corporate_actions', {
  id: serial('id').primaryKey(),
  actionId: varchar('action_id', { length: 20 }).notNull().unique(),
  actionType: varchar('action_type', { length: 50 }).notNull(), // Dividend, Stock Split, Rights Issue, etc.
  securityId: varchar('security_id', { length: 20 }).notNull(),
  securityName: varchar('security_name', { length: 100 }).notNull(),
  announcementDate: timestamp('announcement_date').notNull(),
  recordDate: timestamp('record_date').notNull(),
  paymentDate: timestamp('payment_date'),
  status: varchar('status', { length: 20 }).notNull(), // Announced, Pending, Completed, Cancelled
  description: text('description'),
  impactValue: real('impact_value'),
  currency: varchar('currency', { length: 3 }).default('USD'),
  createdAt: timestamp('created_at').defaultNow()
});

// Assets Under Custody historical data
const assetsUnderCustody = pgTable('assets_under_custody', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  totalValue: real('total_value').notNull(),
  equitiesValue: real('equities_value').notNull(),
  fixedIncomeValue: real('fixed_income_value').notNull(),
  alternativeAssetsValue: real('alternative_assets_value').notNull(),
  cashValue: real('cash_value').notNull()
});

// Trades by Asset Class historical data
const tradesByAsset = pgTable('trades_by_asset', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  assetClass: varchar('asset_class', { length: 50 }).notNull(),
  tradeCount: integer('trade_count').notNull()
});

module.exports = {
  customers,
  accounts,
  trades,
  corporateActions,
  assetsUnderCustody,
  tradesByAsset
};