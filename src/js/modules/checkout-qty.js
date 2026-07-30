export function initCheckoutQty() {
  const closeCartMenus = (except = null) => {
    document.querySelectorAll('.checkout__cart-actions.is-open').forEach(actions => {
      if (actions === except) return;

      actions.classList.remove('is-open');
      actions.querySelector('.checkout__cart-dots')?.setAttribute('aria-expanded', 'false');
    });
  };

  document.addEventListener('click', (e) => {
    const dotsBtn = e.target.closest('.checkout__cart-dots');
    if (dotsBtn) {
      const actions = dotsBtn.closest('.checkout__cart-actions');
      if (!actions) return;

      const shouldOpen = !actions.classList.contains('is-open');
      closeCartMenus(actions);
      actions.classList.toggle('is-open', shouldOpen);
      dotsBtn.setAttribute('aria-expanded', String(shouldOpen));
      return;
    }

    const menuItem = e.target.closest('.checkout__cart-menu-item');
    if (menuItem) {
      closeCartMenus();
      return;
    }

    if (!e.target.closest('.checkout__cart-actions')) {
      closeCartMenus();
    }

    const btn = e.target.closest('.checkout__qty-btn');
    if (!btn) return;

    const item = btn.closest('.checkout__cart-item');
    if (!item) return;

    const input = item.querySelector('.checkout__qty-input');
    if (!input) return;

    const current = parseInt(input.value, 10) || 1;

    if (btn.dataset.action === 'increase') {
      input.value = current + 1;
    } else if (current > 1) {
      input.value = current - 1;
    }

    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  document.addEventListener('input', (e) => {
    const input = e.target.closest('.checkout__qty-input');
    if (!input) return;

    input.value = input.value.replace(/\D/g, '');

    if (input.value === '' || parseInt(input.value, 10) < 1) {
      input.value = 1;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    closeCartMenus();
  });
}
