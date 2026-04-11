
import { FLS } from "@js/common/functions.js";
// Docs: https://www.npmjs.com/package/gsap
import { gsap, ScrollTrigger, Draggable, MotionPathPlugin } from "gsap/all";
// Стилі модуля
import './gsap.scss'

function gsapInit() {
	// Example
	const chars = document.querySelectorAll('[data-att-splittype][data-att-gsap] .char')
	console.log(chars);
	gsap.from(chars, {
		opacity: 0,
		y: 20,
		duration: 0.5,
		stagger: { amount: 0.5 },
	})
}

document.querySelector('[data-att-gsap]') ?
	window.addEventListener('load', gsapInit) : null


