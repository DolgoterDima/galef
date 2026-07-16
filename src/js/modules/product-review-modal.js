// ============================================
// PRODUCT REVIEW MODAL MODULE
// ============================================

export function initProductReviewModal() {
  const modal = document.querySelector('[data-modal="add-review"]');
  if (!modal) return;

  const form = modal.querySelector('#add-review-form');
  const ratingStarsContainer = modal.querySelector('#rating-stars');
  const starButtons = ratingStarsContainer ? ratingStarsContainer.querySelectorAll('.review-modal__star-btn') : [];
  const ratingValueInput = modal.querySelector('#review-rating-value');
  const ratingLabel = modal.querySelector('.review-modal__rating-label');
  
  const commentInput = modal.querySelector('#review-comment');
  const authorInput = modal.querySelector('#review-author');
  const emailInput = modal.querySelector('#review-email');
  
  const fileInput = modal.querySelector('#review-photo');
  const photoLabel = modal.querySelector('#photo-label');
  const videoInput = modal.querySelector('#review-video-url');
  const addVideoBtn = modal.querySelector('#add-video-btn');
  
  const cancelBtn = modal.querySelector('.review-modal__btn--cancel');

  let currentRating = 0;

  // --------------------------------------------
  // Star Rating Interaction
  // --------------------------------------------
  if (ratingStarsContainer) {
    starButtons.forEach((btn, index) => {
      // Hover In
      btn.addEventListener('mouseenter', () => {
        highlightStars(index, 'is-hovered');
      });

      // Hover Out
      btn.addEventListener('mouseleave', () => {
        starButtons.forEach(b => b.classList.remove('is-hovered'));
      });

      // Click / Selection
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        currentRating = index + 1;
        ratingValueInput.value = currentRating;
        
        // Remove error states if rating was missing
        ratingLabel.style.color = '';
        ratingLabel.textContent = "Постав п'ять зірочок 😍";

        updateActiveStars();
      });
    });
  }

  function highlightStars(uptoIndex, className) {
    starButtons.forEach((btn, i) => {
      if (i <= uptoIndex) {
        btn.classList.add(className);
      } else {
        btn.classList.remove(className);
      }
    });
  }

  function updateActiveStars() {
    highlightStars(currentRating - 1, 'is-active');
  }

  // --------------------------------------------
  // Input Validation Helper Functions
  // --------------------------------------------
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateInput(input, condition) {
    if (condition) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return false;
    }
  }

  // Real-time validation on input/blur
  if (authorInput) {
    authorInput.addEventListener('input', () => {
      validateInput(authorInput, authorInput.value.trim().length >= 2);
    });
    authorInput.addEventListener('blur', () => {
      validateInput(authorInput, authorInput.value.trim().length >= 2);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      validateInput(emailInput, emailRegex.test(emailInput.value.trim()));
    });
    emailInput.addEventListener('blur', () => {
      validateInput(emailInput, emailRegex.test(emailInput.value.trim()));
    });
  }

  if (commentInput) {
    commentInput.addEventListener('input', () => {
      validateInput(commentInput, commentInput.value.trim().length > 0);
    });
    commentInput.addEventListener('blur', () => {
      validateInput(commentInput, commentInput.value.trim().length > 0);
    });
  }

  // --------------------------------------------
  // File Upload Handling
  // --------------------------------------------
  if (fileInput && photoLabel) {
    const originalText = photoLabel.textContent;
    
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileSizeMB = file.size / (1024 * 1024);

        if (fileSizeMB > 5) {
          // File size error
          photoLabel.textContent = "Помилка: файл перевищує 5МБ!";
          photoLabel.classList.remove('review-modal__attachment-box-text--selected');
          photoLabel.style.color = '#FF2630';
          fileInput.value = ''; // Reset file input
        } else {
          // Valid file
          photoLabel.textContent = `Вибрано: ${file.name}`;
          photoLabel.classList.add('review-modal__attachment-box-text--selected');
          photoLabel.style.color = '';
        }
      } else {
        // Reset to original
        photoLabel.textContent = originalText;
        photoLabel.classList.remove('review-modal__attachment-box-text--selected');
        photoLabel.style.color = '';
      }
    });
  }

  // --------------------------------------------
  // Video URL Validation
  // --------------------------------------------
  if (addVideoBtn && videoInput) {
    addVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = videoInput.value.trim();
      
      if (url === "") {
        alert("Будь ласка, введіть посилання на відео.");
        return;
      }

      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
          // Valid URL format
          videoInput.style.borderColor = '#007D56';
          addVideoBtn.textContent = "Додано!";
          addVideoBtn.style.backgroundColor = '#007D56';
          addVideoBtn.style.borderColor = '#007D56';
          
          setTimeout(() => {
            addVideoBtn.textContent = "Додати відео";
            addVideoBtn.style.backgroundColor = '';
            addVideoBtn.style.borderColor = '';
            videoInput.style.borderColor = '';
          }, 3000);
        } else {
          throw new Error("Невірний протокол");
        }
      } catch (err) {
        // Invalid URL format
        videoInput.style.borderColor = '#FF2630';
        alert("Невірний формат посилання. Будь ласка, введіть дійсний URL.");
      }
    });
  }

  // --------------------------------------------
  // Submit Form Handling
  // --------------------------------------------
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isCommentValid = validateInput(commentInput, commentInput.value.trim().length > 0);
      const isAuthorValid = validateInput(authorInput, authorInput.value.trim().length >= 2);
      const isEmailValid = validateInput(emailInput, emailRegex.test(emailInput.value.trim()));

      if (isCommentValid && isAuthorValid && isEmailValid) {
        // Mock successful form submission
        alert("Дякуємо! Ваш відгук надіслано на модерацію.");
        
        // Reset form & states
        resetFormState();
        
        // Programmatically close the modal (assuming closer exists)
        const closeBtn = modal.querySelector('[data-modal-close]');
        if (closeBtn) closeBtn.click();
      }
    });
  }

  // --------------------------------------------
  // Reset Form State
  // --------------------------------------------
  function resetFormState() {
    if (form) form.reset();
    
    currentRating = 0;
    if (ratingValueInput) ratingValueInput.value = 0;
    if (ratingLabel) {
      ratingLabel.style.color = '';
      ratingLabel.textContent = "Постав п'ять зірочок 😍";
    }

    starButtons.forEach(btn => {
      btn.classList.remove('is-active');
      btn.classList.remove('is-hovered');
    });

    [commentInput, authorInput, emailInput].forEach(input => {
      if (input) {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
      }
    });

    if (photoLabel) {
      photoLabel.textContent = "Додати фото, формат: .jpg, .gif, .png Розмір файлу до 5МБ";
      photoLabel.classList.remove('review-modal__attachment-box-text--selected');
      photoLabel.style.color = '';
    }

    if (videoInput) {
      videoInput.style.borderColor = '';
      videoInput.value = '';
    }
  }

  // Hook reset when clicking cancel or closing modal
  if (cancelBtn) {
    cancelBtn.addEventListener('click', resetFormState);
  }

  // Modal close buttons (including backdrop overlay clicks or close button)
  const closers = modal.querySelectorAll('[data-modal-close]');
  closers.forEach(closer => {
    closer.addEventListener('click', () => {
      resetFormState();
    });
  });

  // --------------------------------------------
  // Reply Comment Modal Initialization
  // --------------------------------------------
  const replyModal = document.querySelector('[data-modal="reply-comment"]');
  if (replyModal) {
    const replyForm = replyModal.querySelector('#reply-comment-form');
    const replyCommentInput = replyModal.querySelector('#reply-comment-text');
    const replyAuthorInput = replyModal.querySelector('#reply-author');
    const replyEmailInput = replyModal.querySelector('#reply-email');
    const replyCancelBtn = replyModal.querySelector('.review-modal__btn--cancel');

    // Real-time validation on input/blur
    if (replyAuthorInput) {
      replyAuthorInput.addEventListener('input', () => {
        validateInput(replyAuthorInput, replyAuthorInput.value.trim().length >= 2);
      });
      replyAuthorInput.addEventListener('blur', () => {
        validateInput(replyAuthorInput, replyAuthorInput.value.trim().length >= 2);
      });
    }

    if (replyEmailInput) {
      replyEmailInput.addEventListener('input', () => {
        validateInput(replyEmailInput, emailRegex.test(replyEmailInput.value.trim()));
      });
      replyEmailInput.addEventListener('blur', () => {
        validateInput(replyEmailInput, emailRegex.test(replyEmailInput.value.trim()));
      });
    }

    if (replyCommentInput) {
      replyCommentInput.addEventListener('input', () => {
        validateInput(replyCommentInput, replyCommentInput.value.trim().length > 0);
      });
      replyCommentInput.addEventListener('blur', () => {
        validateInput(replyCommentInput, replyCommentInput.value.trim().length > 0);
      });
    }

    // Submit handler
    if (replyForm) {
      replyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isCommentValid = validateInput(replyCommentInput, replyCommentInput.value.trim().length > 0);
        const isAuthorValid = validateInput(replyAuthorInput, replyAuthorInput.value.trim().length >= 2);
        const isEmailValid = validateInput(replyEmailInput, emailRegex.test(replyEmailInput.value.trim()));

        if (isCommentValid && isAuthorValid && isEmailValid) {
          alert("Дякуємо! Вашу відповідь надіслано на модерацію.");
          resetReplyFormState();
          
          const closeBtn = replyModal.querySelector('[data-modal-close]');
          if (closeBtn) closeBtn.click();
        }
      });
    }

    function resetReplyFormState() {
      if (replyForm) replyForm.reset();
      [replyCommentInput, replyAuthorInput, replyEmailInput].forEach(input => {
        if (input) {
          input.classList.remove('is-invalid');
          input.classList.remove('is-valid');
        }
      });
    }

    if (replyCancelBtn) {
      replyCancelBtn.addEventListener('click', resetReplyFormState);
    }

    const replyClosers = replyModal.querySelectorAll('[data-modal-close]');
    replyClosers.forEach(closer => {
      closer.addEventListener('click', () => {
        resetReplyFormState();
      });
    });
  }
}
