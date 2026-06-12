// ============================================
// Main JavaScript Entry
// ============================================
import 'virtual:svg-icons-register';
import '../scss/main.scss';

// Import modules
import { initMobileMenu } from './modules/mobile-menu.js';
import { initAccordions } from './modules/accordion.js';
import { initModals } from './modules/modal.js';

import { initHeroSlider } from './modules/hero-slider.js';
import { initProductSlider } from './modules/product-slider.js';

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAccordions();
  initModals();
  initHeroSlider();
  initProductSlider();

  console.log('Golef site initialized');
});

// change lang
const selector = document.querySelector('.lang-selector');
const trigger = selector.querySelector('.lang-selector__trigger');

selector.addEventListener('click', (event) => {
  const clickedItem = event.target.closest('.lang-selector__item');

  if (clickedItem) {
    selector.querySelector('.lang-selector__item--active')?.classList.remove('lang-selector__item--active');
    clickedItem.classList.add('lang-selector__item--active');

    trigger.firstChild.textContent = clickedItem.textContent;
    selector.removeAttribute('open');
  }
});

// Filter logic
document.addEventListener('click', (event) => {
  const filterHeader = event.target.closest('.filter__header');
  
  if (filterHeader) {
    const filter = filterHeader.closest('.filter');
    const isExpanded = filterHeader.getAttribute('aria-expanded') === 'true';
    
    // Close other filters
    document.querySelectorAll('.filter--open').forEach(openFilter => {
      if (openFilter !== filter) {
        openFilter.classList.remove('filter--open');
        openFilter.querySelector('.filter__header')?.setAttribute('aria-expanded', 'false');
      }
    });

    filterHeader.setAttribute('aria-expanded', !isExpanded);
    filter.classList.toggle('filter--open', !isExpanded);
  } else {
    // Close filter dropdown if clicking outside
    if (!event.target.closest('.filter')) {
      document.querySelectorAll('.filter--open').forEach(openFilter => {
        openFilter.classList.remove('filter--open');
        openFilter.querySelector('.filter__header')?.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // Sort dropdown logic
  if (!event.target.closest('.sort-dropdown')) {
    document.querySelectorAll('.sort-dropdown[open]').forEach(dropdown => {
      dropdown.removeAttribute('open');
    });
  }

  const sortItem = event.target.closest('.sort-dropdown__item');
  if (sortItem) {
    const dropdown = sortItem.closest('.sort-dropdown');
    dropdown.querySelector('.sort-dropdown__item--active')?.classList.remove('sort-dropdown__item--active');
    sortItem.classList.add('sort-dropdown__item--active');
    dropdown.removeAttribute('open');
  }

  // Password toggle logic
  const toggleBtn = event.target.closest('.js-password-toggle');
  if (toggleBtn) {
    const input = toggleBtn.closest('.input__inner').querySelector('.input__field');
    const useTag = toggleBtn.querySelector('use');
    
    if (input.type === 'password') {
      input.type = 'text';
      useTag.setAttribute('href', '#icon-eye-cross');
    } else {
      input.type = 'password';
      useTag.setAttribute('href', '#icon-eye');
    }
  }

  // Search overlay logic
  const searchOpenBtn = event.target.closest('.js-search-open');
  if (searchOpenBtn) {
    const searchOverlay = document.getElementById('search-overlay');
    if (searchOverlay) {
      searchOverlay.classList.add('search-overlay--active');
      setTimeout(() => searchOverlay.querySelector('input')?.focus(), 100);
    }
  }

  const searchCloseBtn = event.target.closest('#search-close');
  if (searchCloseBtn) {
    const searchOverlay = document.getElementById('search-overlay');
    if (searchOverlay) {
      searchOverlay.classList.remove('search-overlay--active');
    }
  }
});
