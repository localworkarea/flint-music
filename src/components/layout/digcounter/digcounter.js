
import { FLS, getDigFormat } from "@js/common/functions.js";

// Модуль анімація цифрового лічильника
export function digitsCounter() {
	// Функція ініціалізації
	function digitsCountersInit(digitsCountersItems) {
		let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-att-digcounter]");
		if (digitsCounters.length) {

			FLS('_FLS_DIGCOUNTER_ANIM')

			digitsCounters.forEach(digitsCounter => {
				// Обнулення
				if (digitsCounter.hasAttribute('data-att-digcounter-go')) return;
				digitsCounter.setAttribute('data-att-digcounter-go', '');
				digitsCounter.dataset.attDigcounter = digitsCounter.innerHTML;
				digitsCounter.innerHTML = `0`;
				// Анімація
				digitsCountersAnimate(digitsCounter);
			});
		}
	}
	// Функція анімації
	function digitsCountersAnimate(digitsCounter) {
		let startTimestamp = null;
		const duration = parseFloat(digitsCounter.dataset.attDigcounterSpeed) ? parseFloat(digitsCounter.dataset.attDigcounterSpeed) : 1000;
		const startValue = parseFloat(digitsCounter.dataset.attDigcounter);
		const format = digitsCounter.dataset.attDigcounterFormat ? digitsCounter.dataset.attDigcounterFormat : ' ';
		const startPosition = 0;
		const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			const value = Math.floor(progress * (startPosition + startValue));
			digitsCounter.innerHTML = typeof digitsCounter.dataset.attDigcounterFormat !== 'undefined' ? getDigFormat(value, format) : value;
			if (progress < 1) {
				window.requestAnimationFrame(step);
			} else {
				digitsCounter.removeAttribute('data-att-digcounter-go');
			}
		};
		window.requestAnimationFrame(step);
	}
	function digitsCounterAction(e) {
		const entry = e.detail.entry;
		const targetElement = entry.target;
		if (
			targetElement.querySelectorAll("[data-att-digcounter]").length &&
			!targetElement.querySelectorAll("[data-att-watcher]").length &&
			entry.isIntersecting
		) {
			digitsCountersInit(targetElement.querySelectorAll("[data-att-digcounter]"))
		}
	}
	document.addEventListener("watcherCallback", digitsCounterAction);
}
document.querySelector("[data-att-digcounter]") ?
	window.addEventListener('load', digitsCounter) : null
