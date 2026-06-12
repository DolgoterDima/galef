import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export function initHeroSlider() {
  const heroSlider = document.querySelector('.hero__slider');
  
  if (heroSlider) {
    new Swiper(heroSlider, {
      modules: [Pagination, Autoplay],
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.hero__pagination',
        clickable: true,
      },
    });
  }
}
