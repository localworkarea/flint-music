
import { FLS } from "@js/common/functions.js";
// Docs: https://www.npmjs.com/package/split-type
import SplitType from 'split-type'
// Стилі модуля
import './splittype.scss'

function splitType() {
	const splitText = SplitType.create('[data-att-splittype]', {
		absolute: false,
		tagName: 'div',
		lineClass: 'line',
		wordClass: 'word',
		charClass: 'char',
		splitClass: '',
		types: "lines, words, chars",
		split: ''
	})
}

document.querySelector('[data-att-splittype]') ?
	window.addEventListener('load', splitType) : null

