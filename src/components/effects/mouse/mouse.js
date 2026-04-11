
import { isMobile, FLS } from "@js/common/functions.js";

//Модуль паралаксу мишею
// Документація: 

/*
Предмету, який рухатиметься за мишею, вказати атрибут data-att-mouse

// =========
Якщо потрібно додаткові налаштування - вказати

Атрибут											Значення за замовчуванням
-------------------------------------------------------------------------------------------------------------------
data-att-mouse-cx="коефіцієнт_х"					100							значення більше - менше відсоток зсуву
data-att-mouse-cy="коефіцієнт_y"					100							значення більше - менше відсоток зсуву
data-att-mouse-dxr																		проти осі X
data-att-mouse-dyr																		проти осі Y
data-att-mouse-a="швидкість_анімації"				50								більше значення – більше швидкість

// =========
Якщо потрібно зчитувати рух миші в блоці-батьку - тому батькові вказати атрибут data-att-mouse-mouse-wrapper

Якщо в паралакс картинка - розтягнути її на >100%. 
Наприклад:
	width: 130%;
	height: 130%;
	top: -15%;
	left: -15%;
*/
class MousePRLX {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
		}
		this.config = Object.assign(defaultConfig, props);
		if (this.config.init) {
			const paralaxMouse = document.querySelectorAll('[data-att-mouse]');
			if (paralaxMouse.length) {
				this.paralaxMouseInit(paralaxMouse);
				FLS(`_FLS_MOUSE_START`, paralaxMouse.length)
			} else {
				FLS(`_FLS_MOUSE_SLEEP`)
			}
		}
	}
	paralaxMouseInit(paralaxMouse) {
		paralaxMouse.forEach(el => {
			const paralaxMouseWrapper = el.closest('[data-att-mouse-wrapper]');

			// Коеф. X 
			const paramСoefficientX = +el.dataset.attMouseCx || 100;
			// Коеф. У 
			const paramСoefficientY = +el.dataset.attMouseCy || 100;
			// Напр. Х
			const directionX = el.hasAttribute('data-att-mouse-dxr') ? -1 : 1;
			// Напр. У
			const directionY = el.hasAttribute('data-att-mouse-dyr') ? -1 : 1;
			// Швидкість анімації
			const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;


			// Оголошення змінних
			let positionX = 0, positionY = 0;
			let coordXprocent = 0, coordYprocent = 0;

			setMouseParallaxStyle();

			// Перевіряю на наявність батька, в якому зчитуватиметься становище миші
			if (paralaxMouseWrapper) {
				mouseMoveParalax(paralaxMouseWrapper);
			} else {
				mouseMoveParalax();
			}

			function setMouseParallaxStyle() {
				const distX = coordXprocent - positionX;
				const distY = coordYprocent - positionY;
				positionX = positionX + (distX * paramAnimation / 1000);
				positionY = positionY + (distY * paramAnimation / 1000);
				el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0) rotate(0.02deg);`;
				requestAnimationFrame(setMouseParallaxStyle);
			}
			function mouseMoveParalax(wrapper = window) {
				wrapper.addEventListener("mousemove", function (e) {
					const offsetTop = el.getBoundingClientRect().top + window.scrollY;
					if (offsetTop >= window.scrollY || (offsetTop + el.offsetHeight) >= window.scrollY) {
						// Отримання ширини та висоти блоку
						const parallaxWidth = window.innerWidth;
						const parallaxHeight = window.innerHeight;
						// Нуль посередині
						const coordX = e.clientX - parallaxWidth / 2;
						const coordY = e.clientY - parallaxHeight / 2;
						// Отримуємо відсотки
						coordXprocent = coordX / parallaxWidth * 100;
						coordYprocent = coordY / parallaxHeight * 100;
					}
				});
			}
		});
	}
}
// Запускаємо
document.querySelector('[data-att-mouse]') ?
	window.addEventListener('load', new MousePRLX({})) : null




