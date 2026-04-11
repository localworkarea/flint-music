
import { FLS } from "@js/common/functions.js";

import './quantity.scss'

export function formQuantity() {
	document.addEventListener("click", quantityActions)
	document.addEventListener("input", quantityActions)
	function quantityActions(e) {
		const type = e.type
		const targetElement = e.target
		if (type === 'click') {
			if (targetElement.closest('[data-att-quantity-plus]') || targetElement.closest('[data-att-quantity-minus]')) {
				const valueElement = targetElement.closest('[data-att-quantity]').querySelector('[data-att-quantity-value]');
				let value = parseInt(valueElement.value);
				if (targetElement.hasAttribute('data-att-quantity-plus')) {
					value++;
					if (+valueElement.dataset.attQuantityMax && +valueElement.dataset.attQuantityMax < value) {
						value = valueElement.dataset.attQuantityMax;
					}
				} else {
					--value;
					if (+valueElement.dataset.attQuantityMin) {
						if (+valueElement.dataset.attQuantityMin > value) {
							value = valueElement.dataset.attQuantityMin;
						}
					} else if (value < 1) {
						value = 1;
					}
				}
				targetElement.closest('[data-att-quantity]').querySelector('[data-att-quantity-value]').value = value;
			}
		} else if (type === 'input') {
			if (targetElement.closest('[data-att-quantity-value]')) {
				const valueElement = targetElement.closest('[data-att-quantity-value]')
				valueElement.value == 0 || (/[^0-9]/gi).test(valueElement.value) ? valueElement.value = 1 : null
			}
		}
	}
}
document.querySelector('[data-att-quantity]') ?
	window.addEventListener('load', formQuantity) : null