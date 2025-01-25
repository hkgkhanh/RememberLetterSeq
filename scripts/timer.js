var startTime = 0;
var endTime = 0;
var timerUpdate;

function timing() {
	let currTime = new Date().getTime();
	let time = currTime - startTime;
	time = Math.floor(time / 1000);

    getElm("timer").innerHTML = getTimeString(time);
};