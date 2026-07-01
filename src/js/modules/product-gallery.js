import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

export function initProductGallery() {
  const mainSliderEl = document.querySelector('.product-gallery-main');
  const thumbsSliderEl = document.querySelector('.product-gallery-thumbs');

  if (!mainSliderEl || !thumbsSliderEl) return;

  // Initialize Thumbs Swiper
  const thumbsSwiper = new Swiper(thumbsSliderEl, {
    modules: [Navigation],
    slidesPerView: 4,
    spaceBetween: 8,
    watchSlidesProgress: true,
    navigation: {
      prevEl: '.product-gallery-thumbs-btn--prev',
      nextEl: '.product-gallery-thumbs-btn--next',
    },
    breakpoints: {
      0: {
        slidesPerView: 4,
        spaceBetween: 8
      },
      459: {
        slidesPerView: 4,
        spaceBetween: 10
      },
      760: {
        slidesPerView: 5,
        spaceBetween: 12
      }
    }
  });

  // Initialize Main Swiper
  const mainSwiper = new Swiper(mainSliderEl, {
    modules: [Thumbs],
    spaceBetween: 10,
    thumbs: {
      swiper: thumbsSwiper,
    },
    on: {
      slideChange: function () {
        // Stop any playing video if slide changes
        stopActiveVideos();
      }
    }
  });

  // Handle Video Cover Play Button inside Main Gallery
  const videoCover = mainSliderEl.querySelector('.js-video-cover');
  const videoContainer = mainSliderEl.querySelector('.js-video-container');
  const playBtn = mainSliderEl.querySelector('.js-video-play-btn');

  if (playBtn && videoCover && videoContainer) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoId = playBtn.getAttribute('data-video-id');
      if (videoId) {
        videoCover.style.display = 'none';
        videoContainer.innerHTML = `
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen>
          </iframe>
        `;
      }
    });
  }

  // Handle Video Click in Thumbs (Switch to video slide and autoplay)
  const videoThumb = thumbsSliderEl.querySelector('.product-gallery-thumbs__item--video');
  if (videoThumb) {
    const thumbSlide = videoThumb.closest('.swiper-slide');
    const slideIndex = Array.from(thumbsSliderEl.querySelectorAll('.swiper-slide')).indexOf(thumbSlide);
    
    thumbSlide.addEventListener('click', () => {
      mainSwiper.slideTo(slideIndex);
      // Auto-trigger video play after transition
      setTimeout(() => {
        if (playBtn && videoCover.style.display !== 'none') {
          playBtn.click();
        }
      }, 300);
    });
  }

  // Large Promo Video Banner (in description)
  const promoBanner = document.querySelector('.product-description__promo-banner');
  let promoPlayBtn = null;
  let promoContainer = null;

  if (promoBanner) {
    promoPlayBtn = promoBanner.querySelector('.js-banner-video-play');
    promoContainer = promoBanner.querySelector('.js-banner-video-container');

    if (promoPlayBtn && promoContainer) {
      promoPlayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const videoId = promoPlayBtn.getAttribute('data-video-id');
        if (videoId) {
          promoBanner.classList.add('js-banner-playing');
          promoContainer.innerHTML = `
            <iframe 
              src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
              allow="autoplay; encrypted-media" 
              allowfullscreen>
            </iframe>
          `;
        }
      });
    }
  }

  // Small Video Thumbnails (below promo banner)
  const videoThumbTriggers = document.querySelectorAll('.js-video-thumb-trigger');
  videoThumbTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const videoId = trigger.getAttribute('data-video-id');
      
      // Scroll to promo banner and play
      if (promoBanner && promoPlayBtn && promoContainer && videoId) {
        promoBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Update video and trigger play
        promoPlayBtn.setAttribute('data-video-id', videoId);
        promoPlayBtn.click();
      }
    });
  });

  function stopActiveVideos() {
    if (videoContainer) {
      videoContainer.innerHTML = '';
    }
    if (videoCover) {
      videoCover.style.display = 'flex';
    }
  }
}
