const time = document.querySelector("#time");
const lapList = document.querySelector("#laps");
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const resetBtn = document.querySelector("#reset");
const lapBtn = document.querySelector("#lap");
const clearBtn = document.querySelector("#clear");

// <==== Variables ====>

const savedLaps = localStorage.getItem("lapTimes");
let paused = true;
let startTime = 0;
let elapsedTime = 0;
let currentTime = 0;
let interval = 0;

// <==== Helper Functions ====>

const stopTimer = () => (paused = true);
const pad = (num) => (num < 10 ? "0" + num : num);
const getCentiseconds = () => Math.floor(elapsedTime / 10) % 100;
const getSeconds = () => Math.floor(elapsedTime / 1000) % 60;
const getMinutes = () => Math.floor(elapsedTime / 60000) % 60;
const getHours = () => Math.floor(elapsedTime / 3600000) % 60;

// <==== Functions ====>

function updateTime() {
	const centiseconds = getCentiseconds();
	const seconds = getSeconds();
	const minutes = getMinutes();
	const hours = getHours();
	time.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`;
}

function updateTimer() {
	if (paused) clearInterval(interval);
	currentTime = Date.now();
	elapsedTime = currentTime - startTime;
	updateTime();
}

function startTimer() {
	if (!paused) return;
	startTime = Date.now() - elapsedTime;
	interval = setInterval(updateTimer, 10);
	paused = false;
}

function resetTimer() {
	stopTimer();
	elapsedTime = 0;
	time.textContent = "00:00:00:00";
}

function clearLaps() {
	if (!savedLaps) return;
	localStorage.removeItem("lapTimes");
	document.querySelectorAll(".lap").forEach((lap) => lap.remove());
}

function saveLaps() {
	const lapTimes = [];
	document.querySelectorAll(".lap").forEach((lap) => lapTimes.push(lap.textContent));
	localStorage.setItem("lapTimes", JSON.stringify(lapTimes));
}

function lapTimer() {
	if (time.textContent === "00:00:00:00") return;
	if (lapList.children.length === 11) return;
	const lap = document.createElement("li");
	lap.classList.add("lap");
	lap.textContent = time.textContent;
	lapList.append(lap);
	saveLaps();
}

function addLap(lapTime) {
	const lap = document.createElement("li");
	lap.classList.add("lap");
	lap.textContent = lapTime
	lapList.append(lap);
}

function loadLaps() {
	if (!savedLaps) return;
	const lapTimes = JSON.parse(localStorage.getItem("lapTimes"));
	lapTimes.forEach((lapTime) => addLap(lapTime));
}

// <==== Event Listeners ====>

window.addEventListener("load", loadLaps);
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", lapTimer);
clearBtn.addEventListener("click", clearLaps);
