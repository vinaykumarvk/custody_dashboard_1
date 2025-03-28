/**
 * API service for fetching data from the backend
 */

// API base URL - use webpack proxy for API calls
// This eliminates CORS issues by forwarding all /api requests through webpack proxy
// The proxy configuration in webpack.config.js handles the forwarding to localhost:3000

// Use relative URL to leverage webpack proxy (defined in webpack.config.js)
const API_BASE_URL = '/api';

// API status cache to avoid repeated failed calls
let apiStatus = {
  isConnected: null,
  lastCheck: null,
  checkInterval: 30000 // 30 seconds
};

/**
 * Checks if the API is currently available
 * @param {boolean} debug - If true, forces a check and logs detailed results
 * @returns {Promise<boolean>} - Promise that resolves to true if API is available
 */
export const checkApiHealth = async (debug = false) => {
  const now = Date.now();
  
  // If we have a recent check result and debug mode is not enabled, use cached result
  if (!debug && apiStatus.lastCheck && (now - apiStatus.lastCheck < apiStatus.checkInterval)) {
    return apiStatus.isConnected;
  }
  
  // Otherwise, make a new health check request
  try {
    console.log(`Checking API health: ${API_BASE_URL}/health`);
    
    const response = await fetch(`${API_BASE_URL}/health?v=${now}`);
    const data = await response.json();
    
    apiStatus.isConnected = response.ok && data.status === 'healthy';
    apiStatus.lastCheck = now;
    
    if (debug || apiStatus.isConnected) {
      console.log(`API health check: ${apiStatus.isConnected ? 'CONNECTED ✅' : 'DISCONNECTED ❌'}`);
      console.log('API response:', data);
    }
    
    return apiStatus.isConnected;
  } catch (error) {
    console.warn('API health check failed:', error);
    apiStatus.isConnected = false;
    apiStatus.lastCheck = now;
    
    if (debug) {
      console.error('API health check error details:', {
        url: `${API_BASE_URL}/health`,
        error: error.message
      });
    }
    
    return false;
  }
};

// API endpoints mapping
const API_ENDPOINTS = {
  dashboard: '/dashboard',
  notifications: '/notifications',
  corporate_actions: '/corporate_actions',
  trades: '/trades',
  settlements: '/settlements',
  customers: '/customers',
  income: '/income',
  reports: '/reports',
  settings: '/settings'
};

/**
 * Fetches data from the API without fallbacks
 * @param {string} resourceType - Type of resource to fetch (e.g., 'dashboard')
 * @param {boolean} debug - If true, force a new API check and show debug logs
 * @returns {Promise<Object>} - Promise that resolves to the API data
 */
export const fetchData = async (resourceType, debug = false) => {
  if (!API_ENDPOINTS[resourceType]) {
    throw new Error(`Unknown resource type: ${resourceType}`);
  }

  // Check if API is available
  const isApiAvailable = await checkApiHealth(debug);
  
  if (!isApiAvailable) {
    throw new Error(`API is not available for ${resourceType}`);
  }
  
  console.log(`Fetching ${resourceType} from API`);
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS[resourceType]}`);
    
  if (!response.ok) {
    throw new Error(`API responded with status ${response.status}`);
  }
    
  const data = await response.json();
  if (debug) {
    console.log(`${resourceType} data loaded from API:`, data);
  }
  return data;
};

/**
 * Marks a notification as read
 * @param {number} id - Notification ID to mark as read
 * @returns {Promise<Object>} - Promise that resolves to the API response
 */
export const markNotificationAsRead = async (id) => {
  const isApiAvailable = await checkApiHealth();
  
  if (!isApiAvailable) {
    throw new Error('API is not available for marking notification as read');
  }
  
  console.log(`Marking notification ${id} as read via API`);
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    throw new Error(`API responded with status ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Marks all notifications as read
 * @returns {Promise<Object>} - Promise that resolves to the API response
 */
export const markAllNotificationsAsRead = async () => {
  const isApiAvailable = await checkApiHealth();
  
  if (!isApiAvailable) {
    throw new Error('API is not available for marking all notifications as read');
  }
  
  console.log(`Marking all notifications as read via API`);
  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    throw new Error(`API responded with status ${response.status}`);
  }
  
  return await response.json();
};