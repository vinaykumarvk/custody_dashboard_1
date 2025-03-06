/**
 * API service for fetching data from the backend
 */

import { mockApiCall } from '../utils';

// API endpoints with fallbacks
const API_ENDPOINTS = {
  dashboard: [
    'api/dashboard/index.json',
    'api/dashboard/index',
    'api/dashboard.json',
    'api/dashboard'
  ],
  corporate_actions: [
    'api/corporate_actions/index.json',
    'api/corporate_actions/index',
    'api/corporate_actions.json',
    'api/corporate_actions'
  ],
  trades: [
    'api/trades/index.json',
    'api/trades/index',
    'api/trades.json',
    'api/trades'
  ],
  settlements: [
    'api/settlements/index.json',
    'api/settlements/index',
    'api/settlements.json',
    'api/settlements'
  ],
  customers: [
    'api/customers/index.json',
    'api/customers/index',
    'api/customers.json',
    'api/customers'
  ],
  income: [
    'api/income/index.json',
    'api/income/index',
    'api/income.json',
    'api/income'
  ],
  reports: [
    'api/reports/index.json',
    'api/reports/index',
    'api/reports.json',
    'api/reports'
  ],
  settings: [
    'api/settings/index.json',
    'api/settings/index',
    'api/settings.json',
    'api/settings'
  ]
};

/**
 * Fetches data from the API with fallbacks
 * @param {string} resourceType - Type of resource to fetch (e.g., 'dashboard')
 * @returns {Promise<Object>} - Promise that resolves to the API data
 */
export const fetchData = async (resourceType) => {
  if (!API_ENDPOINTS[resourceType]) {
    throw new Error(`Unknown resource type: ${resourceType}`);
  }

  const paths = API_ENDPOINTS[resourceType];
  let lastError = null;

  // Try each path until one succeeds
  for (const path of paths) {
    try {
      // In development, we use the real fetch API
      // In production, you might want to use the mock API for testing
      const response = await fetch(`${path}?v=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn(`API path failed:`, path, error);
      lastError = error;
      // Continue to the next path
    }
  }

  // If we get here, all paths failed
  console.error(`All API paths failed for`, resourceType);
  
  // If all paths fail, fall back to mock data
  try {
    return await mockApiCall(resourceType);
  } catch (error) {
    console.error(`Mock API also failed:`, error);
    throw new Error(`Error fetching ${resourceType} data: All API paths failed`);
  }
};