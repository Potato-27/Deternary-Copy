
// variables
let canvasWidth = 1000;
let canvasHeight = 700;
let canvas;
let ctx;
let bgCtx;
let bgCanvas;

let accumulator = [0, '000000000'];
let instructionPointer = [0, '000000000'];
let instructionRegister = [0, 0, '000000', '000'];


let addressRegister = [0, '000000000'];
let dataRegister = [0, 0, '000000', '000'];
let stackPointer = [0, '000000000'];

let input = [0, '000'];
let output = [0, '000'];
let memory = [];
let selectedInputField = 'instructionPointer';

let running = false;
let inputNeeded = false;

let lastStepTime = performance.now(); // Start with a real number
const stepDelay = 500; 

let zero = false;
let overflow = false;
let underflow = false;

let stack = [];
let temp;

let testing = false;
let taskIncrementer = [0, 0, 0];

let task0TestCases = [];
let task1TestCases = [];
let task2TestCases = [];
let task3TestCases = [];
let task4TestCases = [];

// onload
window.onload = function(){
    // setting up canvas
    loadEmulatorState();
    
    canvas = document.getElementById("fgCanvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");

    bgCanvas = document.getElementById('bgCanvas');
    bgCanvas.width = canvasWidth;
    bgCanvas.height = canvasHeight;
    bgCtx = bgCanvas.getContext("2d");

    
    // handling input
    window.addEventListener('keyup', e => {
        
        // arrow left
        if (e.key === 'ArrowLeft'){
            if(selectedInputField == 'instructionPointer'){
                selectedInputField = 'input';
            } else if (selectedInputField == 'instructionRegister1') {
                selectedInputField = 'instructionRegister2';
            } else if (selectedInputField == 'instructionRegister2'){
                selectedInputField = 'instructionPointer';
            } else if (selectedInputField == 'input'){
                selectedInputField = 'instructionRegister1';
            }
        }
        // arrow right
        else if (e.key === 'ArrowRight'){
            if(selectedInputField == 'instructionPointer'){
                selectedInputField = 'instructionRegister2';
            } else if (selectedInputField == 'instructionRegister1') {
                selectedInputField = 'input';
            } else if (selectedInputField == 'instructionRegister2'){
                selectedInputField = 'instructionRegister1';
            } else if (selectedInputField == 'input'){
                selectedInputField = 'instructionPointer';
            }
        }
        // d
        else if (e.key === 'd'){
            if(selectedInputField == 'instructionPointer'){
                instructionPointer[0] += 1;
            } else if (selectedInputField == 'instructionRegister1') {
                memory[instructionPointer[0]][4] += 1;
            } else if (selectedInputField == 'instructionRegister2'){
                if (memory[instructionPointer[0]][2] == 26)
                    memory[instructionPointer[0]][2] = 0;
                else
                    memory[instructionPointer[0]][2] += 1;
            } else if (selectedInputField == 'input' && inputNeeded){
                input[0] += 1;
            }
        }
        // a
        else if (e.key === 'a'){
            if(selectedInputField == 'instructionPointer' && instructionPointer[0] > 0){
                instructionPointer[0] -= 1;
            } else if (selectedInputField == 'instructionRegister1' && memory[instructionPointer[0]][4] > 0) {
                memory[instructionPointer[0]][4] -= 1;
            } else if (selectedInputField == 'instructionRegister2'){
                if (memory[instructionPointer[0]][2] == 0)
                    memory[instructionPointer[0]][2] = 26;
                else
                    memory[instructionPointer[0]][2] -= 1;
            } else if (selectedInputField == 'input' && input[0] >= 0 && inputNeeded){
                input[0] -= 1;
            }
        } 
        // w
        else if (e.key === 'w'){
            if (testing){
                testing = false;
            } else {
                testing = true;
            }
        }
        // h
        else if (e.key == 'h'){
            if (running){
                running = false;
            } else {
                running = true;
            }
            if (inputNeeded){
                inputNeeded = false;
                accumulator[0] = input[0];
                instructionPointer[0] += 1;
                lastStepTime = performance.now();
            }
            
        }
    })

    //setting up memory
    for (let i = 0; i < 729; i++){
        memory.push([i, '000', 0, '0', 0, '00']);
    }

    // creating test cases and expected results
    
    let randInt1;
    let randInt2;
    let answer;
    // task 0
    for (let i = 0; i < 5; i++){
        randInt1 = getRandomInt(0, 728);
        randInt2 = getRandomInt(0, 728);

        if (randInt1 >= randInt2){
            answer = randInt1;
        } else {
            answer = randInt2;
        }
        task0TestCases.push([randInt1, randInt2, answer]);
    }

    // task 1
    for (let i = 0; i < 5; i++){
        randInt1 = getRandomInt(0, 255);
        answer = Math.floor(Math.sqrt(randInt1));
        task1TestCases.push([randInt1, answer]);
    }

    // task 2
    for (let i = 0; i < 5; i++){
        randInt1 = getRandomInt(0, 728);
        randInt2 = getRandomInt(0, 728);
        
        if (randInt1 > randInt2){
            for (let j = randInt1; j >= 0; j--){
                if (randInt1 % j == 0 && randInt2 % j == 0){
                    answer = j;
                }
            }
        } else if (randInt1 < randInt2){
            for (let j = randInt1; j >= 0; j--){
                if (randInt1 % j == 0 && randInt2 % j == 0){
                    answer = j;
                }
            }
        } else {
            answer = randInt1;
        }

        task2TestCases.push([randInt1, randInt2, answer]);
    }
    
    // task 3
    let current
    for (let i = 0; i < 5; i++){
        randInt1 = getRandomInt(100, 728);

        current = randInt1;
        task3TestCases.push([randInt1]);
        for (let j = 0; j < 6; j++){
            task3TestCases[i].push(current % 3);
            current = Math.floor(current / 3);
        }
    }

    // task 4
    for (let i = 0; i < 5; i++) {
        // Explicitly declare all variables using let to prevent global leaks
        randInt1 = getRandomInt(100, 727);
        current = randInt1;
        answer = current;
        let primeFound = false;

        while (!primeFound) {
            let isPrime = true;

            // Clean boundary check using <= instead of adding +1 to a float
            let limit = Math.floor(Math.sqrt(current));
            for (let j = 2; j <= limit; j++) {
                if (current % j === 0) {
                    isPrime = false;
                    break;
                }
            }  

            if (isPrime) {
                answer = current;
                primeFound = true; // This will break the while loop cleanly
            } else {
                current += 1; // Only move to the next number if the current one failed
            }
        }
        task4TestCases.push([randInt1, answer]);
    }



    


    drawBG();
    requestAnimationFrame(update);
}


