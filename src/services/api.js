/**
 * API service for fetching data from the backend
 */

import { mockApiCall } from '../utils';

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

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