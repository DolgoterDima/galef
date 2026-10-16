(function () {
  'use strict';

  var root = document.querySelector('.opencart-product-page');

  if (!root) {
    return;
  }

  function $(selector, context) {
    return (context || root).querySelector(selector);
  }

  function $all(selector, context) {
    return Array.prototype.slice.call(
      (context || root).querySelectorAll(selector)
    );
  }

  function getProductId() {
    var input = $('#product input[name="product_id"]');
    return input
      ? input.value
      : root.querySelector('.product-page').getAttribute('data-product-id');
  }

  function showAlert(type, message, mount) {
    var oldAlerts = $all('.galef-product-alert');
    oldAlerts.forEach(function (alert) {
      alert.remove();
    });

    var alert = document.createElement('div');
    alert.className =
      'alert alert-' + type + ' alert-dismissible galef-product-alert';
    alert.innerHTML =
      message +
      '<button type="button" class="close" aria-label="Close">&times;</button>';

    alert.querySelector('.close').addEventListener('click', function () {
      alert.remove();
    });

    var target = mount || $('.product-page__breadcrumbs') || root;
    target.insertAdjacentElement('afterend', alert);
    alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setButtonLoading(button, loading) {
    if (!button) {
      return;
    }

    if (loading) {
      button.dataset.originalHtml = button.innerHTML;
      button.disabled = true;
      button.textContent =
        button.getAttribute('data-loading-text') || 'Loading...';
      return;
    }

    if (button.dataset.originalHtml) {
      button.innerHTML = button.dataset.originalHtml;
      delete button.dataset.originalHtml;
    }

    button.disabled = false;
  }

  function clearFieldErrors() {
    $all('.text-danger').forEach(function (node) {
      node.remove();
    });
    $all('.has-error').forEach(function (node) {
      node.classList.remove('has-error');
    });
  }

  function showFieldError(field, message) {
    if (!field) {
      showAlert('danger', message);
      return;
    }

    var error = document.createElement('div');
    error.className = 'text-danger';
    error.textContent = message;
    field.insertAdjacentElement('afterend', error);

    var wrapper = field.closest(
      '.product-hero__option, .reviews-block__field, .product-hero__option-list'
    );
    if (wrapper) {
      wrapper.classList.add('has-error');
    }
  }

  function setSlide(main, thumbs, index, scrollThumb) {
    var wrapper = $('.swiper-wrapper', main);
    var slides = $all('.swiper-slide', main);

    if (!wrapper || !slides.length) {
      return 0;
    }

    var next = index;

    if (next < 0) {
      next = slides.length - 1;
    }

    if (next >= slides.length) {
      next = 0;
    }

    wrapper.style.transform = 'translate3d(' + -next * 100 + '%, 0, 0)';

    thumbs.forEach(function (thumb) {
      var slide = thumb.closest('.swiper-slide') || thumb;
      var thumbIndex = parseInt(thumb.getAttribute('data-slide-index'), 10);
      slide.classList.toggle('swiper-slide-thumb-active', thumbIndex === next);

      if (
        scrollThumb &&
        thumbIndex === next &&
        typeof thumb.scrollIntoView === 'function'
      ) {
        thumb.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    });

    return next;
  }

  function initSlider(mainSelector, thumbSelector, prevSelector, nextSelector) {
    var main = $(mainSelector);
    var thumbs = $all(thumbSelector);
    var prev = $(prevSelector);
    var next = $(nextSelector);
    var current = 0;

    if (!main) {
      return;
    }

    current = setSlide(main, thumbs, current, false);

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function (event) {
        event.preventDefault();
        current = setSlide(
          main,
          thumbs,
          parseInt(thumb.getAttribute('data-slide-index'), 10),
          true
        );
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        current = setSlide(main, thumbs, current - 1, true);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        current = setSlide(main, thumbs, current + 1, true);
      });
    }
  }

  function renderYoutube(container, videoId) {
    if (!container || !videoId) {
      return;
    }

    container.innerHTML =
      '<iframe src="https://www.youtube.com/embed/' +
      encodeURIComponent(videoId) +
      '?autoplay=1&rel=0" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  }

  function initVideos() {
    $all('.js-video-play-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        var wrapper = button.closest('.product-gallery-main__video-wrapper');
        var cover = button.closest('.js-video-cover');
        var container = wrapper ? $('.js-video-container', wrapper) : null;

        if (cover) {
          cover.classList.add('is-hidden');
        }

        renderYoutube(container, button.getAttribute('data-video-id'));
      });
    });

    $all('.js-banner-video-play').forEach(function (button) {
      button.addEventListener('click', function () {
        var slide = button.closest('.product-video-main__slide');
        var container = slide ? $('.js-banner-video-container', slide) : null;

        if (slide) {
          slide.classList.add('js-banner-playing');
        }

        renderYoutube(container, button.getAttribute('data-video-id'));
      });
    });

    var videoScrollButton = $('.js-scroll-to-video');
    var videoSection = $('#video-review');

    if (videoScrollButton && videoSection) {
      videoScrollButton.addEventListener('click', function () {
        videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function updateCartFragment(total) {
    var cartTotal = document.querySelector('#cart-total');

    if (cartTotal && total) {
      cartTotal.innerHTML = total;
    }

    var cartList = document.querySelector('#cart > ul');

    if (cartList) {
      fetch('index.php?route=common/cart/info', { credentials: 'same-origin' })
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var nextList = doc.querySelector('#cart > ul');

          if (nextList) {
            cartList.innerHTML = nextList.innerHTML;
          }
        })
        .catch(function () {});
    }
  }

  function postProductAction(endpoint, productId, button, onSuccess) {
    var params = new URLSearchParams();

    params.set('product_id', productId);

    fetch(endpoint, {
      method: 'POST',
      body: params,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.redirect) {
          window.location.href = json.redirect;
          return;
        }

        if (!json.success) {
          return;
        }

        showAlert('success', json.success);

        if (typeof onSuccess === 'function') {
          onSuccess(json);
        }
      })
      .catch(function (error) {
        showAlert('danger', error.message || 'Action failed.');
      });
  }

  function initWishlistCompareFallbacks() {
    window.wishlist = window.wishlist || {};
    window.compare = window.compare || {};

    function setButtonActive(button, active) {
      if (!button || !button.setAttribute) {
        return;
      }

      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.classList.toggle('is-active', active);

      if (
        button.classList.contains('product-hero__action-btn--compare') ||
        button.classList.contains('product-card__action-btn--compare')
      ) {
        var iconUse = button.querySelector('use');

        if (iconUse) {
          iconUse.setAttribute('href', active ? '#icon-scaleCheck' : '#icon-scale');
        }
      }
    }

    function updateWishlistTotal(json) {
      var wishlistTotal = document.querySelector('#wishlist-total');
      var wishlistTotalText = wishlistTotal
        ? wishlistTotal.querySelector('span')
        : null;

      if (wishlistTotalText && json.total) {
        wishlistTotalText.innerHTML = json.total;
      }

      if (wishlistTotal && json.total) {
        wishlistTotal.setAttribute('title', json.total);
      }
    }

    window.wishlist.add = function (productId, button) {
      if (button && button.classList.contains('is-active')) {
        window.wishlist.remove(productId, button);
        return;
      }

      postProductAction(
        'index.php?route=account/wishlist/add',
        productId,
        button,
        function (json) {
          setButtonActive(button, true);
          updateWishlistTotal(json);
        }
      );
    };

    window.wishlist.remove = function (productId, button) {
      postProductAction(
        'index.php?route=account/wishlist/remove',
        productId,
        button,
        function (json) {
          setButtonActive(button, false);
          updateWishlistTotal(json);
        }
      );
    };

    window.compare.add = function (productId, button) {
      if (button && button.classList.contains('is-active')) {
        window.compare.remove(productId, button);
        return;
      }

      postProductAction(
        'index.php?route=product/compare/add',
        productId,
        button,
        function (json) {
          var compareTotal = document.querySelector('#compare-total');

          setButtonActive(button, true);

          if (compareTotal && json.total) {
            compareTotal.innerHTML = json.total;
          }
        }
      );
    };

    window.compare.remove = function (productId, button) {
      postProductAction(
        'index.php?route=product/compare/remove',
        productId,
        button,
        function (json) {
          var compareTotal = document.querySelector('#compare-total');

          setButtonActive(button, false);

          if (compareTotal && json.total) {
            compareTotal.innerHTML = json.total;
          }
        }
      );
    };
  }

  function initCart() {
    var form = $('#product');
    var button = $('#button-cart');

    if (!form || !button) {
      return;
    }

    button.addEventListener('click', function () {
      clearFieldErrors();
      setButtonLoading(button, true);

      fetch('index.php?route=checkout/cart/add', {
        method: 'POST',
        body: new FormData(form),
        credentials: 'same-origin',
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          if (json.error) {
            if (json.error.option) {
              Object.keys(json.error.option).forEach(function (key) {
                var cleanKey = key.replace('_', '-');
                var field = $('#input-option' + cleanKey);
                showFieldError(field, json.error.option[key]);
              });
            }

            if (json.error.recurring) {
              showFieldError(
                $('select[name="recurring_id"]'),
                json.error.recurring
              );
            }
          }

          if (json.success) {
            showAlert('success', json.success);
            updateCartFragment(json.total);
          }
        })
        .catch(function (error) {
          showAlert('danger', error.message || 'Request failed');
        })
        .finally(function () {
          setButtonLoading(button, false);
        });
    });
  }

  function initUploads() {
    $all('button[id^="button-upload"]').forEach(function (button) {
      button.addEventListener('click', function () {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.name = 'file';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', function () {
          if (!fileInput.files.length) {
            fileInput.remove();
            return;
          }

          var formData = new FormData();
          formData.append('file', fileInput.files[0]);
          setButtonLoading(button, true);

          fetch('index.php?route=tool/upload', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (json) {
              var optionWrap = button.closest('.product-hero__option');
              var hidden = optionWrap
                ? $('input[type="hidden"]', optionWrap)
                : null;

              clearFieldErrors();

              if (json.error) {
                showFieldError(hidden || button, json.error);
              }

              if (json.success && hidden) {
                hidden.value = json.code;
                showAlert('success', json.success);
              }
            })
            .catch(function (error) {
              showAlert('danger', error.message || 'Upload failed');
            })
            .finally(function () {
              setButtonLoading(button, false);
              fileInput.remove();
            });
        });

        fileInput.click();
      });
    });
  }

  function initRecurring() {
    var recurring = $('select[name="recurring_id"]');
    var quantity = $('input[name="quantity"]');
    var description = $('#recurring-description');

    if (!recurring || !description) {
      return;
    }

    function loadDescription() {
      var params = new URLSearchParams();
      params.append('product_id', getProductId());
      params.append('quantity', quantity ? quantity.value : '1');
      params.append('recurring_id', recurring.value);

      description.innerHTML = '';

      fetch('index.php?route=product/product/getRecurringDescription', {
        method: 'POST',
        body: params,
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          if (json.success) {
            description.innerHTML = json.success;
          }
        })
        .catch(function () {});
    }

    recurring.addEventListener('change', loadDescription);

    if (quantity) {
      quantity.addEventListener('change', loadDescription);
    }
  }

  function initReviews() {
    var review = $('#review');
    var productId = getProductId();
    var form = $('#form-review');
    var submit = $('#button-review');
    var toggle = $('.js-review-form-toggle');
    var modal = $('[data-modal="add-review"]');
    var modalHeader = modal ? $('.review-modal__header', modal) : null;
    var ratingInput = modal ? $('#review-rating-value', modal) : null;
    var ratingLabel = modal ? $('.review-modal__rating-label', modal) : null;
    var starButtons = modal ? $all('.review-modal__star-btn', modal) : [];
    var photoInput = modal ? $('#review-photo', modal) : null;
    var photoLabel = modal ? $('#photo-label', modal) : null;
    var videoInput = modal ? $('#review-video-url', modal) : null;
    var addVideoButton = modal ? $('#add-video-btn', modal) : null;
    var defaultRatingLabel = ratingLabel ? ratingLabel.textContent : '';
    var defaultPhotoLabel = photoLabel ? photoLabel.textContent : '';
    var replyModal = $('[data-modal="reply-comment"]');
    var replyForm = replyModal ? $('#form-review-reply', replyModal) : null;
    var replySubmit = replyModal ? $('#button-review-reply', replyModal) : null;
    var replyHeader = replyModal ? $('.review-modal__header', replyModal) : null;
    var replyReviewId = replyModal ? $('#reply-review-id', replyModal) : null;
    var replyAuthor = replyModal ? $('#reply-review-author', replyModal) : null;

    if (!review || !productId) {
      return;
    }

    function loadReviews(url) {
      fetch(
        url ||
          'index.php?route=product/product/review&product_id=' +
            encodeURIComponent(productId),
        {
          credentials: 'same-origin',
        }
      )
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          review.innerHTML = html;
        })
        .catch(function () {});
    }

    review.addEventListener('click', function (event) {
      var replyButton = event.target.closest('.review-item__reply-btn');

      if (replyButton) {
        var reviewItem = replyButton.closest('[data-review-id]');
        var reviewId =
          replyButton.getAttribute('data-review-id') ||
          (reviewItem ? reviewItem.getAttribute('data-review-id') : '');
        var author =
          replyButton.getAttribute('data-review-author') ||
          (reviewItem && $('.review-item__author', reviewItem)
            ? $('.review-item__author', reviewItem).textContent.trim()
            : '');

        if (!reviewId) {
          return;
        }

        event.preventDefault();
        openReplyModal(reviewId, author);
        return;
      }

      var link = event.target.closest('.pagination a');

      if (!link) {
        return;
      }

      event.preventDefault();
      loadReviews(link.href);
    });

    loadReviews();

    function clearModalAlerts() {
      if (!modal) {
        return;
      }

      $all('.galef-product-alert', modal).forEach(function (alert) {
        alert.remove();
      });
    }

    function openReviewModal() {
      if (!modal) {
        return;
      }

      modal.classList.add('modal--open');
      document.body.style.overflow = 'hidden';

      window.setTimeout(function () {
        var comment = $('#input-review', modal);
        if (comment) {
          comment.focus();
        }
      }, 0);
    }

    function closeReviewModal(reset) {
      if (!modal) {
        return;
      }

      modal.classList.remove('modal--open');
      document.body.style.overflow = '';

      if (reset) {
        resetReviewModal();
      }
    }

    function clearReplyModalAlerts() {
      if (!replyModal) {
        return;
      }

      $all('.galef-product-alert', replyModal).forEach(function (alert) {
        alert.remove();
      });
    }

    function resetReplyModal() {
      if (replyForm) {
        replyForm.reset();
      }

      clearReplyModalAlerts();

      if (replyReviewId) {
        replyReviewId.value = '';
      }

      if (replyAuthor) {
        replyAuthor.textContent = '';
      }

      if (replyModal) {
        $all('.is-valid, .is-invalid', replyModal).forEach(function (input) {
          input.classList.remove('is-valid', 'is-invalid');
        });
      }
    }

    function openReplyModal(reviewId, author) {
      if (!replyModal || !replyReviewId) {
        return;
      }

      resetReplyModal();
      replyReviewId.value = reviewId || '';

      if (replyAuthor) {
        replyAuthor.textContent = author || '';
      }

      replyModal.classList.add('modal--open');
      document.body.style.overflow = 'hidden';

      window.setTimeout(function () {
        var text = $('#reply-text', replyModal);
        if (text) {
          text.focus();
        }
      }, 0);
    }

    function closeReplyModal(reset) {
      if (!replyModal) {
        return;
      }

      replyModal.classList.remove('modal--open');
      document.body.style.overflow = '';

      if (reset) {
        resetReplyModal();
      }
    }

    function setInputState(input, isValid) {
      if (!input) {
        return true;
      }

      input.classList.toggle('is-valid', isValid);
      input.classList.toggle('is-invalid', !isValid);

      return isValid;
    }

    function setRating(rating) {
      var value = parseInt(rating, 10) || 0;

      if (ratingInput) {
        ratingInput.value = value ? String(value) : '';
      }

      starButtons.forEach(function (button) {
        var buttonRating = parseInt(button.getAttribute('data-rating'), 10) || 0;
        button.classList.toggle('is-active', buttonRating <= value);
        button.classList.remove('is-hovered');
      });

      if (ratingLabel && value) {
        ratingLabel.style.color = '';
        ratingLabel.textContent = defaultRatingLabel;
      }
    }

    function highlightStars(rating) {
      starButtons.forEach(function (button) {
        var buttonRating = parseInt(button.getAttribute('data-rating'), 10) || 0;
        button.classList.toggle('is-hovered', buttonRating <= rating);
      });
    }

    function resetReviewModal() {
      if (form) {
        form.reset();
      }

      setRating(0);
      clearModalAlerts();

      if (ratingLabel) {
        ratingLabel.style.color = '';
        ratingLabel.textContent = defaultRatingLabel;
      }

      if (photoLabel) {
        photoLabel.textContent = defaultPhotoLabel;
        photoLabel.classList.remove('review-modal__attachment-box-text--selected');
        photoLabel.style.color = '';
      }

      if (videoInput) {
        videoInput.style.borderColor = '';
      }

      if (addVideoButton) {
        addVideoButton.textContent = 'Додати відео';
        addVideoButton.style.backgroundColor = '';
        addVideoButton.style.borderColor = '';
      }

      if (modal) {
        $all('.is-valid, .is-invalid', modal).forEach(function (input) {
          input.classList.remove('is-valid', 'is-invalid');
        });
      }
    }

    function validateReviewModal() {
      if (!modal || !form) {
        return true;
      }

      var name = $('#input-name', form);
      var comment = $('#input-review', form);
      var email = $('#review-email', form);
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var isValid = true;

      clearModalAlerts();

      isValid = setInputState(name, name && name.value.trim().length >= 3) && isValid;
      isValid =
        setInputState(comment, comment && comment.value.trim().length >= 25) &&
        isValid;
      isValid =
        setInputState(email, email && emailRegex.test(email.value.trim())) &&
        isValid;

      if (!ratingInput || !ratingInput.value) {
        isValid = false;

        if (ratingLabel) {
          ratingLabel.style.color = '#FF2630';
          ratingLabel.textContent = 'Оберіть оцінку';
        }
      }

      if (!isValid) {
        showAlert(
          'danger',
          'Заповніть імʼя, email, текст відгуку від 25 символів та оцінку.',
          modalHeader || form
        );
      }

      return isValid;
    }

    function validateReplyModal() {
      if (!replyModal || !replyForm) {
        return true;
      }

      var text = $('#reply-text', replyForm);
      var isValid = true;

      clearReplyModalAlerts();

      isValid = setInputState(text, text && text.value.trim().length >= 3) && isValid;

      if (!replyReviewId || !replyReviewId.value) {
        isValid = false;
      }

      if (!isValid) {
        showAlert(
          'danger',
          'Заповніть текст відповіді.',
          replyHeader || replyForm
        );
      }

      return isValid;
    }

    function buildReviewFormData() {
      var formData = new FormData(form);
      var comment = String(formData.get('text') || '').trim();
      var advantages = $('#review-advantages', form);
      var disadvantages = $('#review-disadvantages', form);
      var parts = [];

      if (comment) {
        parts.push(comment);
      }

      if (advantages && advantages.value.trim()) {
        parts.push('Переваги: ' + advantages.value.trim());
      }

      if (disadvantages && disadvantages.value.trim()) {
        parts.push('Недоліки: ' + disadvantages.value.trim());
      }

      formData.set('text', parts.join('\n\n'));

      return formData;
    }

    function buildReplyFormData() {
      var formData = new FormData(replyForm);
      formData.set('text', String(formData.get('text') || '').trim());

      return formData;
    }

    if (toggle) {
      toggle.addEventListener('click', function (event) {
        event.preventDefault();

        if (modal) {
          openReviewModal();
          return;
        }

        if (form) {
          form.classList.toggle('is-visible');
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    if (modal) {
      $all('[data-modal-close]', modal).forEach(function (button) {
        button.addEventListener('click', function () {
          closeReviewModal(true);
        });
      });

      modal.addEventListener('click', function (event) {
        if (event.target === modal) {
          closeReviewModal(true);
        }
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.classList.contains('modal--open')) {
          closeReviewModal(true);
        }
      });

      starButtons.forEach(function (button) {
        button.addEventListener('mouseenter', function () {
          highlightStars(parseInt(button.getAttribute('data-rating'), 10) || 0);
        });

        button.addEventListener('mouseleave', function () {
          highlightStars(0);
        });

        button.addEventListener('click', function (event) {
          event.preventDefault();
          setRating(button.getAttribute('data-rating'));
        });
      });

      if (photoInput && photoLabel) {
        photoInput.addEventListener('change', function () {
          var file = photoInput.files && photoInput.files[0];

          if (!file) {
            photoLabel.textContent = defaultPhotoLabel;
            photoLabel.classList.remove('review-modal__attachment-box-text--selected');
            photoLabel.style.color = '';
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            photoInput.value = '';
            photoLabel.textContent = 'Файл перевищує 5МБ';
            photoLabel.classList.remove('review-modal__attachment-box-text--selected');
            photoLabel.style.color = '#FF2630';
            return;
          }

          photoLabel.textContent = 'Вибрано: ' + file.name;
          photoLabel.classList.add('review-modal__attachment-box-text--selected');
          photoLabel.style.color = '';
        });
      }

      if (addVideoButton && videoInput) {
        addVideoButton.addEventListener('click', function () {
          var value = videoInput.value.trim();

          if (!value) {
            videoInput.focus();
            return;
          }

          try {
            var url = new URL(value);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
              throw new Error('Invalid protocol');
            }

            videoInput.style.borderColor = '#007D56';
            addVideoButton.textContent = 'Додано!';
            addVideoButton.style.backgroundColor = '#007D56';
            addVideoButton.style.borderColor = '#007D56';
          } catch (error) {
            videoInput.style.borderColor = '#FF2630';
          }
        });
      }
    }

    if (replyModal) {
      $all('[data-modal-close]', replyModal).forEach(function (button) {
        button.addEventListener('click', function () {
          closeReplyModal(true);
        });
      });

      replyModal.addEventListener('click', function (event) {
        if (event.target === replyModal) {
          closeReplyModal(true);
        }
      });

      document.addEventListener('keydown', function (event) {
        if (
          event.key === 'Escape' &&
          replyModal.classList.contains('modal--open')
        ) {
          closeReplyModal(true);
        }
      });
    }

    if (replyForm && replySubmit) {
      replySubmit.addEventListener('click', function () {
        if (!validateReplyModal()) {
          return;
        }

        setButtonLoading(replySubmit, true);

        fetch(
          'index.php?route=product/product/writeReply&product_id=' +
            encodeURIComponent(productId),
          {
            method: 'POST',
            body: buildReplyFormData(),
            credentials: 'same-origin',
          }
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (json) {
            if (json.error) {
              showAlert('danger', json.error, replyHeader || replyForm);
            }

            if (json.success) {
              showAlert('success', json.success, review);
              closeReplyModal(true);
              loadReviews();
            }
          })
          .catch(function (error) {
            showAlert('danger', error.message || 'Request failed', review);
          })
          .finally(function () {
            setButtonLoading(replySubmit, false);
          });
      });
    }

    if (!form || !submit) {
      return;
    }

    submit.addEventListener('click', function () {
      if (!validateReviewModal()) {
        return;
      }

      setButtonLoading(submit, true);

      fetch(
        'index.php?route=product/product/write&product_id=' +
          encodeURIComponent(productId),
        {
          method: 'POST',
          body: buildReviewFormData(),
          credentials: 'same-origin',
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          if (json.error) {
            showAlert(
              'danger',
              json.error,
              modal && modal.classList.contains('modal--open')
                ? modalHeader || form
                : review
            );
          }

          if (json.success) {
            showAlert('success', json.success, review);
            resetReviewModal();
            closeReviewModal(false);
            loadReviews();
          }
        })
        .catch(function (error) {
          showAlert('danger', error.message || 'Request failed', review);
        })
        .finally(function () {
          setButtonLoading(submit, false);
        });
    });
  }

  function initReviewImagePopup() {
    var popup = $('[data-review-image-popup]');
    var image = popup ? $('.review-image-popup__img', popup) : null;
    var previousBodyOverflow = '';

    if (!popup || !image) {
      return;
    }

    function openPopup(src, alt) {
      if (!src) {
        return;
      }

      previousBodyOverflow = document.body.style.overflow;
      image.src = src;
      image.alt = alt || 'Review photo';
      popup.classList.add('is-open');
      popup.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closePopup() {
      if (!popup.classList.contains('is-open')) {
        return;
      }

      popup.classList.remove('is-open');
      popup.setAttribute('aria-hidden', 'true');
      image.removeAttribute('src');
      image.alt = '';
      document.body.style.overflow = previousBodyOverflow;
    }

    root.addEventListener('click', function (event) {
      var link = event.target.closest('.js-review-image-popup');

      if (!link) {
        return;
      }

      event.preventDefault();

      var reviewImage = $('img', link);

      openPopup(link.getAttribute('href'), reviewImage ? reviewImage.alt : '');
    });

    $all('[data-review-image-popup-close]', popup).forEach(function (button) {
      button.addEventListener('click', closePopup);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closePopup();
      }
    });
  }

  function initSpecificationToggle() {
    var specs = $('.product-specifications');
    var table = specs ? $('.product-specifications__table', specs) : null;
    var button = specs ? $('.product-specifications__btn', specs) : null;
    var collapsedHeight = 350;

    if (!specs || !table || !button) {
      return;
    }

    table.style.maxHeight = '';
    specs.classList.remove('is-collapsible', 'is-expanded');
    button.classList.remove('is-visible');
    button.setAttribute('aria-expanded', 'false');

    if (table.scrollHeight > collapsedHeight) {
      specs.classList.add('is-collapsible');
      button.classList.add('is-visible');
      table.style.maxHeight = collapsedHeight + 'px';
    } else {
      return;
    }

    button.addEventListener('click', function () {
      var isExpanded = specs.classList.contains('is-expanded');

      if (isExpanded) {
        table.style.maxHeight = collapsedHeight + 'px';
        specs.classList.remove('is-expanded');
        button.setAttribute('aria-expanded', 'false');
      } else {
        table.style.maxHeight = table.scrollHeight + 'px';
        specs.classList.add('is-expanded');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  }

  function initSmoothAnchors() {
    $all('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var href = link.getAttribute('href');

        if (!href || href === '#') {
          return;
        }

        var target = document.querySelector(href);

        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initRelatedProductsSlider() {
    $all('.js-related-products-slider').forEach(function (slider) {
      var isDragging = false;
      var didMove = false;
      var startX = 0;
      var startScrollLeft = 0;

      slider.addEventListener('pointerdown', function (event) {
        if (event.button !== 0) {
          return;
        }

        isDragging = true;
        didMove = false;
        startX = event.clientX;
        startScrollLeft = slider.scrollLeft;
        slider.setPointerCapture(event.pointerId);
      });

      slider.addEventListener('pointermove', function (event) {
        if (!isDragging) {
          return;
        }

        var deltaX = event.clientX - startX;

        if (Math.abs(deltaX) > 4) {
          didMove = true;
        }

        slider.scrollLeft = startScrollLeft - deltaX;
      });

      slider.addEventListener('pointerup', function (event) {
        isDragging = false;

        if (slider.hasPointerCapture(event.pointerId)) {
          slider.releasePointerCapture(event.pointerId);
        }
      });

      slider.addEventListener('pointercancel', function () {
        isDragging = false;
      });

      slider.addEventListener(
        'click',
        function (event) {
          if (!didMove) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
          didMove = false;
        },
        true
      );
    });
  }

  initSlider(
    '.js-product-gallery-main',
    '.js-product-gallery-thumbs [data-slide-index]',
    '.js-product-gallery-prev',
    '.js-product-gallery-next'
  );
  initSlider(
    '.js-video-main-swiper',
    '.js-video-thumb-trigger',
    '.js-video-prev',
    '.js-video-next'
  );
  initVideos();
  initWishlistCompareFallbacks();
  initCart();
  initUploads();
  initRecurring();
  initReviews();
  initReviewImagePopup();
  initSpecificationToggle();
  initSmoothAnchors();
  initRelatedProductsSlider();
})();
