const time = document.querySelector("#time");
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const resetBtn = document.querySelector("#reset");
const lapBtn = document.querySelector("#lap");
const clearBtn = document.querySelector("#clear");

let paused = true;
let startTime = 0;
let elapsedTime = 0;
let currentTime = 0;
let interval = 0;

const stopTimer = () => (paused = true);
const pad = (num) => (num < 10 ? "0" + num : num);

const clearLaps = () => {
	if (localStorage.getItem("lapTimes")) {
		localStorage.removeItem("lapTimes");
		document.querySelectorAll(".lap").forEach((lap) => lap.remove());
	}
};

function startTimer() {
	if (paused) {
		startTime = Date.now() - elapsedTime;
		interval = setInterval(updateTimer, 10);
		paused = false;
	}
}

function updateTimer() {
	if (paused) clearInterval(interval);
	currentTime = Date.now();
	elapsedTime = currentTime - startTime;
	const centiseconds = Math.floor(elapsedTime / 10) % 100;
	const seconds = Math.floor(elapsedTime / 1000) % 60;
	const minutes = Math.floor(elapsedTime / 60000) % 60;
	const hours = Math.floor(elapsedTime / 3600000) % 60;
	time.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`;
}

function resetTimer() {
	stopTimer();
	elapsedTime = 0;
	time.textContent = "00:00:00:00";
}

function lapTimer() {
	if (document.querySelectorAll(".lap").length < 10) {
		const lap = document.createElement("li");
		lap.classList.add("lap");
		lap.textContent = time.textContent;
		document.querySelector("#laps").prepend(lap);
		saveLaps();
	}
}

function saveLaps() {
	const lapTimes = [];
	document.querySelectorAll(".lap").forEach((lap) => lapTimes.push(lap.textContent));
	localStorage.setItem("lapTimes", JSON.stringify(lapTimes));
}

function loadLaps() {
	if (localStorage.getItem("lapTimes")) {
		const lapTimes = JSON.parse(localStorage.getItem("lapTimes"));
		lapTimes.forEach((lapTime) => {
			const lap = document.createElement("li");
			lap.classList.add("lap");
			lap.textContent = lapTime;
			document.querySelector("#laps").prepend(lap);
		});
	}
}

window.addEventListener("load", loadLaps);
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", lapTimer);
clearBtn.addEventListener("click", clearLaps);