function update(currentTime) {
    if (!currentTime) {
        currentTime = performance.now();
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //drawBG();
    updateVisualNumbers();

    if (running) {
        // Now currentTime is guaranteed to be a number
        if (currentTime - lastStepTime >= stepDelay) {
            runCommand(memory[instructionPointer[0]][2], memory[instructionPointer[0]][4]);

            // Reset the timer
            lastStepTime = currentTime;
        }
    }



    requestAnimationFrame(update);
}


function drawBG(){ 
    bgCtx.fillStyle = 'rgb(20, 20, 20)'
    bgCtx.shadowBlur = 0;
    bgCtx.lineWidth = 0;
    // big box with all the values
    bgCtx.fillRect(30, 30, 500, 500);
    // the left one
    bgCtx.fillRect(30, 550, 240, 120);
    // the right one
    bgCtx.fillRect(290, 550, 240, 120);
    // memory box
    bgCtx.fillRect(800, 30, 180, 600);

    // input
    bgCtx.fillStyle = 'rgb(0,0,0)';
    bgCtx.fillRect(40, 560, 78, 46);

    // output
    bgCtx.fillRect(300, 560, 78, 46);

    // memory box shenanigans
    bgCtx.fillStyle = 'rgb(0,0,0)';
    bgCtx.fillRect(810, 40, 75, 580);
    bgCtx.fillRect(895, 40, 75, 580);
    bgCtx.fillStyle = 'rgb(20, 20, 20)'
    for (let i = 0; i < 10; i++){
        bgCtx.fillRect(810, 86 + 56*i, 160, 10);
    }
    bgCtx.fillStyle = 'rgb(255,255,0)'
    bgCtx.fillRect(805, 35, 170, 5);
    bgCtx.fillRect(805, 40, 5, 50);
    bgCtx.fillRect(970, 40, 5, 50);
    bgCtx.fillRect(805, 90, 170, 5);

    // big box back screen things ig
    bgCtx.fillStyle = 'rgb(30,30,30)';
    bgCtx.fillRect(40, 40, 60, 60);
    bgCtx.fillRect(40, 110, 60, 60);
    bgCtx.fillRect(40, 180, 60, 60);
    bgCtx.fillRect(40, 250, 60, 60);
    bgCtx.fillRect(40, 320, 60, 60);
    bgCtx.fillRect(40, 390, 60, 60);

    bgCtx.fillStyle = 'rgb(0,0,0)';
    bgCtx.fillRect(120, 45, 390, 50);
    bgCtx.fillRect(120, 115, 390, 50);
    bgCtx.fillRect(120, 185, 390, 50);
    bgCtx.fillRect(120, 255, 390, 50);
    bgCtx.fillRect(120, 325, 390, 50);
    bgCtx.fillRect(120, 395, 390, 50);

    // Flag box
    bgCtx.fillStyle = 'rgb(20, 20, 20)'
    bgCtx.fillRect(550, 80, 230, 180);
    bgCtx.fillRect(580, 230, 170, 40);
    
    bgCtx.fillStyle = 'rgb(30,30,30)';
    bgCtx.fillRect(570, 100, 190, 140);

    bgCtx.fillStyle = 'rgb(25,25,25)';
    bgCtx.fillRect(590, 230, 150, 30);

    bgCtx.fillStyle = 'rgb(35,35,35)';
    bgCtx.fillRect(595, 235, 140, 20);

    bgCtx.fillStyle = 'rgb(10,10,10)';
    bgCtx.fillRect(610, 240, 10, 10);
    bgCtx.fillRect(710, 240, 10, 10);
    bgCtx.fillRect(660, 240, 10, 10);

    // testing system
    bgCtx.fillStyle = 'rgb(20, 20, 20)'
    bgCtx.fillRect(550, 400, 70, 120);
    bgCtx.fillRect(620, 430, 160, 60);

    bgCtx.fillStyle = 'rgb(0,0,0)';
    bgCtx.fillRect(555, 405, 60, 110);
    bgCtx.fillRect(623, 440, 150, 40);



    // numbers in the flag box
    bgCtx.fillStyle = 'rgb(20,20,20)';
    bgCtx.fillRect(580, 120, 50, 5);
    bgCtx.fillRect(580, 125, 5, 95);
    bgCtx.fillRect(625, 125, 5, 95);

    bgCtx.fillRect(662, 120, 5, 95);
    bgCtx.fillRect(640, 215, 50, 5);
    bgCtx.fillRect(640, 170, 5, 45);
    bgCtx.fillRect(685, 170, 5, 45);
    bgCtx.fillRect(640, 120, 50, 5);

    bgCtx.fillRect(700, 120, 50, 5);
    bgCtx.fillRect(722, 125, 5, 95);
    bgCtx.fillRect(700, 125, 5, 45);
    bgCtx.fillRect(745, 125, 5, 45);
    bgCtx.fillRect(700, 215, 50, 5);


    // dim indicators
    bgCtx.fillStyle = 'rgb(46, 46, 46)';
    bgCtx.fillRect(261, 170, 68, 3);
    bgCtx.fillRect(343, 170, 68, 3);
    bgCtx.fillRect(425, 170, 68, 3);
    bgCtx.fillRect(261, 240, 68, 3);
    bgCtx.fillRect(343, 240, 68, 3);
    bgCtx.fillRect(425, 240, 68, 3);
    bgCtx.fillRect(46, 610, 66, 4);
    bgCtx.fillRect(306, 610, 66, 4);
}

function drawNum(x, y, digit, color){
    // numbers are 18x40
    //ctx.globalCompositeOperation = 'lighter'; 
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 10;
    ctx.fillStyle = color;

    if (digit == 0){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y+2, 2, 38);
        ctx.fillRect(x+16, y+2, 2, 38);
    } else if (digit == 1){
        ctx.fillRect(x, y, 2, 19);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x+16, y+21, 2, 19);
    } else if (digit == 2){
        ctx.fillRect(x+16, y, 2, 19);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x, y+21, 2, 19);
    } else if (digit == 3){
        ctx.fillRect(x, y, 2, 40);
        ctx.fillRect(x+2, y+19, 16, 2);
    } else if (digit == 4){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x+16, y+2, 2, 17);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x, y+38, 18, 2);
    } else if (digit == 5){
        ctx.fillRect(x, y, 2, 38);
        ctx.fillRect(x, y+38, 18, 2);
        ctx.fillRect(x+16, y, 2, 38);
    } else if (digit == 6){
        ctx.fillRect(x, y+38, 18, 2);
        ctx.fillRect(x+16, y, 2, 38);
    } else if (digit == 7){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x, y+38, 18, 2);
        ctx.fillRect(x+8, y, 2, 40);
    } else if (digit == 8){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x+16, y, 2, 38);
        ctx.fillRect(x, y+38, 18, 2);
    } else if (digit == 9){
        ctx.fillRect(x+16, y, 2, 19);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x, y+21, 2, 17);
        ctx.fillRect(x, y+38, 18, 2);
    } else if (digit == 10){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y+2, 2, 18);
        ctx.fillRect(x+16, y+2, 2, 38);
    } else if (digit == 11){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x, y+38, 18, 2);
    } else if (digit == 12){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x, y+38, 18, 2);
        ctx.fillRect(x, y+21, 2, 17);
    } else if (digit == 13){
        ctx.fillRect(x, y, 2, 38);
        ctx.fillRect(x+16, y, 2, 38);
    } else if (digit == 14){
        ctx.fillRect(x, y+20, 2, 18);
        ctx.fillRect(x+16, y+20, 2, 18);
        ctx.fillRect(x+8, y, 2, 38);
        ctx.fillRect(x, y+38, 18, 2);
    } else if (digit == 15){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x, y+38, 18, 2);
        ctx.fillRect(x, y+2, 2, 17);
        ctx.fillRect(x+16, y+2, 2, 17);
        ctx.fillRect(x, y+21, 2, 17);
    } else if (digit == 16){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x+16, y+2, 2, 17);
        ctx.fillRect(x, y+21, 2, 19);
    } else if (digit == 17){
        ctx.fillRect(x, y, 8, 2);
        ctx.fillRect(x+10, y+19, 8, 2);
        ctx.fillRect(x, y, 2, 40);
        ctx.fillRect(x+8, y, 2, 40);
        ctx.fillRect(x+16, y, 2, 40);
    } else if (digit == 18){
        ctx.fillRect(x, y, 2, 40);
        ctx.fillRect(x+2, y, 6, 2);
        ctx.fillRect(x+8, y, 2, 21);
        ctx.fillRect(x+10, y+19, 6, 2);
        ctx.fillRect(x+16, y, 2, 21);
    } else if (digit == 19){
        ctx.fillRect(x, y, 2, 40);
        ctx.fillRect(x+16, y, 2, 40);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x, y+38, 18, 2);
    } else if (digit == 20){
        ctx.fillRect(x, y, 2, 40);
        ctx.fillRect(x+16, y, 2, 40);
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x+8, y, 2, 20);
    } else if (digit == 21){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x, y, 2, 40);
    } else if (digit == 22){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y, 2, 20);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x+16, y+20, 2, 20);
        ctx.fillRect(x, y+38, 18, 2);
    } else if (digit == 23){
        ctx.fillRect(x+8, y, 2, 40);
        ctx.fillRect(x, y+19, 18, 2);
    } else if (digit == 24){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x, y+38, 18, 2);
        ctx.fillRect(x, y, 2, 40);
        ctx.fillRect(x+8, y, 2, 40);
        ctx.fillRect(x+16, y, 2, 40);
    } else if (digit == 25){
        ctx.fillRect(x, y, 9, 2);
        ctx.fillRect(x, y+38, 9, 2);
        ctx.fillRect(x+8, y, 2, 40);
        ctx.fillRect(x+9, y+19, 9, 2);
        ctx.fillRect(x+16, y+20, 2, 20);
    } else if (digit == 26){
        ctx.fillRect(x, y, 18, 2);
        ctx.fillRect(x+16, y, 2, 40);
        ctx.fillRect(x, y+19, 18, 2);
        ctx.fillRect(x, y+20, 2, 20);
        ctx.fillRect(x, y+38, 18, 2);
    }
}


