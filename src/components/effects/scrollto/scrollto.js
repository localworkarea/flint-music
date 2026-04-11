
import { isMobile, gotoBlock, getHash, FLS, bodyUnlock } from "@js/common/functions.js";

// Плавна навігація по сторінці
export function pageNavigation() {
	// Працюємо при натисканні на пункт
	document.addEventListener("click", pageNavigationAction);
	// Якщо підключено scrollWatcher, підсвічуємо поточний пункт меню
	document.addEventListener("watcherCallback", pageNavigationAction);
	// Основна функція
	function pageNavigationAction(e) {
		if (e.type === "click") {
			const targetElement = e.target;
			if (targetElement.closest('[data-att-scrollto]')) {
				const gotoLink = targetElement.closest('[data-att-scrollto]');
				const gotoLinkSelector = gotoLink.dataset.attScrollto ? gotoLink.dataset.attScrollto : '';
				const noHeader = gotoLink.hasAttribute('data-att-scrollto-header') ? true : false;
				const gotoSpeed = gotoLink.dataset.attScrolltoSpeed ? gotoLink.dataset.attScrolltoSpeed : 500;
				const offsetTop = gotoLink.dataset.attScrolltoTop ? parseInt(gotoLink.dataset.attScrolltoTop) : 0;
				if (window.fullpage) {
					const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest('[data-att-fullpage-section]');
					const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.attFullpageId : null;
					if (fullpageSectionId !== null) {
						window.fullpage.switchingSection(fullpageSectionId);
						// Закриваємо меню, якщо воно відкрите
						if (document.documentElement.hasAttribute("data-att-menu-open")) {
							bodyUnlock()
							document.documentElement.removeAttribute("data-att-menu-open")
						}
					}
				} else {
					gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
				}
				e.preventDefault();
			}
		} else if (e.type === "watcherCallback" && e.detail) {
			const entry = e.detail.entry;
			const targetElement = entry.target;
			// Обробка пунктів навігації, якщо вказано значення navigator, підсвічуємо поточний пункт меню
			if (targetElement.dataset.attWatcher === 'navigator') {
				const navigatorActiveItem = document.querySelector(`[data-att-scrollto].--navigator-active`);
				let navigatorCurrentItem;
				if (targetElement.id && document.querySelector(`[data-att-scrollto="#${targetElement.id}"]`)) {
					navigatorCurrentItem = document.querySelector(`[data-att-scrollto="#${targetElement.id}"]`);
				} else if (targetElement.classList.length) {
					for (let index = 0; index < targetElement.classList.length; index++) {
						const element = targetElement.classList[index];
						if (document.querySelector(`[data-att-scrollto=".${element}"]`)) {
							navigatorCurrentItem = document.querySelector(`[data-att-scrollto=".${element}"]`);
							break;
						}
					}
				}
				if (entry.isIntersecting) {
					// Бачимо об'єкт
					// navigatorActiveItem ? navigatorActiveItem.classList.remove('--navigator-active') : null;
					navigatorCurrentItem ? navigatorCurrentItem.classList.add('--navigator-active') : null;
					//const activeItems = document.querySelectorAll('.--navigator-active');
					//activeItems.length > 1 ? chooseOne(activeItems) : null
				} else {
					// Не бачимо об'єкт
					navigatorCurrentItem ? navigatorCurrentItem.classList.remove('--navigator-active') : null;
				}
			}
		}
	}
	function chooseOne(activeItems) { }
	// Прокручування по хешу
	if (getHash()) {
		let goToHash;
		if (document.querySelector(`#${getHash()}`)) {
			goToHash = `#${getHash()}`;
		} else if (document.querySelector(`.${getHash()}`)) {
			goToHash = `.${getHash()}`;
		}
		goToHash ? gotoBlock(goToHash) : null;
	}
}

document.querySelector('[data-att-scrollto]') ?
	window.addEventListener('load', pageNavigation) : null