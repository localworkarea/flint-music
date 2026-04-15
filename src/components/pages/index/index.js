import {addLoadedAttr} from "@js/common/functions.js";

import './index.scss'

addLoadedAttr();

const plativka = document.querySelector(".plativka");

window.addEventListener("load", ()=> {
	setTimeout(() => {
		if (plativka) {
			plativka.classList.add('--continue-animation');
		}
	}, 2500);
});

document.addEventListener("DOMContentLoaded", () => {
	const plativkaDisc = document.querySelector(".plativka__plt img");
	const audio = document.getElementById("flintAudio");
	const lyricsWrap = document.querySelector("[data-lyrics-wrap]");
	const lyricsContainer = document.querySelector("[data-lyrics]");
	const progress = document.querySelector("[data-progress]");
	const currentTimeEl = document.querySelector("[data-current-time]");
	const remainingTimeEl = document.querySelector("[data-remaining-time]");
	const playButtons = document.querySelectorAll(".play-toggle");
  const flintPlayer = document.querySelector(".music-card");
  const framePack = document.querySelector(".flint-player");
  const frames = document.querySelectorAll(".flint-player__frame");
	const switchBtn = document.querySelector(".scroll-btn__wr");
  
	// Данные строк
	const lyricsData = [
		{ start: 0.00, end: 3.50, text: "Flint Flint Flint" },
		{ start: 3.51, end: 5.50, text: "Всі ми любим грінки" },
		{ start: 5.51, end: 7.00, text: "Грінки грінки Flint" },
		{ start: 7.01, end: 9.50, text: "З гарячими смаками" },
		{ start: 9.51, end: 11.00, text: "Запашний часник" },
		{ start: 11.01, end: 13.00, text: "Пікантні гострі джерки" },
		{ start: 13.01, end: 15.00, text: "Flintовські гострі джерки" },
		{ start: 15.01, end: 16.50, text: "Спайсі та томат" },
		{ start: 16.51, end: 19.00, text: "Flint Спайсі та томат" },
		{ start: 19.01, end: 21.00, text: "Хвилястий житній хлібчик" },
		{ start: 21.01, end: 23.00, text: "Брусочком житній хлібчик" },
		{ start: 23.01, end: 27.50, text: "Flint грінки грінки, ковтаю слинки" },
		{ start: 27.51, end: 30.00, text: "FLINTКРИВАЙ крафтові смаки" }
	];

  const framesData = [
  	{ start: 9.51, end: 11.00, frameIndex: 2 },  // чеснок
  	{ start: 11.51, end: 15.00, frameIndex: 0 }, // джерки
  	{ start: 15.01, end: 16.50, frameIndex: 1 }, // томат
  	{ start: 16.51, end: 19.00, frameIndex: 1 }, // Flint Спайсі та томат
  	// { start: 19.01, end: 21.00, frameIndex: 2 }, // хвилястий житній
  	// { start: 21.01, end: 23.00, frameIndex: 2 }  // брусочком житній
  ];


	let lyricEls = [];
	let activeIndex = -1;
	let isDraggingProgress = false;
	let rafId = null;
  let hasStartedPlayback = false;
  let activeFrameIndex = -1;
	let discAngle = 0;
	let discSpeed = 0;
	let discTargetSpeed = 0;
	let discLastTime = 0;
	let discRafId = null;
	let firstPlayDelayUsed = false;
	let firstPlayTimeoutId = null;
	// let hasCompletedFirstFullPlay = false;

	renderLyrics();
	updateLyricsBottomSpacing();
	bindEvents();
	updateButtonsState(false);
	updateTimeUI(0, 0);

	function renderLyrics() {
		lyricsContainer.innerHTML = lyricsData
			.map((item, index) => {
				return `<div class="music-card__line" data-line-index="${index}">${item.text}</div>`;
			})
			.join("");

		lyricEls = [...lyricsContainer.querySelectorAll(".music-card__line")];
	}

  function resetLyricsState() {
  	activeIndex = -1;

  	lyricEls.forEach((line) => {
  		line.classList.remove("is-past", "is-active");
  	});

  	lyricsContainer.style.transform = "translateY(0px)";
  	lyricsWrap?.classList.remove("--scroll");

  	resetFramesState();
  }

  function updateFramesState() {
  	if (!hasStartedPlayback) return;
      
  	const time = audio.currentTime;
  	let newFrameIndex = -1;
      
  	for (let i = 0; i < framesData.length; i++) {
  		const item = framesData[i];
  		if (time >= item.start && time <= item.end) {
  			newFrameIndex = item.frameIndex;
  			break;
  		}
  	}
  
  	if (newFrameIndex === activeFrameIndex) return;
  
  	activeFrameIndex = newFrameIndex;
  
  	frames.forEach((frame, index) => {
  		frame.classList.toggle("is-active", index === activeFrameIndex);
  	});
  }

  function resetFramesState() {
  	activeFrameIndex = -1;

  	frames.forEach((frame) => {
  		frame.classList.remove("is-active");
  	});
  }

	function bindEvents() {
		playButtons.forEach((button) => {
				button.addEventListener("click", togglePlayback);
		});

		audio.addEventListener("loadedmetadata", () => {
    	progress.max = audio.duration || 0;
    	updateTimeUI(audio.currentTime, audio.duration);
    	updateProgressUI();
    	resetLyricsState();
    });

		audio.addEventListener("play", () => {
    	hasStartedPlayback = true;
    	flintPlayer?.classList.add("--play");
      flintPlayer?.classList.remove("--pause");
			switchBtn?.classList.remove("--switch");
    	updateButtonsState(true);
    	startRAF();
			startDiscRotation();
    });

		audio.addEventListener("pause", () => {
      if (!audio.ended) {
	    	flintPlayer?.classList.add("--pause");
	    }
			updateButtonsState(false);
			stopRAF();
			pauseDiscRotation();
		});

	  audio.addEventListener("ended", () => {
    	updateButtonsState(false);
    	stopRAF();
    	hasStartedPlayback = false;
    	flintPlayer?.classList.remove("--play");
      flintPlayer?.classList.remove("--pause");
    	audio.currentTime = 0;
    	updateProgressUI();
    	updateTimeUI(audio.currentTime, audio.duration);
    	resetLyricsState();
			pauseDiscRotation();
			switchBtn?.classList.add("--switch");

			// if (!hasCompletedFirstFullPlay) {
			// 	hasCompletedFirstFullPlay = true;
			// 	switchBtn?.classList.add("--switch");
			// }
    });

		progress.addEventListener("input", () => {
    	isDraggingProgress = true;
    	const value = Number(progress.value);
    	const duration = audio.duration || 0;
    	const percent = duration > 0 ? (value / duration) * 100 : 0;
        
    	progress.style.setProperty("--progress-percent", `${percent}%`);
    	updateTimeUI(value, audio.duration);
    });

		progress.addEventListener("change", () => {
    	audio.currentTime = Number(progress.value);
    	isDraggingProgress = false;
    	updateProgressUI();
    	updateTimeUI(audio.currentTime, audio.duration);
    	updateLyricsState();
    	updateFramesState();
    });

		window.addEventListener("resize", () => {
			updateLyricsBottomSpacing();
			updateLyricsScroll(activeIndex);
		});
	}

	function togglePlayback() {
		if (!plativka.classList.contains('--active')) {
			plativka?.classList.add("--active");
		}
		if (!flintPlayer.classList.contains('--active')) {
			flintPlayer?.classList.add("--active");
		}
		if (!framePack.classList.contains('--active')) {
			framePack?.classList.add("--active");
		}
		
		if (audio.paused) {
			if (!firstPlayDelayUsed) {
				if (firstPlayTimeoutId) return;

				firstPlayDelayUsed = true;

				firstPlayTimeoutId = setTimeout(() => {
					firstPlayTimeoutId = null;
					audio.play();
				}, 800);
			} else {
				audio.play();
			}
		} else {
			audio.pause();
		}
	}

	function startRAF() {
		stopRAF();

		const tick = () => {
			if (!isDraggingProgress) {
    		updateProgressUI();
    		updateTimeUI(audio.currentTime, audio.duration);
    		updateLyricsState();
    		updateFramesState();
    	}

			if (!audio.paused) {
				rafId = requestAnimationFrame(tick);
			}
		};

		rafId = requestAnimationFrame(tick);
	}

	function stopRAF() {
		if (rafId) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	}

	function updateButtonsState(isPlaying) {
		playButtons.forEach((button) => {
			button.classList.toggle("is-playing", isPlaying);
		});

		plativka?.classList.toggle("is-playing", isPlaying);
	}

	function updateProgressUI() {
  	const current = audio.currentTime || 0;
  	const duration = audio.duration || 0;
  	const percent = duration > 0 ? (current / duration) * 100 : 0;

  	progress.value = current;
  	progress.style.setProperty("--progress-percent", `${percent}%`);
  }

	function updateTimeUI(current, duration) {
		const safeDuration = Number.isFinite(duration) ? duration : 0;
		const remaining = Math.max(safeDuration - current, 0);

		currentTimeEl.textContent = formatTime(current);
		remainingTimeEl.textContent = `-${formatTime(remaining)}`;
	}

	function updateLyricsState() {
    if (!hasStartedPlayback) return;
	const time = audio.currentTime;
	let newActiveIndex = -1;

	for (let i = 0; i < lyricsData.length; i++) {
		const item = lyricsData[i];
		if (time >= item.start && time <= item.end) {
			newActiveIndex = i;
			break;
		}
	}

	// если активная строка не изменилась — ничего не делаем
	if (newActiveIndex === activeIndex) return;

	activeIndex = newActiveIndex;

	lyricEls.forEach((line, index) => {
		line.classList.toggle("is-past", index < activeIndex);
		line.classList.toggle("is-active", index === activeIndex);
	});

	updateLyricsScroll(activeIndex);
}

	// function updateLyricsScroll(index) {
  // 	if (index < 0 || !lyricEls[index] || !lyricsWrap) {
  // 		lyricsWrap?.classList.remove("--scroll");
  // 		lyricsContainer.style.transform = "translateY(0px)";
  // 		return;
  // 	}

  // 	const activeLine = lyricEls[index];
  // 	const nextLine = lyricEls[index + 1];

  // 	const wrapHeight = lyricsWrap.clientHeight;
  // 	const activeTop = activeLine.offsetTop;
  // 	const activeHeight = activeLine.offsetHeight;

  // 	let targetY;

  // 	if (nextLine) {
  // 		const nextHeight = nextLine.offsetHeight;
  // 		const targetBottomZone = wrapHeight - nextHeight;
  // 		targetY = activeTop - (targetBottomZone - activeHeight);
  // 	} else {
  // 		targetY = activeTop - (wrapHeight - activeHeight);
  // 	}

  // 	const maxScroll = Math.max(lyricsContainer.scrollHeight - wrapHeight, 0);
  // 	targetY = Math.max(0, Math.min(targetY, maxScroll));

  // 	lyricsContainer.style.transform = `translateY(-${targetY}px)`;
  // 	lyricsWrap.classList.toggle("--scroll", targetY > 0);
  // }

	function updateLyricsScroll(index) {
		if (index < 0 || !lyricEls[index] || !lyricsWrap) {
			lyricsWrap?.classList.remove("--scroll");
			lyricsContainer.style.transform = "translateY(0px)";
			return;
		}

		const activeLine = lyricEls[index];
		const nextLine = lyricEls[index + 1];

		const wrapHeight = lyricsWrap.clientHeight;
		const activeTop = activeLine.offsetTop;
		const activeHeight = activeLine.offsetHeight;

		const styles = window.getComputedStyle(lyricsContainer);
		const gap = parseFloat(styles.rowGap || styles.gap || 0) || 0;

		let reserveHeight;

		if (nextLine) {
			// если есть следующая строка — оставляем под неё место снизу
			reserveHeight = nextLine.offsetHeight + gap;
		} else {
			// если это последняя строка — всё равно оставляем одно "место строки" снизу
			reserveHeight = activeHeight + gap;
		}

		const targetBottomZone = wrapHeight - reserveHeight;
		let targetY = activeTop - (targetBottomZone - activeHeight);

		const maxScroll = Math.max(lyricsContainer.scrollHeight - wrapHeight, 0);
		targetY = Math.max(0, Math.min(targetY, maxScroll));

		lyricsContainer.style.transform = `translateY(-${targetY}px)`;
		lyricsWrap.classList.toggle("--scroll", targetY > 0);
	}

	function updateLyricsBottomSpacing() {
		if (!lyricEls.length || !lyricsContainer) return;

		const styles = window.getComputedStyle(lyricsContainer);
		const gap = parseFloat(styles.rowGap || styles.gap || 0) || 0;
		const lineHeight = lyricEls[0].offsetHeight;

		lyricsContainer.style.paddingBottom = `${lineHeight + gap}px`;
	}

	function formatTime(seconds) {
		const totalSeconds = Math.max(0, Math.floor(seconds || 0));
			const mins = Math.floor(totalSeconds / 60);
			const secs = totalSeconds % 60;
			return `${mins}:${String(secs).padStart(2, "0")}`;
	}
	
	function startDiscRotation() {
		discTargetSpeed = 24;
		
		if (discRafId) return;
		
		discLastTime = performance.now();
		discRafId = requestAnimationFrame(updateDiscRotation);
	}
	
	function pauseDiscRotation() {
		discTargetSpeed = 0;
	
		if (!discRafId) {
			discLastTime = performance.now();
			discRafId = requestAnimationFrame(updateDiscRotation);
		}
	}
	
	function updateDiscRotation(now) {
		const delta = (now - discLastTime) / 1000;
		discLastTime = now;
	
		const easing = 1.8;
		discSpeed += (discTargetSpeed - discSpeed) * Math.min(delta * easing, 1);
	
		discAngle += discSpeed * delta;
	
		if (plativkaDisc) {
			plativkaDisc.style.transform = `rotate(${discAngle}deg)`;
		}
	
		const isStillMoving = Math.abs(discSpeed) > 0.01;
		const needsToKeepRunning = isStillMoving || discTargetSpeed !== 0;
	
		if (needsToKeepRunning) {
			discRafId = requestAnimationFrame(updateDiscRotation);
		} else {
			discSpeed = 0;
			discRafId = null;
		}
	}
});