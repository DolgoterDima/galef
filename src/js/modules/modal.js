// ============================================
// Modal Module
// ============================================

export function initModals() {
  const triggers = document.querySelectorAll('[data-modal-open]');
  const closers = document.querySelectorAll('[data-modal-close]');
  
  // Open modal
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-open');
      const modal = document.querySelector(`[data-modal="${modalId}"]`);
      
      if (modal) {
        openModal(modal);
      }
    });
  });
  
  // Close modal with button
  closers.forEach(closer => {
    closer.addEventListener('click', () => {
      const modal = closer.closest('[data-modal]');
      if (modal) {
        closeModal(modal);
      }
    });
  });
  
  // Close on backdrop click
  document.querySelectorAll('[data-modal]').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
  
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('[data-modal].is-open');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

function openModal(modal) {
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

// Export for programmatic use
export { openModal, closeModal };