function updateVisualNumbers(){
    // turning numerical values into ternary values for printing
    accumulator[1] = accumulator[0].toString(3).padStart(9, '0');
    instructionPointer[1] = instructionPointer[0].toString(3).padStart(9, '0');
    addressRegister[1] = addressRegister[0].toString(3).padStart(9, '0');
    dataRegister[1] = dataRegister[0].toString(3).padStart(9, '0');
    stackPointer[1] = stackPointer[0].toString(3).padStart(9, '0');
    
    instructionRegister[0] = memory[instructionPointer[0]][4];
    instructionRegister[1] = memory[instructionPointer[0]][2];
    instructionRegister[2] = instructionRegister[0].toString(3).padStart(6, '0');
    instructionRegister[3] = instructionRegister[1].toString(3).padStart(3, '0');

    dataRegister[2] = dataRegister[0].toString(3).padStart(6, '0');
    dataRegister[3] = dataRegister[1].toString(3).padStart(3, '0');
    
    for (let i = 0; i < 729; i++){
        memory[i][1] = memory[i][0].toString(27).padStart(2, '0');
        memory[i][3] = memory[i][2].toString(27).padStart(1, '0');
        memory[i][5] = memory[i][4].toString(27).padStart(2, '0');
    }

    //input
    input[1] = input[0].toString(27).padStart(3, '0');
    drawNum(46, 563, parseInt(input[1].slice(0, 1), 27), 'rgb(249, 0, 0)');
    drawNum(70, 563, parseInt(input[1].slice(1, 2), 27), 'rgb(249, 0, 0)');
    drawNum(94, 563, parseInt(input[1].slice(2, 3), 27), 'rgb(249, 0, 0)');

    //output
    output[1] = output[0].toString(27).padStart(3, '0');
    drawNum(306, 563, parseInt(output[1].slice(0, 1), 27), 'rgb(0, 242, 0)');
    drawNum(330, 563, parseInt(output[1].slice(1, 2), 27), 'rgb(0, 242, 0)');
    drawNum(354, 563, parseInt(output[1].slice(2, 3), 27), 'rgb(0, 242, 0)');

    //memory
    for (let i = instructionPointer[0]; i < instructionPointer[0] + 10; i++){

        let digit1 = parseInt(memory[i][1].slice(0, 1), 27);
        let digit2 = parseInt(memory[i][1].slice(1, 2), 27);

        drawNum(813, 43 + (i - instructionPointer[0])*56, digit1, 'rgb(255,165,0)');
        drawNum(837, 43 + (i - instructionPointer[0])*56, digit2, 'rgb(255,165,0)');

        // For the 3-digit slice (memory[i][3])
        let d3_1 = parseInt(memory[i][3].slice(0, 1), 27);
        let d3_2 = parseInt(memory[i][5].slice(0, 1), 27);
        let d3_3 = parseInt(memory[i][5].slice(1, 2), 27);

        drawNum(898, 43 + (i - instructionPointer[0])*56, d3_1, 'rgb(255,165,0)');
        drawNum(922, 43 + (i - instructionPointer[0])*56, d3_2, 'rgb(255,165,0)');
        drawNum(946, 43 + (i - instructionPointer[0])*56, d3_3, 'rgb(255,165,0)');
    }

    // accumulator
    for (let i = 0; i < 9; i++){
        if (i >= 0 && i <= 2){
            drawNum(271 + i*24 - 10, 50, accumulator[1].slice(i, i+1), 'rgb(201, 76, 210)');
        } else if (i >= 3 && i <= 5){
            drawNum(271 + i*24, 50, accumulator[1].slice(i, i+1), 'rgb(201, 76, 210)');
        } else {
            drawNum(271 + i*24 + 10, 50, accumulator[1].slice(i, i+1), 'rgb(201, 76, 210)');
        }
    }
    // instruction pointer
    for (let i = 0; i < 9; i++){
        if (i >= 0 && i <= 2){
            drawNum(271 + i*24 - 10, 120, instructionPointer[1].slice(i, i+1), 'rgb(69, 166, 241)');
        } else if (i >= 3 && i <= 5){
            drawNum(271 + i*24, 120, instructionPointer[1].slice(i, i+1), 'rgb(69, 166, 241)');
        } else {
            drawNum(271 + i*24 + 10, 120, instructionPointer[1].slice(i, i+1), 'rgb(69, 166, 241)');
        }
    }
    // instruction register
    for (let i = 0; i < 9; i++){
        if (i >= 0 && i <= 2){
            drawNum(271 + i*24 - 10, 190, instructionRegister[3].slice(i, i+1), 'rgb(255, 255, 0)');
        } else if (i >= 3 && i <= 5){
            drawNum(271 + i*24, 190, instructionRegister[2].slice(i-3, i-2), 'rgb(255, 255, 0)');
        } else {
            drawNum(271 + i*24 + 10, 190, instructionRegister[2].slice(i-3, i-2), 'rgb(255, 255, 0)');
        }
    }
    // address Register
    for (let i = 0; i < 9; i++){
        if (i >= 0 && i <= 2){
            drawNum(271 + i*24 - 10, 260, addressRegister[1].slice(i, i+1), 'rgb(255, 255, 255)');
        } else if (i >= 3 && i <= 5){
            drawNum(271 + i*24, 260, addressRegister[1].slice(i, i+1), 'rgb(255, 255, 255)');
        } else {
            drawNum(271 + i*24 + 10, 260, addressRegister[1].slice(i, i+1), 'rgb(255, 255, 255)');
        }
    }
    // data register
    for (let i = 0; i < 9; i++){
        if (i >= 0 && i <= 2){
            drawNum(271 + i*24 - 10, 330, dataRegister[3].slice(i, i+1), 'rgb(255, 255, 255)');
        } else if (i >= 3 && i <= 5){
            drawNum(271 + i*24, 330, dataRegister[2].slice(i-3, i-2), 'rgb(255, 255, 255)');
        } else {
            drawNum(271 + i*24 + 10, 330, dataRegister[2].slice(i-3, i-2), 'rgb(255, 255, 255)');
        }
    }
    // stack pointer
    for (let i = 0; i < 9; i++){
        if (i >= 0 && i <= 2){
            drawNum(271 + i*24 - 10, 400, stackPointer[1].slice(i, i+1), 'rgb(255, 255, 255)');
        } else if (i >= 3 && i <= 5){
            drawNum(271 + i*24, 400, stackPointer[1].slice(i, i+1), 'rgb(255, 255, 255)');
        } else {
            drawNum(271 + i*24 + 10, 400, stackPointer[1].slice(i, i+1), 'rgb(255, 255, 255)');
        }
    }
    // drawing indicators for what is selected
    if (selectedInputField == 'instructionPointer'){
        ctx.strokeStyle = 'rgb(69, 166, 241)';
        ctx.shadowColor = 'rgb(69, 166, 241)';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 10;
        ctx.fillStyle = 'rgb(69, 166, 241)';
        ctx.fillRect(261, 170, 68, 3);
        ctx.fillRect(343, 170, 68, 3);
        ctx.fillRect(425, 170, 68, 3);
    }
    if (selectedInputField == 'instructionRegister1'){
        ctx.strokeStyle = 'rgb(255, 255, 0)';
        ctx.shadowColor = 'rgb(255, 255, 0)';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 10;
        ctx.fillStyle = 'rgb(255, 255, 0)';
        ctx.fillRect(343, 240, 68, 3);
        ctx.fillRect(425, 240, 68, 3);
    }
    if (selectedInputField == 'instructionRegister2'){
        ctx.strokeStyle = 'rgb(255, 255, 0)';
        ctx.shadowColor = 'rgb(255, 255, 0)';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 10;
        ctx.fillStyle = 'rgb(255, 255, 0)';
        ctx.fillRect(261, 240, 68, 3);
    }
    if (selectedInputField == 'input'){
        ctx.strokeStyle = 'rgb(255, 0, 0)';
        ctx.shadowColor = 'rgb(255, 0, 0)';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 10;
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.fillRect(46, 610, 66, 4);
    }

    // flags
    if (accumulator[0] == 0){
        zero = true;
    } else {
        zero = false;
    }

    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.shadowColor = 'rgb(255, 0, 0)';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 10;
    ctx.fillStyle = 'rgb(255,0,0)';
    if (zero){
        ctx.fillRect(610, 240, 10, 10);
    }
    if (underflow){
        ctx.fillRect(660, 240, 10, 10);
    }
    if (overflow){
        ctx.fillRect(710, 240, 10, 10);
    }

    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.shadowColor = 'rgb(255, 255, 255)';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 10;
    ctx.fillStyle = 'rgb(255, 255, 255)';

    // testing system display
    if (taskIncrementer[0] == 0 && !testing){
        //ctx.fillRect(555, 405, 60, 110);
        ctx.fillRect(565, 415, 40, 5);
        ctx.fillRect(565, 420, 5, 85);
        ctx.fillRect(600, 420, 5, 85);
    }
    if (taskIncrementer[0] == 1 && !testing){
        //ctx.fillRect(555, 405, 60, 110);
        ctx.fillRect(565, 415, 5, 45);
        ctx.fillRect(565, 460, 40, 5);
        ctx.fillRect(600, 465, 5, 40);
    }
    if (taskIncrementer[0] == 2 && !testing){
        //ctx.fillRect(555, 405, 60, 110);
        ctx.fillRect(600, 415, 5, 45);
        ctx.fillRect(565, 460, 40, 5);
        ctx.fillRect(565, 465, 5, 40);
    }
    if (taskIncrementer[0] == 3 && !testing){
        //ctx.fillRect(555, 405, 60, 110);
        ctx.fillRect(565, 460, 40, 5);
        ctx.fillRect(565, 415, 5, 90);
    }
    if (taskIncrementer[0] == 4 && !testing){
        //ctx.fillRect(555, 405, 60, 110);
        ctx.fillRect(565, 415, 40, 5);
        ctx.fillRect(565, 455, 40, 5);
        ctx.fillRect(565, 500, 40, 5);
        ctx.fillRect(600, 420, 5, 40);
    }

    if (taskIncrementer[1] >= 1){
        ctx.strokeStyle = 'rgb(255, 0, 0)';
        ctx.shadowColor = 'rgb(255, 0, 0)';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 10;
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.fillRect(630, 445, 30, 30);
    }
    if (taskIncrementer[1] >= 2){
        ctx.strokeStyle = 'rgb(255, 125, 0)';
        ctx.shadowColor = 'rgb(255, 125, 0)';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 10;
        ctx.fillStyle = 'rgb(255, 125, 0)';
        ctx.fillRect(665, 445, 30, 30);
    }
    if (taskIncrementer[1] >= 3){
        ctx.strokeStyle = 'rgb(255, 255, 0)';
        ctx.shadowColor = 'rgb(255, 255, 0)';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 10;
        ctx.fillStyle = 'rgb(255, 255, 0)';
        ctx.fillRect(700, 445, 30, 30);
    }
    if (taskIncrementer[1] >= 4){
        ctx.strokeStyle = 'rgb(0,220,0)';
        ctx.shadowColor = 'rgb(0,220,0)';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 10;
        ctx.fillStyle = 'rgb(0,220,0)';
        ctx.fillRect(735, 445, 30, 30);
    }

}


