/**
 * Enhanced Cache Clearing and Deployment Helper Script
 * Use this to reset cached application resources and fix deployment issues
 * 
 * This script helps resolve stale resource issues in both development and production environments
 */

function clearAppCache() {
  console.log('Attempting to clear app cache and storage...');
  
  // Set a flag for tracking progress
  window.cacheClearingInProgress = true;
  
  // Clear localStorage with authentication preservation
  try {
    // Preserve authentication if present
    const authToken = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userProfile = localStorage.getItem('user_profile');
    
    // Clear storage
    window.localStorage.clear();
    console.log('LocalStorage cleared');
    
    // Restore auth data if needed
    if (authToken) localStorage.setItem('auth_token', authToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    if (userProfile) localStorage.setItem('user_profile', userProfile);
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
  
  // Clear sessionStorage
  try {
    window.sessionStorage.clear();
    console.log('SessionStorage cleared');
  } catch (e) {
    console.error('Failed to clear sessionStorage:', e);
  }
  
  // Clear cookies
  try {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Skip auth-related cookies
      if (name.includes('auth') || name.includes('token') || name.includes('session')) {
        console.log(`Preserving cookie: ${name}`);
        continue;
      }
      
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    console.log('Cookies cleared');
  } catch (e) {
    console.error('Failed to clear cookies:', e);
  }
  
  // Attempt to clear cache storage
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName).then(() => {
          console.log(`Cache ${cacheName} cleared`);
        });
      });
    });
  }
  
  // Attempt to clear service workers
  if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
        console.log('Service worker unregistered');
      });
    });
  }
  
  // Request reload with cache bypass
  setTimeout(() => {
    console.log('Reloading page with cache bypass...');
    
    // Add timestamp to force fresh resources
    const timestamp = new Date().getTime();
    let url = window.location.href;
    
    // Clean existing timestamps or cache params
    url = url.replace(/([?&])(timestamp|t|cache|_)=\d+/g, '$1');
    
    // Add new timestamp
    url += (url.indexOf('?') === -1) ? `?timestamp=${timestamp}` : `&timestamp=${timestamp}`;
    
    window.location.href = url;
  }, 1500);
  
  return 'Cache clearing initiated. Page will reload shortly.';
}

/**
 * Detect and handle deployment environment differences
 */
function detectEnvironment() {
  // Check if in Replit deployment
  const isReplitDeploy = window.location.hostname.includes('.replit.app');
  const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.includes('.repl.co');
  
  console.log(`Environment: ${isReplitDeploy ? 'REPLIT DEPLOYMENT' : isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
  
  // Add environment class to body for CSS targeting
  document.body.classList.add(isReplitDeploy ? 'env-replit-deploy' : 
                            isDevelopment ? 'env-development' : 'env-production');
  
  // Auto-clear cache via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('clear_cache') || urlParams.has('clearcache')) {
    console.log('Auto cache clear triggered via URL parameter');
    clearAppCache();
  }
  
  // Return environment info
  return {
    isReplitDeploy,
    isDevelopment,
    isProduction: !isDevelopment && !isReplitDeploy
  };
}

// Make functions accessible globally
window.clearAppCache = clearAppCache;
window.detectEnvironment = detectEnvironment;

// Auto-run environment detection
document.addEventListener('DOMContentLoaded', function() {
  detectEnvironment();
  console.log('Cache and environment utilities loaded. Use window.clearAppCache() to manually clear cache.');
});