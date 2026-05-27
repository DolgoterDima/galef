// ============================================
// Accordion Module
// ============================================

export function initAccordions() {
  const accordions = document.querySelectorAll('[data-accordion]');
  
  accordions.forEach(accordion => {
    const trigger = accordion.querySelector('[data-accordion-trigger]');
    const content = accordion.querySelector('[data-accordion-content]');
    
    if (!trigger || !content) return;
    
    trigger.addEventListener('click', () => {
      const isOpen = accordion.classList.contains('is-open');
      
      // Close all accordions in the same group
      const group = accordion.closest('[data-accordion-group]');
      if (group) {
        group.querySelectorAll('[data-accordion]').forEach(item => {
          item.classList.remove('is-open');
        });
      }
      
      // Toggle current
      if (!isOpen) {
        accordion.classList.add('is-open');
      }
    });
  });
}
