// ============================================
// Mobile Menu Module
// ============================================

export function initMobileMenu() {
  const burger = document.querySelector('[data-burger]');
  const menu = document.querySelector('[data-mobile-menu]');
  const closeBtns = document.querySelectorAll('[data-mobile-menu-close]');
  const overlay = document.querySelector('[data-mobile-menu-overlay]');
  
  if (!burger || !menu) return;
  
  const menuInner = menu.querySelector('.mobile-menu__inner');
  const mainPanel = menu.querySelector('[data-mobile-panel="main"]');
  if (!mainPanel || !menuInner) return;

  const headerTemplate = `
      <div class="mobile-menu__top">
          <button aria-label="Назад" class="icon-btn icon-btn--transparent mobile-menu__btn" data-mobile-back>
              <svg class="icon-btn__icon"><use href="#icon-chewron-left"></use></svg>
          </button>
          <div class="mobile-menu__actions">
              <a class="icon-btn mobile-menu__btn" href="/pages/checkout.html">
                  <svg class="icon-btn__icon"><use href="#icon-cart"></use></svg>
              </a>
              <details class="lang-selector mobile-menu__lang-wrapper">
                  <summary class="lang-selector__trigger">
                      UA
                      <svg class="lang-selector__arrow"><use href="#icon-chevron-down"></use></svg>
                  </summary>
                  <ul class="lang-selector__menu">
                      <li class="lang-selector__item lang-selector__item--active">UA</li>
                      <li class="lang-selector__item">EN</li>
                  </ul>
              </details>
              <button aria-label="Закрити" class="icon-btn mobile-menu__btn" data-mobile-menu-close>
                  <svg class="icon-btn__icon"><use href="#icon-x"></use></svg>
              </button>
          </div>
      </div>
  `;

  let panelCounter = 1;

  // Function to process nested lists and extract them into sibling panels
  const processNestedLists = (navElement) => {
    const items = navElement.querySelectorAll(':scope > div');
    items.forEach(item => {
      const link = item.querySelector(':scope > a');
      const subNav = item.querySelector(':scope > nav');

      if (link && subNav) {
        const panelId = `panel-${panelCounter++}`;
        
        // Add target and arrow to the link
        link.dataset.mobileTarget = panelId;
        link.innerHTML += `<svg class="mobile-menu__arrow"><use href="#icon-chewron-right"></use></svg>`;
        
        // Wrap the subNav in a new panel
        const newPanel = document.createElement('div');
        newPanel.className = 'mobile-menu__panel';
        newPanel.dataset.mobilePanel = panelId;
        
        // Insert the standard mobile header
        newPanel.innerHTML = headerTemplate;
        
        // Add classes to the subNav and append it
        subNav.classList.add('mobile-menu__nav');
        newPanel.appendChild(subNav);
        
        // Append the new panel to the inner container
        menuInner.appendChild(newPanel);
        
        // Process recursively
        processNestedLists(subNav);
      }
    });
  };

  // Start processing from the main nav
  const mainNav = mainPanel.querySelector('.mobile-menu__nav');
  if (mainNav) {
    processNestedLists(mainNav);
  }

  // After generating all panels dynamically, query elements
  const panels = menu.querySelectorAll('[data-mobile-panel]');
  const targets = menu.querySelectorAll('[data-mobile-target]');
  const backs = menu.querySelectorAll('[data-mobile-back]');
  // Also need to re-query close buttons because we generated new ones
  const allCloseBtns = menu.querySelectorAll('[data-mobile-menu-close]');

  let historyStack = ['main'];

  const open = () => {
    menu.classList.add('mobile-menu--open');
    document.body.style.overflow = 'hidden';
    historyStack = ['main']; // Reset stack on open
  };
  
  const closeMenu = () => {
    menu.classList.remove('mobile-menu--open');
    document.body.style.overflow = '';
    
    // Reset panels after animation
    setTimeout(() => {
      panels.forEach(p => p.classList.remove('mobile-menu__panel--active', 'mobile-menu__panel--left'));
      if (mainPanel) mainPanel.classList.add('mobile-menu__panel--active');
      historyStack = ['main']; // Reset stack
    }, 400);
  };
  
  burger.addEventListener('click', open);
  allCloseBtns.forEach(btn => btn.addEventListener('click', closeMenu));
  overlay?.addEventListener('click', closeMenu);
  
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('mobile-menu--open')) {
      closeMenu();
    }
  });

  // Panel navigation
  targets.forEach(t => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = t.dataset.mobileTarget;
      const targetPanel = menu.querySelector(`[data-mobile-panel="${targetId}"]`);
      const currentPanelId = historyStack[historyStack.length - 1];
      const currentPanel = menu.querySelector(`[data-mobile-panel="${currentPanelId}"]`);
      
      if (targetPanel && currentPanel) {
        currentPanel.classList.remove('mobile-menu__panel--active');
        currentPanel.classList.add('mobile-menu__panel--left');
        targetPanel.classList.add('mobile-menu__panel--active');
        historyStack.push(targetId);
      }
    });
  });

  backs.forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      if (historyStack.length <= 1) return; // Cannot go back from main

      const currentPanelId = historyStack.pop(); // Remove current
      const targetId = historyStack[historyStack.length - 1]; // Get previous

      const currentPanel = menu.querySelector(`[data-mobile-panel="${currentPanelId}"]`);
      const targetPanel = menu.querySelector(`[data-mobile-panel="${targetId}"]`);
      
      if (targetPanel && currentPanel) {
        currentPanel.classList.remove('mobile-menu__panel--active');
        targetPanel.classList.remove('mobile-menu__panel--left');
        targetPanel.classList.add('mobile-menu__panel--active');
      }
    });
  });
}
