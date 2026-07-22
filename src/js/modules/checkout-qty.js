export function initCheckoutQty() {
  document.addEventListener('click', (e) => {
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
}
