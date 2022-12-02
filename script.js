const time = document.querySelector("#time");
const lapList = document.querySelector("#laps");
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const resetBtn = document.querySelector("#reset");
const lapBtn = document.querySelector("#lap");
const clearBtn = document.querySelector("#clear");

// <==== Variables ====>

const savedLaps = localStorage.getItem("lapTimes");
let isPaused = true;
let startTime = 0;
let elapsedTime = 0;
let currentTime = 0;
let interval = 0;

// <==== Helper Functions ====>

//const pauseTimer = (bool) => (isPaused = bool); //! Dunno why it doesn't work
const pauseTimer = () => (isPaused = true);
const laps = () => document.querySelectorAll(".lap");
const pad = (num) => (num < 10 ? "0" + num : num);
const getTime = (division, modulus) => Math.floor(elapsedTime / division) % modulus;

// <--- Set the time in the DOM --->
const makeTime = () => {
	const centiseconds = getTime(10, 100);
	const seconds = getTime(1000, 60);
	const minutes = getTime(60000, 60);
	const hours = getTime(3600000, 60);
	time.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`;
};

// <--- Add a lap to the DOM --->
const addLap = (lapTime) => {
	const lap = document.createElement("li");
	lap.classList.add("lap");
	lap.textContent = lapTime;
	lapList.append(lap);
};

// <--- Save the laps to local storage --->
const saveLaps = () => {
	const lapTimes = [];
	laps().forEach((lap) => lapTimes.push(lap.textContent));
	localStorage.setItem("lapTimes", JSON.stringify(lapTimes));
};

// <--- Make the timer tick and update the DOM using the makeTime function --->
const updateTime = () => {
	if (isPaused === true) clearInterval(interval);
	currentTime = Date.now();
	elapsedTime = currentTime - startTime;
	makeTime();
};

// <==== Functions ====>

// <--- Start the timer unless it's already running --->
function startTimer() {
	if (isPaused === false) return;
	startTime = Date.now() - elapsedTime;
	interval = setInterval(updateTime, 10);
	isPaused = false;
}

// <--- Reset the timer --->
function resetTimer() {
	clearInterval(interval);
	elapsedTime = 0;
	time.textContent = "00:00:00:00";
	isPaused = true;
}

// <--- Clear all the laps from the DOM and local storage --->
function clearLaps() {
	localStorage.removeItem("lapTimes");
	laps().forEach((lap) => lap.remove());
}

// <--- Call the addLap and saveLaps functions to add a lap to the DOM and local storage --->
function lapTimer() {
	if (time.textContent === "00:00:00:00") return;
	if (lapList.children.length === 10) return;
	if (lapList.textContent.includes(time.textContent)) return; //? Does it make sense to not be able to add the same lap twice?
	addLap(time.textContent);
	saveLaps();
}

// <--- Load laps from local storage and adds them to the DOM --->
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
