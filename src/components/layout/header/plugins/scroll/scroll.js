
import { FLS } from "@js/common/functions.js";

import './scroll.scss'

export function headerScroll() {
	const header = document.querySelector('[data-att-header-scroll]');
	const headerShow = header.hasAttribute('data-att-header-scroll-show');
	const headerShowTimer = header.dataset.attHeaderScrollShow ? header.dataset.attHeaderScrollShow : 500;
	const startPoint = header.dataset.attHeaderScroll ? header.dataset.attHeaderScroll : 1;
	let scrollDirection = 0;
	let timer;
	document.addEventListener("scroll", function (e) {
		const scrollTop = window.scrollY;
		clearTimeout(timer);
		if (scrollTop >= startPoint) {
			!header.classList.contains('--header-scroll') ? header.classList.add('--header-scroll') : null;
			if (headerShow) {
				if (scrollTop > scrollDirection) {
					// downscroll code
					header.classList.contains('--header-show') ? header.classList.remove('--header-show') : null;
				} else {
					// upscroll code
					!header.classList.contains('--header-show') ? header.classList.add('--header-show') : null;
				}
				timer = setTimeout(() => {
					!header.classList.contains('--header-show') ? header.classList.add('--header-show') : null;
				}, headerShowTimer);
			}
		} else {
			header.classList.contains('--header-scroll') ? header.classList.remove('--header-scroll') : null;
			if (headerShow) {
				header.classList.contains('--header-show') ? header.classList.remove('--header-show') : null;
			}
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	});
}
document.querySelector('[data-att-header-scroll]') ?
	window.addEventListener('load', headerScroll) : null