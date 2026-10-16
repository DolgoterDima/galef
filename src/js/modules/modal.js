// ============================================
// Modal Module
// ============================================

const CUSTOMER_STORAGE_KEY = 'galefCustomer';

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
      const openModal = document.querySelector('[data-modal].modal--open');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });

  initAuthValidation();
}

function openModal(modal) {
  document.querySelectorAll('[data-modal].modal--open').forEach(openedModal => {
    if (openedModal !== modal) {
      openedModal.classList.remove('modal--open');
      resetAuthForms(openedModal);
    }
  });

  modal.classList.add('modal--open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('modal--open');
  resetAuthForms(modal);
  document.body.style.overflow = '';
}

function initAuthValidation() {
  document.querySelectorAll('[data-auth-form]').forEach(form => {
    const inputs = Array.from(form.querySelectorAll('[data-auth-validate]'));

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateAuthInput(input, form);

        if (input.name === 'password') {
          const confirmInput = form.querySelector('[data-auth-validate="password-confirm"]');

          if (confirmInput && confirmInput.value) {
            validateAuthInput(confirmInput, form);
          }
        }
      });

      input.addEventListener('blur', () => {
        if (input.value.trim()) {
          validateAuthInput(input, form);
        }
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      let isFormValid = true;

      inputs.forEach(input => {
        isFormValid = validateAuthInput(input, form) && isFormValid;
      });

      if (isFormValid) {
        const customer = createAuthenticatedCustomer(form);

        persistCustomer(customer);
        form.reset();
        resetAuthForm(form);

        const modal = form.closest('[data-modal]');
        if (modal) {
          closeModal(modal);
        }
      }
    });
  });
}

function readStoredCustomer() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_STORAGE_KEY));
  } catch (error) {
    return null;
  }
}

function createAuthenticatedCustomer(form) {
  const nameInput = form.querySelector('input[name="name"]');
  const storedCustomer = readStoredCustomer();
  const name = nameInput?.value.trim() || storedCustomer?.name || 'Користувач';

  return {
    isAuthenticated: true,
    name,
  };
}

function persistCustomer(customer) {
  window.galefCustomer = customer;
  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  window.dispatchEvent(new CustomEvent('galef:auth-changed', { detail: { customer } }));
}

function validateAuthInput(input, form) {
  const value = input.value.trim();
  const type = input.getAttribute('data-auth-validate');
  const passwordInput = form.querySelector('[data-auth-validate="password"]');
  const phoneValue = value.replace(/[\s()-]/g, '');
  const phoneRegex = /^(\+380\d{9}|0\d{9})$/;
  let isValid = false;

  if (type === 'name') {
    isValid = value.length >= 2;
  } else if (type === 'phone') {
    isValid = phoneRegex.test(phoneValue);
  } else if (type === 'password') {
    isValid = value.length >= 6;
  } else if (type === 'password-confirm') {
    isValid = value.length >= 6 && passwordInput && value === passwordInput.value.trim();
  }

  input.classList.toggle('is-valid', isValid);
  input.classList.toggle('is-invalid', !isValid);

  return isValid;
}

function resetAuthForms(scope = document) {
  scope.querySelectorAll('[data-auth-form]').forEach(resetAuthForm);
}

function resetAuthForm(form) {
  form.querySelectorAll('[data-auth-validate]').forEach(input => {
    input.classList.remove('is-valid', 'is-invalid');

    if (input.name && input.name.includes('password')) {
      input.type = 'password';
    }
  });

  form.querySelectorAll('.js-password-toggle use').forEach(icon => {
    icon.setAttribute('href', '#icon-eye');
  });
}

// Export for programmatic use
export { openModal, closeModal };
