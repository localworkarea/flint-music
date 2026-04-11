
import { addTouchAttr, bodyLockStatus, bodyLockToggle, FLS } from "@js/common/functions.js"

import './menu.scss'

export function menuInit() {
	document.addEventListener("click", function (e) {
		if (bodyLockStatus && e.target.closest('[data-att-menu]')) {
			bodyLockToggle()
			document.documentElement.toggleAttribute("data-att-menu-open")
		}
	})
}

document.querySelector('[data-att-menu]') ?
	window.addEventListener('load', menuInit) : null