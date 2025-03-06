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

  // In our development environment, we'll directly use mock data
  // This prevents unnecessary network requests that will fail
  try {
    // Convert resourceType to the equivalent mockData key if needed
    let mockDataType = resourceType;
    if (resourceType === 'corporate_actions') {
      mockDataType = 'corporateActions';
    }
    
    const data = await mockApiCall(resourceType);
    
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Empty mock data received');
    }
    
    return data;
  } catch (error) {
    console.error(`Mock API failed for ${resourceType}:`, error);
    
    // As a last resort, try the actual API paths
    const paths = API_ENDPOINTS[resourceType];
    let lastError = null;

    for (const path of paths) {
      try {
        const response = await fetch(`${path}?v=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.warn(`API path failed:`, path, error);
        lastError = error;
      }
    }
    
    throw new Error(`Error fetching ${resourceType} data: All methods failed`);
  }
};