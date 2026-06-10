// ============================================
// Mobile Menu Module
// ============================================

export function initMobileMenu() {
  const burger = document.querySelector('[data-burger]');
  const menu = document.querySelector('[data-mobile-menu]');
  const closeBtns = document.querySelectorAll('[data-mobile-menu-close]');
  const overlay = document.querySelector('[data-mobile-menu-overlay]');
  
  if (!burger || !menu) return;
  
  const panels = menu.querySelectorAll('[data-mobile-panel]');
  const targets = menu.querySelectorAll('[data-mobile-target]');
  const backs = menu.querySelectorAll('[data-mobile-back]');

  const open = () => {
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  
  const closeMenu = () => {
    menu.classList.remove('is-open');
    document.body.style.overflow = '';
    
    // Reset panels after animation
    setTimeout(() => {
      panels.forEach(p => p.classList.remove('is-active', 'is-left'));
      const mainPanel = menu.querySelector('[data-mobile-panel="main"]');
      if (mainPanel) mainPanel.classList.add('is-active');
    }, 400);
  };
  
  burger.addEventListener('click', open);
  closeBtns.forEach(btn => btn.addEventListener('click', closeMenu));
  overlay?.addEventListener('click', closeMenu);
  
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Panel navigation
  targets.forEach(t => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = t.dataset.mobileTarget;
      const targetPanel = menu.querySelector(`[data-mobile-panel="${targetId}"]`);
      const currentPanel = t.closest('[data-mobile-panel]');
      
      if (targetPanel && currentPanel) {
        currentPanel.classList.remove('is-active');
        currentPanel.classList.add('is-left');
        targetPanel.classList.add('is-active');
      }
    });
  });

  backs.forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = b.dataset.mobileBack || 'main';
      const targetPanel = menu.querySelector(`[data-mobile-panel="${targetId}"]`);
      const currentPanel = b.closest('[data-mobile-panel]');
      
      if (targetPanel && currentPanel) {
        currentPanel.classList.remove('is-active');
        targetPanel.classList.remove('is-left');
        targetPanel.classList.add('is-active');
      }
    });
  });
}
