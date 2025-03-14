const { pgTable, serial, text, timestamp, integer, doublePrecision, varchar, date, boolean } = require('drizzle-orm/pg-core');

// Customers table
const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  accountNumber: varchar('account_number', { length: 20 }).notNull().unique(),
  type: varchar('type', { length: 50 }),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Accounts table
const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  accountNumber: varchar('account_number', { length: 30 }).notNull().unique(),
  type: varchar('type', { length: 50 }),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Trades table
const trades = pgTable('trades', {
  id: serial('id').primaryKey(),
  tradeId: varchar('trade_id', { length: 50 }).notNull().unique(),
  tradeDate: timestamp('trade_date').notNull(),
  customerId: integer('customer_id').references(() => customers.id),
  customerName: text('customer_name'),
  assetName: text('asset_name').notNull(),
  assetClass: varchar('asset_class', { length: 50 }).notNull(),
  amount: doublePrecision('amount').notNull(),
  quantity: integer('quantity').notNull(),
  price: doublePrecision('price').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // Buy, Sell
  status: varchar('status', { length: 20 }).notNull(),
  settlementDate: timestamp('settlement_date'),
  settlementStatus: varchar('settlement_status', { length: 20 }),
  exchange: varchar('exchange', { length: 50 }),
  settlementLocation: varchar('settlement_location', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Corporate Actions table
const corporateActions = pgTable('corporate_actions', {
  id: serial('id').primaryKey(),
  actionId: varchar('action_id', { length: 50 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(), // Dividend, Stock Split, etc.
  assetName: text('asset_name').notNull(),
  mandatory: boolean('mandatory').default(true),
  announcementDate: date('announcement_date').notNull(),
  recordDate: date('record_date'),
  paymentDate: date('payment_date'),
  status: varchar('status', { length: 20 }).notNull(), // Announced, Pending, Completed, Processing
  priority: varchar('priority', { length: 20 }).default('normal'), // low, normal, high
  pendingElection: boolean('pending_election').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Assets Under Custody table for historical data
const assetsUnderCustody = pgTable('assets_under_custody', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  totalValue: doublePrecision('total_value').notNull(),
  equitiesValue: doublePrecision('equities_value'),
  fixedIncomeValue: doublePrecision('fixed_income_value'),
  alternativeAssetsValue: doublePrecision('alternative_assets_value'),
  cashValue: doublePrecision('cash_value'),
  createdAt: timestamp('created_at').defaultNow()
});

// Trades by Asset Class for historical data
const tradesByAsset = pgTable('trades_by_asset', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  assetClass: varchar('asset_class', { length: 50 }).notNull(),
  tradeCount: integer('trade_count').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

module.exports = {
  customers,
  accounts,
  trades,
  corporateActions,
  assetsUnderCustody,
  tradesByAsset
};