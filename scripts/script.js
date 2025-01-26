var state = "idle"; // idle, memo, exec, done
var sequenceArray = [];
var inputArray = [];
var memoIndex = 1;

function setState(s) {
    state = s;
    if (s == "idle") {
        getElm("start-memo-button").disabled = false;
        getElm("start-exec-button").disabled = true;
        getElm("input-field").disabled = true;
        getElm("finish-button").disabled = true;
        getElm("memo-seq").innerHTML = "";
        getElm("memo-done").innerHTML = "";
        getElm("timer").innerHTML = "00:00";
        getElm("memo-time").innerHTML = "";
        getElm("result-container").innerHTML = "";
        getElm("input-cube-field").value = 10;

    } else if (s == "memo") {
        getElm("start-memo-button").disabled = true;
        getElm("start-exec-button").disabled = false;
        getElm("input-field").disabled = true;
        getElm("finish-button").disabled = true;
        getElm("memo-seq").innerHTML = "";
        getElm("memo-done").innerHTML = "";
        getElm("timer").innerHTML = "00:00";
        getElm("memo-time").innerHTML = "";
        getElm("result-container").innerHTML = "";
        memoIndex = 1;
        sequenceArray = [];
        inputArray = [];

    } else if (s == "exec") {
        getElm("start-memo-button").disabled = true;
        getElm("start-exec-button").disabled = true;
        getElm("input-field").disabled = false;
        getElm("finish-button").disabled = false;
        getElm("memo-seq").innerHTML = "";
        getElm("memo-done").innerHTML = "memo done!";
        // getElm("timer").innerHTML = "";
        // getElm("memo-time").innerHTML = "";
        getElm("result-container").innerHTML = "";

    } else if (s == "done") {
        getElm("start-memo-button").disabled = false;
        getElm("start-exec-button").disabled = true;
        getElm("input-field").disabled = true;
        getElm("finish-button").disabled = true;
        getElm("memo-seq").innerHTML = "";
        getElm("memo-done").innerHTML = "memo done!";
        // getElm("timer").innerHTML = "";
        // getElm("memo-time").innerHTML = "";
        getElm("result-container").innerHTML = "";
    }
}

function startMemo() {
    setState("memo");

    genSequence();
    displayMemoSequence();

    let date = new Date();
    startTime = date.getTime();
    timerUpdate = setInterval(timing, 1000);
}

function genSequence() {
    // let n = getRandomInteger(210, 230);
    // n = getMinBetween(n, 220);
    // if (n % 2 == 1) n++; // always even

    let n = getElm("input-cube-field").value * 10 * 2;

    for (let i = 0; i < n; i++) {
        let letter = getRandomLetter();
        sequenceArray.push(letter);
    }
}

function displayMemoSequence() {
    getElm("memo-seq").innerHTML = "";

    let maxIndex = getMinBetween(memoIndex, sequenceArray.length);

    if (memoIndex >= sequenceArray.length) {
        getElm("memo-done").innerHTML = "memo done!";
    }

    for (let i = 0; i < maxIndex; i++) {
        getElm("memo-seq").innerHTML += sequenceArray[i] + " ";
        
        if ((i + 1) % 20 == 0) getElm("memo-seq").innerHTML += "<br>";
    }

    getElm("memo-seq").scrollTop = getElm("memo-seq").scrollHeight;
}

function startExec() {
    setState("exec");

    let currTime = new Date().getTime();
    let time = currTime - startTime;
	time = Math.floor(time / 1000);

    getElm("memo-time").innerHTML = "memo: " + getTimeString(time);
    getElm("input-field").focus();
}

function finishAttempt() {
    setState("done");
    clearInterval(timerUpdate);

    let n = getMaxBetween(sequenceArray.length, inputArray.length);
    let count = 0;
    let table = document.createElement("table");

    let cubeIndexRow = document.createElement('tr');
    let emptyCell = document.createElement('td');
    cubeIndexRow.appendChild(emptyCell);

    for (let i = 0; i < n; i += 2) {
        let cell = document.createElement('td');
        cell.textContent = (i % 20 == 0) ? Math.round(i / 20 + 1) : "";
        cubeIndexRow.appendChild(cell);
    }

    let indexRow = document.createElement('tr');
    emptyCell = document.createElement('td');
    indexRow.appendChild(emptyCell);

    for (let i = 0; i < n; i += 2) {
        let cell = document.createElement('td');
        cell.textContent = (++count);
        indexRow.appendChild(cell);
    }

    let correctSequenceRow = document.createElement('tr');
    let correctCell = document.createElement('td');
    correctCell.classList.add("bold");
    correctCell.textContent = "Correct memo:";
    correctSequenceRow.appendChild(correctCell);

    for (let i = 0; i < n; i += 2) {
        let cell = document.createElement('td');
        let content = sequenceArray[i] + sequenceArray[i + 1];
        cell.textContent = sequenceArray[i] == undefined ? "-" : content;
        correctSequenceRow.appendChild(cell);
    }

    let incorrectFound = false;

    let yourSequenceRow = document.createElement('tr');
    let yourCell = document.createElement('td');
    yourCell.classList.add("bold");
    yourCell.textContent = "Your memo:";
    yourSequenceRow.appendChild(yourCell);

    for (let i = 0; i < n; i += 2) {
        let cell = document.createElement('td');
        let content = inputArray[i] + inputArray[i + 1];
        cell.textContent = inputArray[i] == undefined ? "-" : content;
        yourSequenceRow.appendChild(cell);

        let correctContent = sequenceArray[i] + sequenceArray[i + 1];
        if (content !== correctContent) {
            incorrectFound = true;
        }

        if (incorrectFound) {
            cell.classList.add("bg-red");
        }
    }

    table.appendChild(cubeIndexRow);
    table.appendChild(indexRow);
    table.appendChild(correctSequenceRow);
    table.appendChild(yourSequenceRow);
    getElm("result-container").appendChild(table);
}