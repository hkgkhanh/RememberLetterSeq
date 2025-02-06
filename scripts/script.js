var state = "idle"; // idle, memo, exec, done
var scrambles = [];
var sequenceArray = [];
var currentCubeInput = 0;
var tempInputArray = [];
var inputArray = [];
var memoIndex = 1;

function initScrambler() {
    // Initialize scramble generator
    scramblers["333"].initialize(null, Math);
}

function setState(s) {
    state = s;
    if (s == "idle") {
        getElm("start-memo-button").disabled = false;
        getElm("start-exec-button").disabled = true;
        getElm("input-field").disabled = true;
        getElm("finish-button").disabled = true;
        getElm("next-cube-button").disabled = true;
        getElm("memo-seq").innerHTML = "";
        getElm("memo-done").innerHTML = "";
        getElm("timer").innerHTML = "00:00";
        getElm("memo-time").innerHTML = "";
        getElm("result-container").innerHTML = "";
        getElm("cube-number").innerHTML = "";
        getElm("input-cube-field").value = 10;

    } else if (s == "memo") {
        getElm("start-memo-button").disabled = true;
        getElm("start-exec-button").disabled = false;
        getElm("input-field").disabled = true;
        getElm("finish-button").disabled = true;
        getElm("next-cube-button").disabled = true;
        getElm("memo-seq").innerHTML = "";
        getElm("memo-done").innerHTML = "";
        getElm("timer").innerHTML = "00:00";
        getElm("memo-time").innerHTML = "";
        getElm("result-container").innerHTML = "";
        memoIndex = 1;
        scrambles = [];
        sequenceArray = [];
        currentCubeInput = 0;
        tempInputArray = [];
        inputArray = [];

    } else if (s == "exec") {
        getElm("start-memo-button").disabled = true;
        getElm("start-exec-button").disabled = true;
        getElm("input-field").disabled = false;
        getElm("finish-button").disabled = false;
        getElm("next-cube-button").disabled = false;
        getElm("memo-seq").innerHTML = "";
        getElm("memo-done").innerHTML = "memo done!";
        getElm("cube-number").innerHTML = "cube " + (currentCubeInput + 1);
        getElm("result-container").innerHTML = "";

    } else if (s == "done") {
        getElm("start-memo-button").disabled = false;
        getElm("start-exec-button").disabled = true;
        getElm("input-field").disabled = true;
        getElm("finish-button").disabled = true;
        getElm("next-cube-button").disabled = true;
        getElm("memo-seq").innerHTML = "";
        getElm("memo-done").innerHTML = "memo done!";
        getElm("cube-number").innerHTML = "";
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
    let n = getElm("input-cube-field").value;

    for (let i = 0; i < n; i++) {
        scrambles.push(scramblers["333"].getRandomScramble().scramble_string.replace(/  /g, ' '));
    }

    for (let i = 0; i < n; i++) {
        scrambleCube(scrambles[i]);
        solveCube();

        let edgeCycleArr = getEdgeCycleSequence();
        let cornerCycleArr = getCornerCycleSequence();

        let array = edgeCycleArr.concat(cornerCycleArr);
        sequenceArray.push(array);
    }
}

function displayMemoSequence() {
    getElm("memo-seq").innerHTML = "";

    let slashCount = 0;
    let prevIsLetter = false;
    let tempSeqArr = [];
    for (let i = 0; i < sequenceArray.length; i++) {
        for (let j = 0; j < sequenceArray[i].length; j++) {
            tempSeqArr.push(sequenceArray[i][j]);
        }
    }

    let maxIndex = getMinBetween(memoIndex, tempSeqArr.length);

    if (memoIndex >= tempSeqArr.length) {
        getElm("memo-done").innerHTML = "memo done!";
    }

    for (let i = 0; i < maxIndex; i++) {
        if (tempSeqArr[i] != '/') {
            if (prevIsLetter == false) {
                getElm("memo-seq").innerHTML += " " + tempSeqArr[i];
                prevIsLetter = true;
            } else {
                getElm("memo-seq").innerHTML += tempSeqArr[i];
                prevIsLetter = false;
            }
        } else {
            getElm("memo-seq").innerHTML += " / ";
            prevIsLetter = false;
            slashCount++;

            if (slashCount != 0 && slashCount % 2 == 0) {
                getElm("memo-seq").innerHTML += "<br>";
            }
        }

        if (i == maxIndex - 1) {
            if (tempSeqArr[i + 1] == '/') {
                getElm("memo-seq").innerHTML += " / ";
                memoIndex++;

                if (memoIndex >= tempSeqArr.length) {
                    getElm("memo-done").innerHTML = "memo done!";
                }
            }
        }
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

    inputArray.push(tempInputArray);
    tempInputArray = [];
    currentCubeInput++;

    let successCount = 0;

    for (let m = 0; m < sequenceArray.length; m++) {

        let pairedArray = [];
        let splitPoint = 0;
        let  pair = "";
        for (let i = 0; i < sequenceArray[m].length; i++) {
            if (pair == "") {
                if (sequenceArray[m][i] != "/") pair += sequenceArray[m][i];
                else {
                    if (i != sequenceArray[m].length - 1) {
                        splitPoint = pairedArray.length - 1;
                    }
                }
            } else {
                if (sequenceArray[m][i] != "/") {
                    pair += sequenceArray[m][i];
                    pairedArray.push(pair);
                    pair = "";
                } else {
                    pairedArray.push(pair);
                    pair = "";
                    if (i != sequenceArray[m].length - 1) {
                        splitPoint = pairedArray.length - 1;
                    }
                }
            }
        }

        let n = getMaxBetween(pairedArray.length, inputArray[m].length);
        let count = 0;
        let table = document.createElement("table");

        let indexRow = document.createElement('tr');
        emptyCell = document.createElement('td');
        emptyCell.classList.add("bold");
        emptyCell.classList.add("hoverable");
        emptyCell.textContent = "Cube " + (m + 1);

        emptyCell.addEventListener("click", function (e) {
            confirm(scrambles[m]);
        });

        indexRow.appendChild(emptyCell);

        for (let i = 0; i < n; i++) {
            let cell = document.createElement('td');
            cell.textContent = (++count);
            indexRow.appendChild(cell);
        }

        let correctSequenceRow = document.createElement('tr');
        let correctCell = document.createElement('td');
        correctCell.classList.add("bold");
        correctCell.textContent = "Correct memo:";
        correctSequenceRow.appendChild(correctCell);

        for (let i = 0; i < n; i++) {
            let cell = document.createElement('td');
            let content = pairedArray[i];
            cell.textContent = pairedArray[i] == undefined ? "-" : content;

            if (i == splitPoint) {
                cell.style.borderRight = "1px solid #000";
            }

            correctSequenceRow.appendChild(cell);
        }

        let incorrectFound = false;

        let yourSequenceRow = document.createElement('tr');
        let yourCell = document.createElement('td');
        yourCell.classList.add("bold");
        yourCell.textContent = "Your memo:";
        yourSequenceRow.appendChild(yourCell);

        for (let i = 0; i < n; i++) {
            let cell = document.createElement('td');
            let content = inputArray[m][i];
            cell.textContent = inputArray[m][i] == undefined ? "-" : content;
            cell.classList.add("bg-green");

            if (i == splitPoint) {
                cell.style.borderRight = "1px solid #000";
            }

            yourSequenceRow.appendChild(cell);

            let correctContent = pairedArray[i];
            if (content !== correctContent) {
                incorrectFound = true;
            }

            if (incorrectFound) {
                cell.classList.remove("bg-green");
                cell.classList.add("bg-red");
            }
        }

        if (incorrectFound == false) successCount++;

        table.appendChild(indexRow);
        table.appendChild(correctSequenceRow);
        table.appendChild(yourSequenceRow);
        getElm("result-container").appendChild(table);
        table.style.border = "1px solid #000";
        table.style.borderCollapse = "collapse";
    }

    let scrambleShowNode = document.createElement("p");
    scrambleShowNode.textContent = "Click on 'Cube X' to see the scramble";
    getElm("result-container").insertBefore(scrambleShowNode, getElm("result-container").children[0]);

    let successRateNode = document.createElement("p");
    successRateNode.textContent = "Result: " + successCount + "/" + sequenceArray.length;
    getElm("result-container").insertBefore(successRateNode, getElm("result-container").children[0]);
}

function toNextCube() {
    inputArray.push(tempInputArray);
    tempInputArray = [];
    currentCubeInput++;

    getElm("cube-number").innerHTML = "cube " + (currentCubeInput + 1);

    if (currentCubeInput >= getElm("input-cube-field").value - 1) getElm("next-cube-button").disabled = true;
}