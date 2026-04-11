// РџС–РґРєР»СЋС‡РµРЅРЅСЏ С„СѓРЅРєС†С–РѕРЅР°Р»Сѓ "Р§РѕСЂС‚РѕРіРё Р¤СЂС–Р»Р°РЅСЃРµСЂР°"
import { isMobile, FLS } from "@js/common/functions.js";

import './darklite.scss'

function getHours() {
	const now = new Date()
	const hours = now.getHours()
	return hours
}

function darkliteInit() {
	// HTML
	const htmlBlock = document.documentElement;

	// РћС‚СЂРёРјСѓС”РјРѕ Р·Р±РµСЂРµР¶РµРЅСѓ С‚РµРјСѓ
	const saveUserTheme = localStorage.getItem('fls-user-theme');

	let userTheme;

	if (document.querySelector('[data-att-darklite-time]')) {
		// РљРѕСЂРёСЃС‚СѓРІР°С†СЊРєРёР№ РїСЂРѕРјС–Р¶РѕРє С‡Р°СЃСѓ
		let customRange = document.querySelector('[data-att-darklite-time]').dataset.attDarkliteTime
		customRange = customRange || '18,5'
		const timeFrom = +customRange.split(',')[0]
		const timeTo = +customRange.split(',')[1]
		console.log(timeFrom);
		// Р РѕР±РѕС‚Р° Р· С‡Р°СЃРѕРј
		userTheme = getHours() >= timeFrom && getHours() <= timeTo ? 'dark' : 'light'
	} else {
		// Р РѕР±РѕС‚Р° Р· СЃРёСЃС‚РµРјРЅРёРјРё РЅР°Р»Р°С€С‚СѓРІР°РЅРЅСЏРјРё
		if (window.matchMedia) {
			userTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
			!saveUserTheme ? changeTheme() : null;
		});
	}

	// Р—РјС–РЅР° С‚РµРјРё РїРѕ РєР»С–РєСѓ
	const themeButton = document.querySelector('[data-att-darklite-set]')
	const resetButton = document.querySelector('[data-att-darklite-reset]')

	if (themeButton) {
		themeButton.addEventListener("click", function (e) {
			changeTheme(true);
		})
	}
	if (resetButton) {
		resetButton.addEventListener("click", function (e) {
			localStorage.setItem('fls-user-theme', '');
		})
	}
	// Р¤СѓРЅРєС†С–СЏ РґРѕРґР°РІР°РЅРЅСЏ РєР»Р°СЃСѓ С‚РµРјРё
	function setThemeClass() {
		htmlBlock.setAttribute(`data-att-darklite-${saveUserTheme ? saveUserTheme : userTheme}`, '')
	}
	// Р”РѕРґР°С”РјРѕ РєР»Р°СЃ С‚РµРјРё
	setThemeClass();

	// Р¤СѓРЅРєС†С–СЏ Р·РјС–РЅРё С‚РµРјРё
	function changeTheme(saveTheme = false) {
		let currentTheme = htmlBlock.hasAttribute('data-att-darklite-light') ? 'light' : 'dark';
		let newTheme;

		if (currentTheme === 'light') {
			newTheme = 'dark';
		} else if (currentTheme === 'dark') {
			newTheme = 'light';
		}
		htmlBlock.removeAttribute(`data-att-darklite-${currentTheme}`)
		htmlBlock.setAttribute(`data-att-darklite-${newTheme}`, '')
		saveTheme ? localStorage.setItem('fls-user-theme', newTheme) : null;
	}
}
document.querySelector('[data-att-darklite]') ?
	window.addEventListener("load", darkliteInit) : null