
import { FLS } from "@js/common/functions.js";
// Підключення доповнення
import Isotope from 'isotope-layout/js/isotope.js';
// Підключення стилів
import './masonry.scss'
// Застосування
function masonryRun() {
	document.addEventListener('click', documentActions);
	const isotope = document.querySelector('[data-att-masonry]')
	const isotopeItems = new Isotope(isotope, {
		itemSelector: '[data-att-masonry-item]',
		masonry: {
			fitWidth: true,
			gutter: 20
		}
	})
	// Функціонал фільтру
	function documentActions(e) {
		const targetElement = e.target
		if (targetElement.closest('[data-att-masonry-filter-link]')) {
			const filterItem = targetElement.closest('[data-att-masonry-filter-link]')
			const filterValue = filterItem.dataset.attMasonryFilterLink
			const filterActiveItem = document.querySelector('[data-att-masonry-filter-link].--active')

			filterValue === "*" ? isotopeItems.arrange({ filter: `` }) :
				isotopeItems.arrange({ filter: `[data-att-masonry-filter="${filterValue}"]` })

			filterActiveItem.classList.remove('--active')
			filterItem.classList.add('--active')

			e.preventDefault()
		}
	}
}
document.querySelector('[data-att-masonry]') ?
	window.addEventListener('load', masonryRun) : null