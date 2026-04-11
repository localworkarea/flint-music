import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
/*
Основні модулі слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Детальніше дивись https://swiperjs.com/
*/

import "./slider.scss";
// import 'swiper/css/bundle';

function initSliders() {
	if (document.querySelector('.flint__slider')) { 
		new Swiper('.flint__slider', {
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 60,
			speed: 600,
			initialSlide: 2,

			navigation: {
				prevEl: '.flint__slider .swiper-button-prev',
				nextEl: '.flint__slider .swiper-button-next',
				addIcons: false,
			},
			breakpoints: {
				320: {
					spaceBetween: 30,
				},
				481: {
					spaceBetween: 60,
				},
			},
			// Події
			on: {

			}
		});
	}
}
document.querySelector('[data-att-slider]') ?
	window.addEventListener("load", initSliders) : null