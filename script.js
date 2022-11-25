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

//const pauseTimer = (bool) => (paused = bool); //! Dunno why it doesn't work
const pauseTimer = () => (paused = true);
const laps = () => document.querySelectorAll(".lap");
const pad = (num) => (num < 10 ? "0" + num : num);
const getTime = (division, modulus) => Math.floor(elapsedTime / division) % modulus;

const makeTime = () => {
	const centiseconds = getTime(10, 100);
	const seconds = getTime(1000, 60);
	const minutes = getTime(60000, 60);
	const hours = getTime(3600000, 60);
	time.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`;
};

const addLap = (lapTime) => {
	const lap = document.createElement("li");
	lap.classList.add("lap");
	lap.textContent = lapTime;
	lapList.append(lap);
};

const saveLaps = () => {
	const lapTimes = [];
	laps().forEach((lap) => lapTimes.push(lap.textContent));
	localStorage.setItem("lapTimes", JSON.stringify(lapTimes));
};

const updateTime = () => {
	if (paused === true) clearInterval(interval);
	currentTime = Date.now();
	elapsedTime = currentTime - startTime;
	makeTime();
};

// <==== Functions ====>

function startTimer() {
	if (paused === false) return;
	startTime = Date.now() - elapsedTime;
	interval = setInterval(updateTime, 10);
	paused = false;
}

function resetTimer() {
	clearInterval(interval);
	elapsedTime = 0;
	time.textContent = "00:00:00:00";
	paused = true;
}

function clearLaps() {
	localStorage.removeItem("lapTimes");
	laps().forEach((lap) => lap.remove());
}

function lapTimer() {
	if (time.textContent === "00:00:00:00") return;
	if (lapList.children.length === 11) return;
	if (lapList.textContent.includes(time.textContent)) return; //? Does it make sense to not be able to add the same lap twice?
	addLap(time.textContent);
	saveLaps();
}

function loadLaps() {
	if (!savedLaps) return;
	const lapTimes = JSON.parse(savedLaps);
	lapTimes.forEach((lapTime) => addLap(lapTime));
}

// <==== Event Listeners ====>

window.addEventListener("load", loadLaps);
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", lapTimer);
clearBtn.addEventListener("click", clearLaps);