function runCommand(instruction, address){
    if (instruction == 0 ){
        instructionPointer[0] += 1;
    } else if (instruction == 1){
        // IN
        if (testing){
            inputNeeded = true;
            running = false;
        } else {
            if (taskIncrementer[0] == 0){
                accumulator[0] = task0TestCases[taskIncrementer[1]][taskIncrementer[2]];
                if (taskIncrementer[2] == 0){
                    taskIncrementer[2] += 1;
                } else {
                    taskIncrementer[2] -= 1;
                }
            } else if (taskIncrementer[0] == 1){
                accumulator[0] = task1TestCases[taskIncrementer[1]][0];
            } else if (taskIncrementer[0] == 2){
                accumulator[0] = task2TestCases[taskIncrementer[1]][taskIncrementer[2]];
                if (taskIncrementer[2] == 0){
                    taskIncrementer[2] += 1;
                } else {
                    taskIncrementer[2] -= 1;
                }
            } else if (taskIncrementer[0] == 3){
                accumulator[0] = task3TestCases[taskIncrementer[1]][0];
            } else if (taskIncrementer[0] == 4){
                accumulator[0] = task4TestCases[taskIncrementer[1]][0];
            }
            instructionPointer[0] += 1;
        }
        
    } else if (instruction == 2){
        // OUT
        output[0] = accumulator[0]
        
        if (!testing){
            if (taskIncrementer[0] == 0){
                if (output[0] == task0TestCases[taskIncrementer[1]][2] && taskIncrementer[1] < 5){
                    taskIncrementer[1] += 1;
                }
                if (taskIncrementer[1] == 5){
                    taskIncrementer[0] += 1;
                    taskIncrementer[1] = 0;
                    taskIncrementer[2] = 0;
                }
            } else if (taskIncrementer[0] == 1){
                if (output[0] == task1TestCases[taskIncrementer[1]][1] && taskIncrementer[1] < 5){
                    taskIncrementer[1] += 1;
                }
                if (taskIncrementer[1] == 5){
                    taskIncrementer[0] += 1;
                    taskIncrementer[1] = 0;
                    taskIncrementer[2] = 0;
                }
            } else if (taskIncrementer[0] == 2){
                if (output[0] == task2TestCases[taskIncrementer[1]][2] && taskIncrementer[1] < 5){
                    taskIncrementer[1] += 1;
                }
                if (taskIncrementer[1] == 5){
                    taskIncrementer[0] += 1;
                    taskIncrementer[1] = 0;
                    taskIncrementer[2] = 0;
                }
            } else if (taskIncrementer[0] == 3){
                if (output[0] == task3TestCases[taskIncrementer[2] + 1]){
                    taskIncrementer[2] += 1;
                }
                if (taskIncrementer[2] == 6){
                    taskIncrementer[1] += 1;
                    taskIncrementer[2] = 0;
                }
                if (taskIncrementer[1] == 5){
                    taskIncrementer[0] += 1;
                    taskIncrementer[1] = 0;
                    taskIncrementer[2] = 0;
                }
            } else if (taskIncrementer[0] == 4){
                if (output[0] == task4TestCases[taskIncrementer[1]][1]){
                    taskIncrementer[1] += 1;
                }
                if (taskIncrementer[1] == 5){
                    print("YOU WIN!");
                }
            }
        }
        instructionPointer[0] += 1;
    } else if (instruction == 3){
        // LOAD
        accumulator[0] = memory[address][4];
        instructionPointer[0] += 1;
    } else if (instruction == 4){
        // SET
        memory[address][4] = accumulator[0];
        instructionPointer[0] += 1;
    } else if (instruction == 5){
        // ADDN
        accumulator[0] += address;
        if (accumulator[0] > 19682){
            accumulator[0] = accumulator[0] - 19863
            overflow = true;
        } else {
            overflow = false;
            underflow = false;
        }
        instructionPointer[0] += 1;
    } else if (instruction == 6){
        // SUBN
        accumulator[0] -= address;
        if (accumulator[0] < 0){
            accumulator[0] = 19682 + accumulator[0];
            underflow = true;
        } else {
            underflow = false;
            overflow = false;
        }
        instructionPointer[0] += 1;
    } else if (instruction == 7){
        // MULTN
        accumulator[0] *= address;
        if (accumulator[0] > 19682){
            accumulator[0] = accumulator[0] - 19863
            overflow = true;
        } else {
            overflow = false;
            underflow = false;
        }
        instructionPointer[0] += 1;
    } else if (instruction == 8){
        // DIVN
        accumulator[0] = Math.floor(accumulator[0] / address);
        instructionPointer[0] += 1;
    } else if (instruction == 9){
        // ULOAD
        accumulator[0] = memory[memory[address][4]][4];
        instructionPointer[0] += 1;
    } else if (instruction == 10){
        // USET
        memory[address][4] = accumulator[0];
        instructionPointer[0] += 1;
    } else if (instruction == 11){
        // ADD
        accumulator[0] += memory[address][4];
        instructionPointer[0] += 1;
        if (accumulator[0] > 19682){
            accumulator[0] = accumulator[0] - 19863
            overflow = true;
        } else {
            overflow = false;
            underflow = false;
        }
    } else if (instruction == 12){
        // SUB
        accumulator[0] -= memory[address][4];
        if (accumulator[0] < 0){
            accumulator[0] = 19682 + accumulator[0];
            underflow = true;
        } else {
            underflow = false;
            overflow = false;
        }
        instructionPointer[0] += 1;
    } else if (instruction == 13){
        // MULT
        accumulator[0] *= memory[address][4];
        if (accumulator[0] > 19682){
            accumulator[0] = accumulator[0] - 19863
            overflow = true;
        } else {
            overflow = false;
            underflow = false;
        }
        instructionPointer[0] += 1;
    } else if (instruction == 14){
        // DIV
        accumulator[0] = Math.floor(accumulator[0] / memory[address][4]);
        instructionPointer[0] += 1;
    } else if (instruction == 15){
        // JUMP
        instructionPointer[0] = address;
    } else if (instruction == 16){
        // JUMPZ
        if (zero){
            instructionPointer[0] = address;
        }
        else {
            instructionPointer[0] += 1;
        }
    } else if (instruction == 17){
        // JUMPNZ
        if(!zero){
            instructionPointer[0] = address;
        } else {
            instructionPointer[0] += 1;
        }
    } else if (instruction == 18){
        // JUMPOF
        if (overflow){
            instructionPointer[0] = address;
        } else {
            instructionPointer[0] += 1;
        }
    } else if (instruction == 19){
        // JUMPUF
        if (underflow){
            instructionPointer[0] = address;
        } else {
            instructionPointer[0] += 1;
        }
    } else if (instruction == 20){
        // COMP
        if (accumulator[0] - memory[address][4] < 0){
            underflow = true;
        } else {
            underflow = false;
            overflow = false;
        }
        instructionPointer[0] += 1;
    } else if (instruction == 21){
        // PUSH
        stack.push(accumulator[0]);
        stackPointer[0] += 1;
        instructionPointer[0] += 1;
    } else if (instruction == 22){
        // POP
        if (stackPointer[0] > 0){
            accumulator[0] = stack[stack.length-1];
            stack.pop();
        }
        instructionPointer[0] += 1;
    } else if (instruction == 23){
        // CALL
        stack.push(instructionPointer[0]);
        stackPointer[0] += 1;
        instructionPointer[0] = address;
    } else if (instruction == 24){
        // RETURN
        if (stackPointer[0] > 0){
            instructionPointer[0] = stack[stack.length-1] + 1;
            stack.pop();
        }
    } else if (instruction == 25){
        // SWAP
        temp = accumulator[0];
        accumulator[0] = stack[stack.length-1];
        stack[stack.length-1] = temp;
        instructionPointer[0] += 1;
    } else if (instruction == 26){
        // HALT
        running = false;
    }
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// AI code below for saving data START

// Function to pack up and save your machine state
function saveEmulatorState() {
    const stateToSave = {
        accumulator: accumulator,
        instructionPointer: instructionPointer,
        instructionRegister: instructionRegister,
        addressRegister: addressRegister,
        dataRegister: dataRegister,
        stackPointer: stackPointer,
        input: input,
        output: output,
        memory: memory,
        zero: zero,
        overflow: overflow,
        underflow: underflow,
        stack: stack
    };
    localStorage.setItem('deternary_state', JSON.stringify(stateToSave));
}

// Function to recover state if it exists
function loadEmulatorState() {
    const savedData = localStorage.getItem('deternary_state');
    if (!savedData) return; // Exit if nothing was saved yet

    try {
        const parsed = JSON.parse(savedData);
        
        // Restore all variables safely
        accumulator = parsed.accumulator;
        instructionPointer = parsed.instructionPointer;
        instructionRegister = parsed.instructionRegister;
        addressRegister = parsed.addressRegister;
        dataRegister = parsed.dataRegister;
        stackPointer = parsed.stackPointer;
        input = parsed.input;
        output = parsed.output;
        memory = parsed.memory;
        zero = parsed.zero;
        overflow = parsed.overflow;
        underflow = parsed.underflow;
        stack = parsed.stack;

        // Force a redraw of your background and foreground canvas 
        // assuming your render functions are named draw() or similar:
        if (typeof draw === 'function') draw(); 
        if (typeof drawBackground === 'function') drawBackground();
    } catch (e) {
        console.error("Error restoring saved state:", e);
    }
}

// 2. Attach Event Listeners to catch page transitions
window.addEventListener('beforeunload', saveEmulatorState);

// AI code above for saving data END

