import html2canvas from 'html2canvas';

function screenshotInit() {
	const button = document.querySelector('[data-att-screenshot]')
	button.addEventListener('click', function () {
		const screenshotTargetClass = button.dataset.attScreenshot
		const screenshotTarget = document.querySelector(screenshotTargetClass)
		if (screenshotTarget) {
			html2canvas(screenshotTarget).then((canvas) => {
				const base64image = canvas.toDataURL()
				document.body.insertAdjacentHTML('beforeend', `<a id="screenshot-download" download href="${base64image}"></a>`)
				const download = document.querySelector('#screenshot-download')
				download.click()
				download.remove()
			});
		}
	})
}

document.querySelector('[data-att-screenshot]') ?
	window.addEventListener('load', screenshotInit) : null