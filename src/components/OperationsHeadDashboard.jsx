import React, { useState, useEffect } from 'react';
import { formatNumber, formatCurrency, formatPercentage, formatDate } from '../utils';
import { fetchData } from '../services/api';
import MetricCard from './MetricCard';
import Chart from './Chart';
import DataTable from './DataTable';
import DateRangeFilter from './DateRangeFilter';
import TradeDetailModal from './TradeDetailModal';

// Status styling for corporate actions
const statusDotStyle = {
  display: 'inline-block',
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  marginRight: '8px'
};

const statusItemStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '8px 0'
};

const statusLabelStyle = {
  fontWeight: 'bold',
  marginRight: '8px'
};

const statusValueStyle = {
  fontSize: '1.2rem',
  fontWeight: '500'
};

const OperationsHeadDashboard = () => { // Operations Head Dashboard
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // States for trade and filter management
  const [filterParams, setFilterParams] = useState({
    startDate: null,
    endDate: new Date(),
    range: '30d'
  });
  const [filteredVolumeData, setFilteredVolumeData] = useState([]);
  const [filteredTradeCountData, setFilteredTradeCountData] = useState([]);
  const [filteredAucHistoryData, setFilteredAucHistoryData] = useState([]);
  const [filteredTradesByAssetData, setFilteredTradesByAssetData] = useState([]);
  
  // State for filtered income history data
  const [filteredIncomeHistory, setFilteredIncomeHistory] = useState([]);
  
  // State for individual filters
  const [aucHistoryFilterParams, setAucHistoryFilterParams] = useState({
    startDate: null,
    endDate: new Date(),
    range: '30d'
  });
  const [tradesByAssetFilterParams, setTradesByAssetFilterParams] = useState({
    startDate: null,
    endDate: new Date(),
    range: '30d'
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Use our API service to fetch real data
        const dashboardData = await fetchData('dashboard');
        console.log('Dashboard data loaded:', dashboardData);
        
        // Process the data from our API format to the component format
        const processedData = processApiData(dashboardData);
        console.log('Processed dashboard data:', processedData);
        setData(processedData);
        
        // Initialize filtered income history when data is loaded
        if (processedData && processedData.incomeHistory && processedData.incomeHistory.length > 0) {
          setFilteredIncomeHistory(processedData.incomeHistory);
        }
        
        setLoading(false);
        
        // Set initial filtered data
        applyDateFilter(processedData.tradingVolumeHistory, processedData.tradeCountHistory, filterParams);
        
        // Initialize AUC history data filter
        applyAucHistoryFilter(processedData.assetsUnderCustody?.history || [], aucHistoryFilterParams);
        
        // Initialize trades by asset class filter if there's time-based data
        if (processedData.tradesByAssetClassHistory) {
          applyTradesByAssetFilter(processedData.tradesByAssetClassHistory, tradesByAssetFilterParams);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  
  const handleDateFilterChange = (newFilterParams) => {
    setFilterParams(newFilterParams);
    if (data) {
      applyDateFilter(data.tradingVolumeHistory, data.tradeCountHistory, newFilterParams);
    }
  };
  
  const applyDateFilter = (volumeData, tradeCountData, filterParams) => {
    const { startDate, endDate, range } = filterParams;
    
    // If 'all' is selected, use all data
    if (filterParams.range.toLowerCase() === 'all') {
      setFilteredVolumeData(volumeData);
      setFilteredTradeCountData(tradeCountData);
      return;
    }
    
    // For more consistent filtering across charts, use the same time-range based approach
    let filteredVolume = [];
    let filteredCount = [];
    const rangeLower = range.toLowerCase();
    
    if (rangeLower === '7d') {
      // For 7d, get the most recent 7 days
      filteredVolume = volumeData.slice(-7);
      filteredCount = tradeCountData.slice(-7);
      console.log(`Using most recent 7 days for Volume/Count - 7d filter`);
    } 
    else if (rangeLower === '30d') {
      // For 30d, get the most recent 30 days
      filteredVolume = volumeData.slice(-30);
      filteredCount = tradeCountData.slice(-30);
      console.log(`Using most recent 30 days for Volume/Count - 30d filter`);
    }
    else if (rangeLower === '90d') {
      // For 90d filter, get the most recent 90 days
      filteredVolume = volumeData.slice(-90);
      filteredCount = tradeCountData.slice(-90);
      console.log(`Using most recent 90 days for Volume/Count - 90d filter`);
    }
    else if (rangeLower === 'ytd') {
      // For YTD, filter to the current year
      const currentYear = new Date().getFullYear();
      
      filteredVolume = volumeData.filter(item => {
        const date = new Date(item.date);
        return date.getFullYear() === currentYear;
      });
      
      filteredCount = tradeCountData.filter(item => {
        const date = new Date(item.date);
        return date.getFullYear() === currentYear;
      });
      
      console.log(`Using current year data for Volume/Count - YTD filter`);
    }
    else {
      // Apply date-based filters as fallback
      filteredVolume = volumeData.filter(item => {
        // Parse the date string to ensure proper comparison
        const itemDate = new Date(item.date);
        
        // Log some dates for debugging
        if (Math.random() < 0.05) { // Only log ~5% of items to avoid console spam
          console.log(`Trading volume date check (${item.date}):`, {
            itemDateObj: itemDate,
            startDate: startDate,
            endDate: endDate,
            passesFilter: (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate)
          });
        }
        
        return (!startDate || itemDate >= startDate) && 
               (!endDate || itemDate <= endDate);
      });
      
      filteredCount = tradeCountData.filter(item => {
        // Parse the date string to ensure proper comparison
        const itemDate = new Date(item.date);
        return (!startDate || itemDate >= startDate) && 
               (!endDate || itemDate <= endDate);
      });
    }
    
    console.log(`Filtered volume data: ${filteredVolume.length} of ${volumeData.length} items`);
    console.log(`Filtered count data: ${filteredCount.length} of ${tradeCountData.length} items`);
    
    // If we get no data after filtering, use the original data (failsafe)
    setFilteredVolumeData(filteredVolume.length > 0 ? filteredVolume : volumeData);
    setFilteredTradeCountData(filteredCount.length > 0 ? filteredCount : tradeCountData);
  };
  
  // Handle AUC History filter changes
  const handleAucHistoryFilterChange = (newFilterParams) => {
    setAucHistoryFilterParams(newFilterParams);
    if (data && data.assetsUnderCustody && data.assetsUnderCustody.history) {
      applyAucHistoryFilter(data.assetsUnderCustody.history, newFilterParams);
    }
  };
  
  // Apply filters to AUC history data
  const applyAucHistoryFilter = (aucHistory, filterParams) => {
    const { startDate, endDate, range } = filterParams;
    
    console.log('AUC Filter Params:', {
      range, 
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null
    });
    
    // If 'all' is selected or no history data, use all data
    if (range.toLowerCase() === 'all' || !aucHistory || aucHistory.length === 0) {
      setFilteredAucHistoryData(aucHistory || []);
      return;
    }
    
    // Now that AUC data is daily (not monthly), we can use similar filtering logic as other charts
    let filteredData = [];
    const rangeLower = range.toLowerCase();
    
    if (rangeLower === '7d') {
      // For 7d, get the most recent 7 days
      filteredData = aucHistory.slice(-7);
      console.log(`Using most recent 7 days of AUC data for 7d filter`);
    } 
    else if (rangeLower === '30d') {
      // For 30d, get the most recent 30 days
      filteredData = aucHistory.slice(-30);
      console.log(`Using most recent 30 days of AUC data for 30d filter`);
    }
    else if (rangeLower === '90d') {
      // For 90d, get the most recent 90 days
      filteredData = aucHistory.slice(-90);
      console.log(`Using most recent 90 days of AUC data for 90d filter`);
    }
    else if (rangeLower === 'ytd') {
      // For YTD, filter to the current year
      const currentYear = new Date().getFullYear();
      filteredData = aucHistory.filter(item => {
        // Support both new and old format
        if (item.date) {
          const date = new Date(item.date);
          return date.getFullYear() === currentYear;
        } else if (item.month) {
          const [year] = item.month.split('-').map(num => parseInt(num, 10));
          return year === currentYear;
        }
        return false;
      });
      console.log(`Filtered to ${filteredData.length} days in current year for YTD filter`);
    }
    else {
      // For any other filter, try to use the date range (this is the original approach)
      filteredData = aucHistory.filter(item => {
        let itemDate;
        
        // Support both new and old format
        if (item.date) {
          itemDate = new Date(item.date);
        } else if (item.month) {
          const [year, month] = item.month.split('-').map(num => parseInt(num, 10));
          itemDate = new Date(year, month - 1, 1);
        } else {
          return false;
        }
        
        // Debug log (sample only 1% to avoid console flooding)
        if (Math.random() < 0.01) {
          console.log(`Comparing date:`, {
            itemDate: itemDate.toISOString(),
            passesFilter: (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate),
            startCheck: !startDate || itemDate >= startDate,
            endCheck: !endDate || itemDate <= endDate
          });
        }
        
        return (!startDate || itemDate >= startDate) && 
               (!endDate || itemDate <= endDate);
      });
    }
    
    console.log(`Filtered AUC data: ${filteredData.length} items`);
    
    // If no data after filtering, use all data as fallback
    if (filteredData.length === 0) {
      console.log('No AUC data after filtering, using all data');
      setFilteredAucHistoryData(aucHistory);
    } else {
      setFilteredAucHistoryData(filteredData);
    }
  };
  
  // Handle Trades by Asset Class filter changes
  const handleTradesByAssetFilterChange = (newFilterParams) => {
    setTradesByAssetFilterParams(newFilterParams);
    if (data && data.tradesByAssetClassHistory) {
      applyTradesByAssetFilter(data.tradesByAssetClassHistory, newFilterParams);
    }
  };
  
  // Handle Income History filter change
  const handleIncomeHistoryFilterChange = (newFilterParams) => {
    console.log('Income history filter changed:', newFilterParams);
    if (data && data.incomeHistory) {
      const { startDate, endDate, range } = newFilterParams;
      // Filter income history data based on date range
      let filtered = [];
      
      if (range.toLowerCase() === 'all') {
        filtered = data.incomeHistory;
      } else if (range.toLowerCase() === '7d') {
        filtered = data.incomeHistory.slice(-7);
      } else if (range.toLowerCase() === '30d') {
        filtered = data.incomeHistory.slice(-30);
      } else if (range.toLowerCase() === '90d') {
        filtered = data.incomeHistory.slice(-90);
      } else if (range.toLowerCase() === 'ytd') {
        const currentYear = new Date().getFullYear();
        filtered = data.incomeHistory.filter(item => {
          const date = new Date(item.date);
          return date.getFullYear() === currentYear;
        });
      } else {
        // Custom date range
        filtered = data.incomeHistory.filter(item => {
          const itemDate = new Date(item.date);
          return (!startDate || itemDate >= startDate) && 
                 (!endDate || itemDate <= endDate);
        });
      }
      
      setFilteredIncomeHistory(filtered.length > 0 ? filtered : data.incomeHistory);
    }
  };
  
  // Apply filters to Trades by Asset Class data
  const applyTradesByAssetFilter = (tradesByAssetHistory, filterParams) => {
    const { startDate, endDate, range } = filterParams;
    
    console.log('Trades By Asset Filter Params:', {
      range, 
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null
    });
    
    // If there's no history or we want all data, return empty array to use default data
    if (!tradesByAssetHistory || tradesByAssetHistory.length === 0 || range.toLowerCase() === 'all') {
      console.log('Using default trades by asset data (all time or no history)');
      setFilteredTradesByAssetData([]);
      return;
    }
    
    // For trades by asset class, we'll use similar logic as AUC
    let filteredHistory = [];
    const rangeLower = range.toLowerCase();
    
    if (rangeLower === '7d') {
      // For 7d, get the most recent 7 days
      filteredHistory = tradesByAssetHistory.slice(-7);
      console.log(`Using most recent 7 days for Trades by Asset - 7d filter`);
    } 
    else if (rangeLower === '30d') {
      // For 30d, get the most recent 30 days
      filteredHistory = tradesByAssetHistory.slice(-30);
      console.log(`Using most recent 30 days for Trades by Asset - 30d filter`);
    }
    else if (rangeLower === '90d') {
      // For 90d filter, get the most recent 90 days
      filteredHistory = tradesByAssetHistory.slice(-90);
      console.log(`Using most recent 90 days for Trades by Asset - 90d filter`);
    }
    else if (rangeLower === 'ytd') {
      // For YTD, filter to the current year
      const currentYear = new Date().getFullYear();
      filteredHistory = tradesByAssetHistory.filter(item => {
        const date = new Date(item.date);
        return date.getFullYear() === currentYear;
      });
      console.log(`Using current year data for Trades by Asset - YTD filter: ${filteredHistory.length} days`);
    }
    else {
      // For other filters, use date-based filtering (original approach)
      filteredHistory = tradesByAssetHistory.filter(item => {
        const itemDate = new Date(item.date);
        const passes = (!startDate || itemDate >= startDate) && 
               (!endDate || itemDate <= endDate);
        
        if (tradesByAssetHistory.length < 10 || Math.random() < 0.01) {
          // Log a sample of items for debugging (to avoid flooding console)
          console.log(`Comparing date ${item.date}:`, {
            itemDate: itemDate.toISOString(),
            passesFilter: passes,
            startCheck: !startDate || itemDate >= startDate,
            endCheck: !endDate || itemDate <= endDate
          });
        }
        
        return passes;
      });
    }
    
    console.log(`Filtered trades history: ${filteredHistory.length} days of data`);
    
    // If we have no data after filtering, use default data (all trades)
    if (filteredHistory.length === 0) {
      console.log('No data in range, using default trades by asset data');
      setFilteredTradesByAssetData([]);
      return;
    }
    
    // Instead of just using the most recent day's data, calculate daily average for each asset class
    // First, create a map to store totals for each asset class
    const assetTotals = new Map();
    const assetDays = new Map();
    
    // Process each day's data
    filteredHistory.forEach(day => {
      if (day.assets && day.assets.length > 0) {
        day.assets.forEach(asset => {
          // Initialize or update the asset totals
          if (!assetTotals.has(asset.label)) {
            assetTotals.set(asset.label, 0);
            assetDays.set(asset.label, 0);
          }
          
          assetTotals.set(asset.label, assetTotals.get(asset.label) + asset.value);
          assetDays.set(asset.label, assetDays.get(asset.label) + 1);
        });
      }
    });
    
    // Convert the totals into an array of asset data with daily averages
    const aggregatedAssetData = Array.from(assetTotals.entries()).map(([label, total]) => {
      const days = assetDays.get(label);
      return {
        label,
        value: Math.round(total / (days || 1)) // Average per day, avoid division by zero
      };
    });
    
    // Sort by value (descending) to show most active asset classes first
    aggregatedAssetData.sort((a, b) => b.value - a.value);
    
    console.log(`Aggregated asset data from ${filteredHistory.length} days:`, aggregatedAssetData);
    
    if (aggregatedAssetData.length > 0) {
      setFilteredTradesByAssetData(aggregatedAssetData);
    } else {
      // If no data, use empty array
      console.log('No asset data after aggregation, using empty array');
      setFilteredTradesByAssetData([]);
    }
  };
  
  // Functions for trade interactions removed (moved to Trades.jsx)
  
  /**
   * Process API data into the format expected by the dashboard component
   */
  const processApiData = (apiData) => {
    // Extract metrics directly from API response
    const totalCustomers = apiData.totalCustomers || apiData.total_customers || 0;
    const activeCustomers = apiData.activeCustomers || apiData.active_customers || 0;
    const monthlyGrowth = parseFloat(apiData.monthlyGrowth || apiData.monthly_growth) || 0;
    const totalIncome = parseFloat(apiData.monthlyIncome || apiData.total_income) || 0;
    
    // Extract Assets Under Custody (AUC) data
    let assetsUnderCustody = apiData.assetsUnderCustody;
    
    if (!assetsUnderCustody || !assetsUnderCustody.history || assetsUnderCustody.history.length < 180) {
      // Generate 180 days of AUC history (approximately 6 months) if not provided
      const today = new Date();
      const auc_history = [];
      
      // Start from 180 days ago
      for (let i = 0; i < 180; i++) {
        const dayOffset = 180 - i - 1; // Count backwards from 180 days ago
        const historyDate = new Date(today);
        historyDate.setDate(historyDate.getDate() - dayOffset);
        
        // Create a base AUC value with an upward trend and some seasonality
        const dayOfYear = Math.floor((historyDate - new Date(historyDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const baseValue = 3500000000000; // Base value 
        const trendFactor = 1 + (i * 0.001); // 0.1% growth per day
        const seasonalFactor = 1 + 0.05 * Math.sin((dayOfYear / 365) * 2 * Math.PI); // Seasonal variation
        
        // Add some daily fluctuation
        const dailyFluctuation = 1 + (Math.random() * 0.002 - 0.001); // +/- 0.1%
        
        const value = Math.round(baseValue * trendFactor * seasonalFactor * dailyFluctuation);
        
        auc_history.push({
          date: historyDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          value: value
        });
      }
      
      // Use existing AUC object if available or create a new one
      assetsUnderCustody = assetsUnderCustody || {
        total: 4259873651294, // Default total
        byAssetClass: [
          { label: 'Equities', value: 1893284574325 },
          { label: 'Fixed Income', value: 1532753514466 },
          { label: 'Alternative Assets', value: 532484206412 },
          { label: 'Cash & Equivalents', value: 301351356091 }
        ],
        history: auc_history
      };
      
      // If AUC exists but history is missing or too short, replace with generated history
      if (assetsUnderCustody.history === undefined || assetsUnderCustody.history.length < 12) {
        assetsUnderCustody.history = auc_history;
      }
    }
    
    // Extract customer segments data from API
    const customerSegments = apiData.customerSegments || [
      { label: 'Institutional', value: 45 },
      { label: 'Corporate', value: 30 },
      { label: 'Retail', value: 25 }
    ];
    
    // Use real trade data if available, otherwise generate mock data
    let tradeMonthlyData = [];
    if (apiData.tradeHistory && apiData.tradeHistory.length > 0) {
      tradeMonthlyData = apiData.tradeHistory;
    } else if (apiData.trade_monthly && apiData.trade_monthly.length > 0) {
      tradeMonthlyData = apiData.trade_monthly;
    } else {
      // Generate mock trade data with consistent dates for the past 6 months
      const today = new Date();
      const numberOfDays = 180; // Approximately 6 months of data
      tradeMonthlyData = Array(numberOfDays).fill(0).map((_, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (numberOfDays - 1 - index)); // Going backward from 180 days ago to today
        
        // Create more realistic values with seasonal patterns
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const seasonalFactor = 1 + 0.3 * Math.sin(dayOfYear * Math.PI / 180); // Seasonal variation
        
        // Base values with trend and seasonality
        const baseTrades = 1000 + index * 0.5; // Slight upward trend
        const baseVolume = 150000000 + index * 50000; // Slight upward trend
        
        return {
          date: date.toISOString().split('T')[0],
          total_trades: Math.round(baseTrades * seasonalFactor + Math.floor(Math.random() * 200)), // Add randomness
          trade_volume: Math.round(baseVolume * seasonalFactor + Math.floor(Math.random() * 10000000)) // Add randomness
        };
      });
    }
    
    // Extract trade data for charts
    const tradingVolumeHistory = tradeMonthlyData.map(item => ({
      date: new Date(item.date),
      value: parseFloat(item.trade_volume)
    }));
    
    const tradeCountHistory = tradeMonthlyData.map(item => ({
      date: new Date(item.date),
      value: parseInt(item.total_trades)
    }));
    
    // Use real asset class breakdown if available
    let tradesByAssetClass = apiData.tradesByAssetClass || [];
    if (!tradesByAssetClass || tradesByAssetClass.length === 0) {
      if (apiData.trades_by_asset && apiData.trades_by_asset.length > 0) {
        tradesByAssetClass = apiData.trades_by_asset;
      } else {
        // Fallback mock data
        tradesByAssetClass = [
          { label: 'Equity', value: 45 },
          { label: 'Fixed Income', value: 30 },
          { label: 'FX', value: 15 },
          { label: 'Fund', value: 10 }
        ];
      }
    }
    
    // Generate a time-series of trades by asset class for filtering
    const tradesByAssetClassHistory = [];
    
    // If time-based data isn't already provided, generate it for the past 6 months
    if (!apiData.tradesByAssetClassHistory || apiData.tradesByAssetClassHistory.length === 0) {
      const today = new Date();
      const assetTypes = ['Equity', 'Fixed Income', 'FX', 'Fund', 'Commodity'];
      
      // Generate 180 days of data (approx 6 months)
      for (let i = 0; i < 180; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (180 - i - 1));
        
        // For each day, generate data for each asset class
        const dayData = {
          date: date.toISOString().split('T')[0],
          assets: []
        };
        
        // Generate data for each asset type with seasonality
        assetTypes.forEach((asset, index) => {
          const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
          
          // Create asset-specific seasonality
          let seasonalFactor;
          switch(asset) {
            case 'Equity':
              // More equity trading in Q1 and Q4
              seasonalFactor = 1 + 0.4 * Math.sin((dayOfYear + 90) * Math.PI / 180);
              break;
            case 'Fixed Income':
              // More bond trading in Q2
              seasonalFactor = 1 + 0.3 * Math.sin((dayOfYear + 180) * Math.PI / 180);
              break;
            case 'FX':
              // More FX trading around fiscal year ends
              seasonalFactor = 1 + 0.5 * Math.cos(dayOfYear * Math.PI / 90);
              break;
            default:
              // Random seasonality for other assets
              seasonalFactor = 1 + 0.2 * Math.sin(dayOfYear * Math.PI / 120);
          }
          
          // Base value depends on asset type popularity
          const baseValue = [40, 30, 20, 10, 5][index] * seasonalFactor;
          
          // Add some random variation
          const value = Math.round(baseValue + Math.random() * 8 - 4);
          
          dayData.assets.push({
            label: asset,
            value: Math.max(0, value) // Ensure no negative values
          });
        });
        
        tradesByAssetClassHistory.push(dayData);
      }
    }
    
    // Get total trades and trading volume from API
    const totalTrades = apiData.totalTrades || apiData.total_trades || 
      tradeMonthlyData.reduce((sum, item) => sum + parseInt(item.total_trades), 0);
      
    const tradingVolume = apiData.tradingVolume || apiData.trading_volume || 
      tradeMonthlyData.reduce((sum, item) => sum + parseFloat(item.trade_volume), 0);
    
    const pendingTrades = apiData.pendingTrades || apiData.pending_trades || Math.round(totalTrades * 0.05);
    
    // Mock recent trades - in a real implementation, this would come from the API
    const recentTrades = Array(10).fill(0).map((_, i) => ({
      id: `T-${100000 + i}`,
      customer: ['BlackRock', 'Vanguard', 'Fidelity', 'State Street', 'JPMorgan'][i % 5],
      type: i % 2 === 0 ? 'Buy' : 'Sell',
      asset: ['Equity', 'Fixed Income', 'Fund', 'FX', 'Commodity'][i % 5],
      amount: 10000 + (i * 10000),
      status: ['Completed', 'Pending', 'Processing', 'Failed', 'Cancelled'][i % 5],
      date: new Date(Date.now() - (i * 86400000)).toISOString()
    }));
    
    // Extract deal processing and open events data
    let dealProcessing = apiData.dealProcessing;
    // Handle dealProcessing as object or number
    if (typeof dealProcessing === 'object') {
      // already an object, keep as is
    } else if (typeof dealProcessing === 'number') {
      dealProcessing = {
        completed: Math.round(dealProcessing * 0.8),
        pending: Math.round(dealProcessing * 0.15),
        failed: Math.round(dealProcessing * 0.05)
      };
    } else {
      // Create default object
      dealProcessing = {
        completed: 0,
        pending: 0,
        failed: 0
      };
    }
    
    // Get open events count 
    const openEvents = apiData.openEvents || 15;
    
    // Return processed data
    return {
      totalCustomers: totalCustomers,
      activeCustomers: activeCustomers,
      totalAccounts: Math.round(totalCustomers * 1.5),
      totalTrades: totalTrades,
      tradingVolume: tradingVolume,
      pendingTrades: pendingTrades,
      openEvents: openEvents,
      corporateActions: apiData.corporateActions || {
        mandatory: 34,
        voluntary: 12,
        total: 46,
        high_priority: 8,
        pending_elections: 12,
        status: [],
        types: []
      },
      dealProcessing: dealProcessing,
      monthlyIncome: totalIncome,
      incomeByService: [],
      assetsUnderCustody: assetsUnderCustody,
      customerSegments,
      tradesByAssetClass,
      tradesByAssetClassHistory,
      recentTrades,
      tradingVolumeHistory,
      tradeCountHistory
    };
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="alert alert-warning m-4" role="alert">
        No dashboard data available
      </div>
    );
  }

  const {
    totalCustomers,
    activeCustomers,
    totalAccounts,
    totalTrades,
    tradingVolume,
    pendingTrades,
    openEvents,
    corporateActions,
    dealProcessing,
    customerSegments,
    tradesByAssetClass,
    tradesByAssetClassHistory,
    monthlyIncome,
    incomeByService,
    recentTrades,
    assetsUnderCustody
  } = data;

  // Prepare chart data
  const customerSegmentChartData = {
    labels: customerSegments.map(item => item.label),
    datasets: [
      {
        data: customerSegments.map(item => item.value),
        backgroundColor: [
          '#007C75',  // Primary green
          '#009E94',  // Light green
          '#006560',  // Dark green
        ],
        borderWidth: 0,
      }
    ]
  };
  
  // Assets Under Custody (AUC) data
  const aucByAssetClassData = {
    labels: assetsUnderCustody?.byAssetClass?.map(item => item.label) || [],
    datasets: [
      {
        data: assetsUnderCustody?.byAssetClass?.map(item => item.value) || [],
        backgroundColor: [
          '#007C75',  // Primary green
          '#009E94',  // Light green
          '#006560',  // Dark green
          '#00AEA4',  // Lighter green
        ],
        borderWidth: 0,
      }
    ]
  };
  
  // AUC history chart data - using filtered data if available
  const aucHistoryData = {
    labels: (filteredAucHistoryData.length > 0 ? filteredAucHistoryData : assetsUnderCustody?.history || [])
      .map(item => {
        // Handle both old (month) and new (date) format
        if (item.date) {
          const date = new Date(item.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        } else if (item.month) {
          const [year, month] = item.month.split('-');
          return `${month}/${year.slice(2)}`;
        }
        return '';
      }),
    datasets: [
      {
        label: 'Assets Under Custody',
        data: (filteredAucHistoryData.length > 0 ? filteredAucHistoryData : assetsUnderCustody?.history || [])
          .map(item => item.value),
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(0, 124, 117, 0.2)',
        borderColor: '#007C75',
        pointRadius: 0, // Remove points from the line
        pointHoverRadius: 5, // Show points on hover only
      }
    ]
  };
  
  // Corporate Actions chart data removed (moved to Corporate Actions component)

  // Trades by Asset Class chart data - using filtered data from the specified time period
  const tradesByAssetChartData = {
    labels: (filteredTradesByAssetData.length > 0 ? filteredTradesByAssetData : tradesByAssetClass || [])
      .map(item => item.label),
    datasets: [
      {
        label: 'Trades by Asset Class',
        data: (filteredTradesByAssetData.length > 0 ? filteredTradesByAssetData : tradesByAssetClass || [])
          .map(item => item.value),
        backgroundColor: [
          '#007C75',  // Primary green
          '#009E94',  // Light green
          '#006560',  // Dark green
          '#00AEA4',  // Lighter green
          '#005550',  // Darker green
        ],
        borderWidth: 0,
      }
    ]
  };

  const tradingVolumeChartData = {
    labels: filteredVolumeData.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Trading Volume',
        data: filteredVolumeData.map(item => item.value),
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(0, 124, 117, 0.2)',
        borderColor: '#007C75',
        pointRadius: 0, // Remove points from the line
        pointHoverRadius: 5, // Show points on hover only
      }
    ]
  };

  const tradeCountChartData = {
    labels: filteredTradeCountData.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Trade Count',
        data: filteredTradeCountData.map(item => item.value),
        fill: true,
        tension: 0.4,
        backgroundColor: 'rgba(0, 124, 117, 0.2)',
        borderColor: '#007C75',
        pointRadius: 0, // Remove points from the line
        pointHoverRadius: 5, // Show points on hover only
      }
    ]
  };

  // Table columns for recent trades
  const recentTradesColumns = [
    { field: 'id', header: 'Trade ID', width: '15%' },
    { field: 'customer', header: 'Customer', width: '20%' },
    { field: 'type', header: 'Type', width: '10%' },
    { field: 'asset', header: 'Asset', width: '10%' },
    { field: 'amount', header: 'Amount', type: 'currency', width: '15%' },
    { field: 'status', header: 'Status', type: 'status', width: '10%' },
    { field: 'date', header: 'Date', type: 'date', format: 'datetime', width: '20%' }
  ];

  return (
    <div className="dashboard">
      <div className="page-header mb-4">
        <h1>Operations Head Dashboard</h1>
        <DateRangeFilter onFilterChange={handleDateFilterChange} />
      </div>
      
      {/* CUSTOMER METRICS SECTION */}
      <div className="section-header">
        <h2>Customer Metrics</h2>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-4 col-sm-4">
          <MetricCard 
            title="Total Customers" 
            value={formatNumber(totalCustomers, false)} 
            icon="users"
          />
        </div>
        <div className="col-md-4 col-sm-4">
          <MetricCard 
            title="Active Customers" 
            value={formatNumber(activeCustomers, false)} 
            subtitle={`${Math.round((activeCustomers / totalCustomers) * 100)}% of total`}
            icon="user-check"
          />
        </div>
        <div className="col-md-4 col-sm-4">
          <MetricCard 
            title="New Customers (MTD)" 
            value={formatNumber(data?.newCustomersMtd || 0, false)} 
            subtitle="Month to date"
            icon="user-plus"
            color="#17A2B8"
          />
        </div>
      </div>
      
      {/* Customer Segments */}
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h2>Customer Segments</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="pie"
                data={customerSegmentChartData}
                height="300px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* OPERATIONS OVERVIEW SECTION */}
      <div className="section-header">
        <h2>Operations Overview</h2>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Total Trades" 
            value={formatNumber(totalTrades, false)} 
            icon="exchange-alt"
          />
        </div>
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Trading Volume" 
            value={formatCurrency(tradingVolume, 'USD', 0)} 
            icon="dollar-sign"
            valueClassName="smaller-value"
          />
        </div>
        <div className="col-md-2 col-sm-6">
          <MetricCard 
            title="Successful Trades" 
            value={formatNumber(data?.dealProcessing?.completed || 0, false)} 
            icon="check-circle"
            color="#28A745"
          />
        </div>
        <div className="col-md-2 col-sm-6">
          <MetricCard 
            title="Failed Trades" 
            value={formatNumber(data?.dealProcessing?.failed || 0, false)} 
            icon="times-circle"
            color="#DC3545"
          />
        </div>
        <div className="col-md-2 col-sm-6">
          <MetricCard 
            title="Pending Trades" 
            value={formatNumber(data?.dealProcessing?.pending || pendingTrades, false)} 
            icon="clock"
            color="#FFC107"
          />
        </div>
      </div>

      {/* Trading Volume History */}
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Trading Volume History</h2>
              <DateRangeFilter onFilterChange={handleDateFilterChange} />
            </div>
            <div className="card-body">
              <Chart 
                type="line"
                data={tradingVolumeChartData}
                height="300px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: false,
                      grace: "5%",
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value, 'USD', 0);
                        }
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return formatCurrency(context.raw, 'USD', 0);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trade Count and Asset Class */}
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Trade Count History</h2>
              <DateRangeFilter onFilterChange={handleDateFilterChange} />
            </div>
            <div className="card-body">
              <Chart 
                type="line"
                data={tradeCountChartData}
                height="250px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: false,
                      grace: '5%',
                      ticks: {
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Trades by Asset Class</h2>
              <DateRangeFilter onFilterChange={handleTradesByAssetFilterChange} />
            </div>
            <div className="card-body">
              <Chart 
                type="bar"
                data={tradesByAssetChartData}
                height="250px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0
                      }
                    }
                  },
                  barPercentage: 0.6,
                  categoryPercentage: 0.8
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* CORPORATE ACTIONS SECTION */}
      <div className="section-header">
        <h2>Corporate Actions</h2>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-2 col-sm-6">
          <MetricCard 
            title="Open Events" 
            value={formatNumber(openEvents, false)} 
            icon="exclamation-circle"
            color="#DC3545"
          />
        </div>
        <div className="col-md-2 col-sm-6">
          <MetricCard 
            title="Mandatory Actions" 
            value={formatNumber(data?.corporateActions?.mandatory || 0, false)} 
            icon="file-alt"
            color="#0D6EFD"
          />
        </div>
        <div className="col-md-2 col-sm-6">
          <MetricCard 
            title="Voluntary Actions" 
            value={formatNumber(data?.corporateActions?.voluntary || 0, false)} 
            icon="file-signature"
            color="#6610F2"
          />
        </div>
        <div className="col-md-2 col-sm-6">
          <MetricCard 
            title="Pending Actions" 
            value={formatNumber(data?.corporateActions?.pending_elections || 0, false)} 
            icon="calendar-alt"
            color="#FFC107"
          />
        </div>
        <div className="col-md-2 col-sm-6">
          <MetricCard 
            title="Upcoming Actions" 
            value={formatNumber(data?.corporateActions?.upcoming || 14, false)} 
            icon="calendar-plus"
            color="#17A2B8"
          />
        </div>
      </div>

      {/* Corporate Actions Details */}
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <h2>Corporate Actions Breakdown</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="pie"
                data={{
                  labels: ['Mandatory', 'Voluntary', 'Pending Actions', 'Upcoming Actions'],
                  datasets: [
                    {
                      data: [
                        data?.corporateActions?.mandatory || 0,
                        data?.corporateActions?.voluntary || 0,
                        data?.corporateActions?.pending_elections || 0,
                        data?.corporateActions?.upcoming || 14
                      ],
                      backgroundColor: [
                        '#0D6EFD', 
                        '#6610F2', 
                        '#FFC107', 
                        '#17A2B8'
                      ],
                      borderWidth: 1
                    }
                  ]
                }}
                height="300px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card">
            <div className="card-header">
              <h2>Recent Corporate Actions</h2>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Security</th>
                      <th>Action Type</th>
                      <th>Status</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentCorporateActions ? (
                      data.recentCorporateActions.slice(0, 5).map((action, index) => (
                        <tr key={index}>
                          <td>{action.security_name}</td>
                          <td>{action.action_type}</td>
                          <td>
                            <span className={`badge bg-${action.status === 'Completed' ? 'success' : 
                              action.status === 'Pending' ? 'warning' : 
                              action.status === 'Upcoming' ? 'info' : 'secondary'}`}>
                              {action.status}
                            </span>
                          </td>
                          <td>{formatDate(action.due_date, 'short')}</td>
                        </tr>
                      ))
                    ) : (
                      // Show empty state if no data
                      <tr>
                        <td colSpan="4" className="text-center">No recent corporate actions available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Note: Customer Segments chart moved to Customer Metrics section */}

      {/* ASSETS UNDER CUSTODY SECTION */}
      <div className="section-header">
        <h2>Assets Under Custody</h2>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-3 col-sm-6">
          <MetricCard 
            title="Total AUC" 
            value={formatCurrency(assetsUnderCustody?.total || 0, 'USD', 2, true)} 
            icon="landmark"
            color="#007C75"
          />
        </div>
        <div className="col-md-9 col-sm-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>AUC History</h2>
              <DateRangeFilter onFilterChange={handleAucHistoryFilterChange} />
            </div>
            <div className="card-body">
              <Chart 
                type="line"
                data={aucHistoryData}
                height="150px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: false,
                      grace: "5%",
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value, 'USD', 0);
                        }
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return formatCurrency(context.raw, 'USD', 0);
                        }
                      }
                    },
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* AUC by Asset Class */}
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>AUC by Asset Class</h2>
            </div>
            <div className="card-body">
              <Chart 
                type="pie"
                data={aucByAssetClassData}
                height="300px"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value * 100) / total).toFixed(1);
                          return `${label}: ${formatCurrency(value, 'USD', 0)} (${percentage}%)`;
                        }
                      }
                    },
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h2>AUC Metrics</h2>
            </div>
            <div className="card-body">
              <div className="row gy-3">
                {assetsUnderCustody?.byAssetClass?.map((item, index) => (
                  <div className="col-md-6" key={index}>
                    <MetricCard 
                      title={`${item.label}`} 
                      value={formatCurrency(item.value, 'USD', 2, true)} 
                      subtitle={`${((item.value / assetsUnderCustody.total) * 100).toFixed(1)}% of total`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note: Corporate Actions section moved to dedicated CorporateActions page */}

      {/* Note: Trading Analytics moved to Operations Overview */}

      {/* REVENUE ANALYSIS SECTION */}
      <div className="section-header">
        <h2>Revenue Analysis</h2>
      </div>
      
      <div className="row g-3 mb-4 equal-height">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Income by Service</h2>
              <DateRangeFilter onFilterChange={handleIncomeHistoryFilterChange} />
            </div>
            <div className="card-body">
              {filteredIncomeHistory.length > 0 && filteredIncomeHistory[0].services ? (
                <Chart 
                  type="bar"
                  data={{
                    labels: filteredIncomeHistory[0].services.map(service => service.name),
                    datasets: [
                      {
                        label: 'Income',
                        data: filteredIncomeHistory[0].services.map(service => service.value),
                        backgroundColor: [
                          '#007C75', '#009E94', '#00BFB3', '#00D6C9', '#00EDDE'
                        ],
                        borderColor: [
                          '#007C75', '#009E94', '#00BFB3', '#00D6C9', '#00EDDE'
                        ],
                        borderWidth: 1
                      }
                    ]
                  }}
                  height="300px"
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return formatCurrency(value, 'USD', 0);
                          }
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return formatCurrency(context.raw, 'USD', 0);
                          }
                        }
                      }
                    },
                    barPercentage: 0.7,
                    categoryPercentage: 0.9
                  }}
                />
              ) : (
                <div className="alert alert-info">No income data available for the selected period</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-header">
              <h2>Top Customers by Revenue</h2>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Revenue (12 months)</th>
                      <th>Change (YoY)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.topCustomers ? (
                      data.topCustomers.map((customer, index) => (
                        <tr key={index}>
                          <td>{customer.name}</td>
                          <td>{formatCurrency(customer.revenue, 'USD', 0)}</td>
                          <td className={`text-${customer.change >= 0 ? 'success' : 'danger'}`}>
                            {formatPercentage(customer.change / 100, 1)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      // Default rows if no data available
                      [
                        { name: 'BlackRock', revenue: 1250000, change: 5.2 },
                        { name: 'Vanguard', revenue: 980000, change: 3.8 },
                        { name: 'State Street', revenue: 850000, change: -1.2 },
                        { name: 'Fidelity', revenue: 720000, change: 2.6 },
                        { name: 'JPMorgan', revenue: 680000, change: 4.1 }
                      ].map((customer, index) => (
                        <tr key={index}>
                          <td>{customer.name}</td>
                          <td>{formatCurrency(customer.revenue, 'USD', 0)}</td>
                          <td className={`text-${customer.change >= 0 ? 'success' : 'danger'}`}>
                            {formatPercentage(customer.change / 100, 1)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Note: Corporate Actions details moved to Corporate Actions section */}
      
      {/* Note: Recent Trades section moved to dedicated Trades page */}
    </div>
  );
};

export default OperationsHeadDashboard;