document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (state == "memo") {
            memoIndex++;
            displayMemoSequence();

        } else if (state == "exec") {
            let input = getElm("input-field").value;

            if (input.length >= 2) {
                inputArray.push(input[0]);
                inputArray.push(input[1]);
                getElm("input-field").value = "";
            }
        }
    }
});

getElm("input-field").addEventListener('input', (event) => {
    let value = event.target.value; 

    getElm("input-field").value = value.toUpperCase().trim().slice(0, 2);
});