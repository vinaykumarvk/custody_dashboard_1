/**
 * API service for fetching data from the backend
 */

import { mockApiCall } from '../utils';

// API base URL - use a fixed base URL for now
// In production, this could be configured through environment variables
const API_BASE_URL = 'http://localhost:3000/api';

// API status cache to avoid repeated failed calls
let apiStatus = {
  isConnected: null,
  lastCheck: null,
  checkInterval: 30000 // 30 seconds
};

/**
 * Checks if the API is currently available
 * @returns {Promise<boolean>} - Promise that resolves to true if API is available
 */
export const checkApiHealth = async () => {
  const now = Date.now();
  
  // If we have a recent check result, use that instead of making a new request
  if (apiStatus.lastCheck && (now - apiStatus.lastCheck < apiStatus.checkInterval)) {
    return apiStatus.isConnected;
  }
  
  // Otherwise, make a new health check request
  try {
    const response = await fetch(`${API_BASE_URL}/health?v=${now}`);
    apiStatus.isConnected = response.ok;
    apiStatus.lastCheck = now;
    return apiStatus.isConnected;
  } catch (error) {
    console.warn('API health check failed:', error);
    apiStatus.isConnected = false;
    apiStatus.lastCheck = now;
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
 * Fetches data from the API with fallbacks
 * @param {string} resourceType - Type of resource to fetch (e.g., 'dashboard')
 * @returns {Promise<Object>} - Promise that resolves to the API data
 */
export const fetchData = async (resourceType) => {
  if (!API_ENDPOINTS[resourceType]) {
    throw new Error(`Unknown resource type: ${resourceType}`);
  }

  // Check if API is available first
  const isApiAvailable = await checkApiHealth();
  
  // If API is offline, go straight to mock data
  if (!isApiAvailable) {
    console.log(`API appears offline, using mock data for ${resourceType}`);
    return await mockApiCall(resourceType);
  }
  
  const endpoint = `${API_BASE_URL}${API_ENDPOINTS[resourceType]}`;
  
  try {
    const response = await fetch(`${endpoint}?v=${Date.now()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`API endpoint failed:`, endpoint, error);
    
    // If API call fails, fall back to mock data
    try {
      console.log(`Falling back to mock data for ${resourceType}`);
      return await mockApiCall(resourceType);
    } catch (mockError) {
      console.error(`Mock API also failed:`, mockError);
      throw new Error(`Error fetching ${resourceType} data: API call failed`);
    }
  }
};

/**
 * Marks a notification as read
 * @param {number} id - Notification ID to mark as read
 * @returns {Promise<Object>} - Promise that resolves to the API response
 */
export const markNotificationAsRead = async (id) => {
  const endpoint = `${API_BASE_URL}/notifications/${id}/read`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to mark notification as read:`, error);
    throw error;
  }
};

/**
 * Marks all notifications as read
 * @returns {Promise<Object>} - Promise that resolves to the API response
 */
export const markAllNotificationsAsRead = async () => {
  const endpoint = `${API_BASE_URL}/notifications/read/all`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to mark all notifications as read:`, error);
    throw error;
  }
};