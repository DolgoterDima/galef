// ============================================
// Main JavaScript Entry
// ============================================
import 'virtual:svg-icons-register';
import '../scss/main.scss';

// Import modules
import { initPreloader } from './modules/preloader.js';
import { initMobileMenu } from './modules/mobile-menu.js';
import { initAccordions } from './modules/accordion.js';
import { initModals } from './modules/modal.js';
import { initCheckoutQty } from './modules/checkout-qty.js';

import { initHeroSlider } from './modules/hero-slider.js';
import { initProductSlider } from './modules/product-slider.js';
import { initProductGallery } from './modules/product-gallery.js';
import { initProductSpecifications } from './modules/product-specifications.js';
import { initProductReviews } from './modules/product-reviews.js';
import { initProductReviewModal } from './modules/product-review-modal.js';

// Initialize preloader as early as possible
initPreloader();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAccordions();
  initModals();
  initHeroSlider();
  initProductSlider();
  initProductGallery();
  initProductSpecifications();
  initProductReviews();
  initProductReviewModal();
  initCheckoutQty();

  // Initialize sort dropdowns trigger text with the active item
  document.querySelectorAll('.sort-dropdown').forEach(dropdown => {
    const activeItem = dropdown.querySelector('.sort-dropdown__item--active');
    const triggerText = dropdown.querySelector('.sort-dropdown__text');
    if (activeItem && triggerText) {
      triggerText.textContent = activeItem.textContent.trim();
    }
  });

  console.log('Galef site initialized');
});

// change lang
const langSelectors = document.querySelectorAll('.lang-selector');

langSelectors.forEach(selector => {
  const trigger = selector.querySelector('.lang-selector__trigger');
  const triggerText = selector.querySelector('.lang-selector__text');

  selector.addEventListener('click', (event) => {
    const clickedItem = event.target.closest('.lang-selector__item');

    if (clickedItem) {
      selector.querySelector('.lang-selector__item--active')?.classList.remove('lang-selector__item--active');
      clickedItem.classList.add('lang-selector__item--active');

      if (triggerText) {
        triggerText.textContent = clickedItem.textContent;
      } else {
        trigger.firstChild.textContent = clickedItem.textContent;
      }
      selector.removeAttribute('open');
    }
  });
});

// Filter logic
document.addEventListener('click', (event) => {
  const filterHeader = event.target.closest('.filter__header');
  
  if (filterHeader) {
    const filter = filterHeader.closest('.filter');
    const isExpanded = filterHeader.getAttribute('aria-expanded') === 'true';
    
    filterHeader.setAttribute('aria-expanded', !isExpanded);
    filter.classList.toggle('filter--open', !isExpanded);
  }

  // Sort dropdown logic
  if (!event.target.closest('.sort-dropdown')) {
    document.querySelectorAll('.sort-dropdown[open]').forEach(dropdown => {
      dropdown.removeAttribute('open');
    });
  }

  // Language selector click outside logic
  if (!event.target.closest('.lang-selector')) {
    document.querySelectorAll('.lang-selector[open]').forEach(selector => {
      selector.removeAttribute('open');
    });
  }

  const sortItem = event.target.closest('.sort-dropdown__item');
  if (sortItem) {
    const dropdown = sortItem.closest('.sort-dropdown');
    dropdown.querySelector('.sort-dropdown__item--active')?.classList.remove('sort-dropdown__item--active');
    sortItem.classList.add('sort-dropdown__item--active');
    
    // Update trigger text with the chosen option
    const triggerText = dropdown.querySelector('.sort-dropdown__text');
    if (triggerText) {
      triggerText.textContent = sortItem.textContent.trim();
    }
    
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

  // Catalog filter sidebar toggling logic
  const sidebar = document.querySelector('.js-catalog-sidebar');
  const filterOpenBtn = event.target.closest('.js-catalog-filter-open');
  
  if (sidebar) {
    if (filterOpenBtn) {
      sidebar.classList.toggle('page__sidebar--open');
    } else {
      const applyBtn = event.target.closest('.filter-group__footer .btn');
      const isOutside = !event.target.closest('.js-catalog-sidebar');
      if (applyBtn || isOutside) {
        sidebar.classList.remove('page__sidebar--open');
      }
    }
  }
});
