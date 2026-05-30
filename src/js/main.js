// ============================================
// Main JavaScript Entry
// ============================================
import 'virtual:svg-icons-register';
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
});
