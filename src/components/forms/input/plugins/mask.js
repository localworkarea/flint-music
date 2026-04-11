// Підключення модуля
import "inputmask/dist/inputmask.min.js";

function inputMask() {
	const inputMasks = document.querySelectorAll('input[data-att-input-mask]')
	inputMasks.forEach(inputMask => {
		Inputmask({ "mask": `${inputMask.dataset.attInputMask}` }).mask(inputMask)
	});
}
document.querySelector('input[data-att-input-mask]') ?
	window.addEventListener('load', inputMask) : null