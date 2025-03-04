/**
 * Clear Browser Cache and Storage Script
 * Use this to reset any cached Angular resources
 */

function clearAppCache() {
  console.log('Attempting to clear app cache and storage...');
  
  // Clear localStorage
  try {
    window.localStorage.clear();
    console.log('LocalStorage cleared');
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
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    console.log('Cookies cleared');
  } catch (e) {
    console.error('Failed to clear cookies:', e);
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
  
  // Request reload
  setTimeout(() => {
    console.log('Reloading page...');
    window.location.reload(true); // Force reload from server
  }, 1000);
  
  return 'Cache clearing initiated. Page will reload shortly.';
}

// Make function accessible globally
window.clearAppCache = clearAppCache;

// Notify that the script is loaded
console.log('Cache clearing utility loaded. Call window.clearAppCache() to use.');