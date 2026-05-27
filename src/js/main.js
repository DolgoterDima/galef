// ============================================
// Main JavaScript Entry
// ============================================

import '../scss/main.scss';

// Import modules
import { initMobileMenu } from './modules/mobile-menu.js';
import { initAccordions } from './modules/accordion.js';
import { initModals } from './modules/modal.js';

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAccordions();
  initModals();
  
  console.log('Golef site initialized');
});
