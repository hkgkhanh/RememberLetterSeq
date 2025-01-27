document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (state == "memo") {
            memoIndex++;
            displayMemoSequence();

        } else if (state == "exec") {
            let input = getElm("input-field").value;

            if (input.length >= 2) {
                if (input[1] != "/") {
                    tempInputArray.push(input[0] + "" + input[1]);
                } else {
                    tempInputArray.push(input[0] + "");
                }
                getElm("input-field").value = "";
            }
        }
    }
});

getElm("input-field").addEventListener('input', (event) => {
    let value = event.target.value; 

    getElm("input-field").value = value.toUpperCase().trim().slice(0, 2);
});