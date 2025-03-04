/**
 * Angular Monitor Utility
 * This script helps identify and monitor Angular components that might be loading.
 */

// Observer function to watch for Angular elements
function watchForAngularElements() {
  console.log('Angular Monitor: Starting observation');
  
  // Create a MutationObserver to monitor DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check for Angular attributes
            if (
              node.hasAttribute('ng-app') || 
              node.hasAttribute('ng-controller') || 
              node.hasAttribute('ng-view') ||
              node.hasAttribute('ng-repeat') ||
              node.className && node.className.includes('ng-')
            ) {
              console.warn('Angular Monitor: Detected Angular element:', node);
              console.warn('Angular Monitor: Element HTML:', node.outerHTML);
              
              // Optional: remove the element
              // node.remove();
            }
            
            // Check children recursively
            const angularElements = node.querySelectorAll('[ng-app], [ng-controller], [ng-view], [ng-repeat], [class*="ng-"]');
            if (angularElements.length > 0) {
              console.warn('Angular Monitor: Detected Angular elements within added node:', angularElements);
              angularElements.forEach(el => {
                console.warn('Angular Monitor: Child element HTML:', el.outerHTML);
              });
            }
          }
        });
      }
    });
  });
  
  // Start observing the entire document
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['ng-app', 'ng-controller', 'ng-view', 'ng-repeat', 'class']
  });
  
  return observer;
}

// Check for existing Angular elements
function checkExistingAngularElements() {
  const angularElements = document.querySelectorAll('[ng-app], [ng-controller], [ng-view], [ng-repeat], [class*="ng-"]');
  
  if (angularElements.length > 0) {
    console.warn('Angular Monitor: Found existing Angular elements:', angularElements);
    
    angularElements.forEach(el => {
      console.warn('Angular Monitor: Element HTML:', el.outerHTML);
      
      // Optional: remove the element
      // el.remove();
    });
  } else {
    console.log('Angular Monitor: No existing Angular elements found');
  }
}

// Check for Angular in window object
function checkAngularObject() {
  if (window.angular) {
    console.warn('Angular Monitor: Found window.angular object:', window.angular);
    
    // Log Angular version if available
    if (window.angular.version) {
      console.warn('Angular Monitor: Angular version:', window.angular.version.full);
    }
    
    // Optional: disable Angular
    // window.angular = null;
  } else {
    console.log('Angular Monitor: No window.angular object found');
  }
}

// Initialize the monitor
export function initAngularMonitor() {
  console.log('Angular Monitor: Initializing');
  
  // Run initial checks
  checkExistingAngularElements();
  checkAngularObject();
  
  // Start the observer
  const observer = watchForAngularElements();
  
  // Return the observer for later cleanup if needed
  return observer;
}

// Export the individual functions for direct usage
export {
  checkExistingAngularElements,
  checkAngularObject,
  watchForAngularElements
};