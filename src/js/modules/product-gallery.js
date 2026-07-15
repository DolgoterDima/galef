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
    slidesPerView: 'auto',
    spaceBetween: 8,
    centerInsufficientSlides: true,
    watchSlidesProgress: true,
    breakpoints: {
      0: {
        spaceBetween: 8
      },
      459: {
        spaceBetween: 10
      },
      760: {
        spaceBetween: 12
      }
    }
  });

  // Initialize Main Swiper
  const mainSwiper = new Swiper(mainSliderEl, {
    modules: [Thumbs, Navigation],
    spaceBetween: 10,
    rewind: true,
    navigation: {
      prevEl: '.product-gallery-thumbs-btn--prev',
      nextEl: '.product-gallery-thumbs-btn--next',
    },
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
  const promoBanner = document.querySelector('.product-video-block');
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

    // Video Slider Logic
    const videoSwiperEl = promoBanner.querySelector('.js-video-slider-swiper');
    const prevBtn = promoBanner.querySelector('.product-video-slider__nav--prev');
    const nextBtn = promoBanner.querySelector('.product-video-slider__nav--next');

    if (videoSwiperEl && typeof Swiper !== 'undefined') {
      const thumbSwiper = new Swiper(videoSwiperEl, {
        modules: [Navigation],
        slidesPerView: 1.8,
        spaceBetween: 20,
        loop: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        breakpoints: {
          761: {
            slidesPerView: 3.3,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 20,
          }
        }
      });

      const mainSwiperEl = promoBanner.querySelector('.js-video-main-swiper');
      if (mainSwiperEl) {
        new Swiper(mainSwiperEl, {
          modules: [Thumbs, Navigation],
          slidesPerView: 1,
          loop: true,
          navigation: {
            prevEl: prevBtn,
            nextEl: nextBtn,
          },
          thumbs: {
            swiper: thumbSwiper
          },
          on: {
            slideChange: function () {
              // Stop any playing video when slide changes
              const playingSlides = mainSwiperEl.querySelectorAll('.js-banner-playing');
              playingSlides.forEach(slide => {
                slide.classList.remove('js-banner-playing');
                const container = slide.querySelector('.js-banner-video-container');
                if (container) container.innerHTML = '';
              });
            }
          }
        });
      }
    }

    // Play buttons logic for all slides
    const playBtns = promoBanner.querySelectorAll('.js-banner-video-play');
    playBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const videoId = btn.getAttribute('data-video-id');
        if (videoId) {
          const slide = btn.closest('.swiper-slide');
          if (slide) {
            slide.classList.add('js-banner-playing');
            const container = slide.querySelector('.js-banner-video-container');
            if (container) {
              container.innerHTML = `
                <iframe 
                  src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                  allow="autoplay; encrypted-media" 
                  allowfullscreen>
                </iframe>
              `;
            }
          }
        }
      });
    });
  }

  // Small Video Thumbnails click scrolling
  const videoThumbTriggers = document.querySelectorAll('.js-video-thumb-trigger');
  videoThumbTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (promoBanner) {
        promoBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    if (promoBanner) {
      const playingSlides = promoBanner.querySelectorAll('.js-banner-playing');
      playingSlides.forEach(slide => {
        slide.classList.remove('js-banner-playing');
        const container = slide.querySelector('.js-banner-video-container');
        if (container) container.innerHTML = '';
      });
    }
  }
}
