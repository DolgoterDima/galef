// ============================================
// Mobile Menu Module
// ============================================

export function initMobileMenu() {
  const burger = document.querySelector('[data-burger]');
  const menu = document.querySelector('[data-mobile-menu]');
  const close = document.querySelector('[data-mobile-menu-close]');
  const overlay = document.querySelector('[data-mobile-menu-overlay]');
  
  if (!burger || !menu) return;
  
  const open = () => {
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  
  const closeMenu = () => {
    menu.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  
  burger.addEventListener('click', open);
  close?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
  
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}
