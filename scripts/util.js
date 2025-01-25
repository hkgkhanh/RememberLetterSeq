function getElm(str) {
    return document.getElementById(str);
}

function getTimeString(time) {
    let sec = time % 60;
	let mnt = Math.floor(time / 60);
    let str = "";

    str += (mnt < 10) ? "0" + mnt : mnt;
    str += ":";
    str += (sec < 10) ? "0" + sec : sec;

    return str;
}

function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMinBetween(num1, num2) {
    return num1 < num2 ? num1 : num2;
}

function getMaxBetween(num1, num2) {
    return num1 > num2 ? num1 : num2;
}

function getRandomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwx";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex].toUpperCase();
}
  