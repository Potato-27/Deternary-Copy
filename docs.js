// Array containing details for all 27 commands mapping to digits 0-26
// AI file for documentation
const commands = [
    { opcode: 0, name: "NONE", desc: "Do nothing." },
    { opcode: 1, name: "IN", desc: "Read the value from the input device into the accumulator." },
    { opcode: 2, name: "OUT", desc: "Write the value in the accumulator to the output device." },
    { opcode: 3, name: "LOAD", desc: "Take the lower two trites as an address, load the value from that address in the memory to the accumulator." },
    { opcode: 4, name: "SET", desc: "Take the lower two trites as an address, set the value at that address to the accumulator value." },
    { opcode: 5, name: "ADDN", desc: "Add the lower two trites of the instruction to the accumulator." },
    { opcode: 6, name: "SUBN", desc: "Subtract the lower two trites from the accumulator." },
    { opcode: 7, name: "MULTN", desc: "Multiply the accumulator by the lower two trites." },
    { opcode: 8, name: "DIVN", desc: "Divide the accumulator by the lower two trites. (round down to an integer)" },
    { opcode: 9, name: "ULOAD", desc: "Take the data thatâ€™s at the instruction address as a pointer to another location, then take that location as the one that it has to load the value from." },
    { opcode: 10, name: "USET", desc: "Instead of loading data from where that address was pointing at, put the accumulator value there." },
    { opcode: 11, name: "ADD", desc: "Add the value at the address to the accumulator." },
    { opcode: 12, name: "SUB", desc: "Subtract the value at the address from the accumulator" },
    { opcode: 13, name: "MULT", desc: "Multiply the accumulator by the value at the address." },
    { opcode: 14, name: "DIV", desc: "Divide the accumulator by the value at the address. (round down to an integer)" },
    { opcode: 15, name: "JUMP", desc: "Instruction pointer will jump to this address." },
    { opcode: 16, name: "JUMPZ", desc: "JUMP, if the Z flag is flagged" },
    { opcode: 17, name: "JUMPNZ", desc: "JUMP, if the Z flag is not flagged" },
    { opcode: 18, name: "JUMPOF", desc: "JUMP, if overflow" },
    { opcode: 19, name: "JUMPUF", desc: "JUMP, if underflow" },
    { opcode: 20, name: "COMP", desc: "Set the Z and F flags in the ALU as if you performed SUB with the same address, without changing the value in the accumulator." },
    { opcode: 21, name: "PUSH", desc: "Push the accumulator value into the stack. Adds 1 to the stack pointer. Max stack size is 27." },
    { opcode: 22, name: "POP", desc: "Retrieve the most recent value from the stack. Subtracts 1 from the stack pointer." },
    { opcode: 23, name: "CALL", desc: "Push the current address to the stack, then jump to the address in the instruction. (you can make procedures with this)" },
    { opcode: 24, name: "RETURN", desc: "Pop a value from the stack, take it as an address and jump to the address after it. (so, kinda like returning from a procedure)" },
    { opcode: 25, name: "SWAP", desc: "Swap the accumulator value with the top of the stack. You can use this to return values from procedures, like SWAP -> PUSH -> RET will put the address that the machine has to return to to the top of stack and put the value that needs to be returned below it, to be POPâ€™ed later in the main code." },
    { opcode: 26, name: "HALT", desc: "Stop the machine." }
];

window.onload = function() {
    const tbody = document.getElementById('docs-tbody');

    // 1. Generate Rows Dynamic Layout
    commands.forEach(cmd => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="cmd-code">${cmd.opcode}</td>
            <td><strong>${cmd.name}</strong></td>
            <td><canvas id="canvas-glyph-${cmd.opcode}" class="glyph-canvas" width="24" height="44"></canvas></td>
            <td>${cmd.desc}</td>
        `;
        tbody.appendChild(row);
        
        // 2. Render each segment symbol individually via the Canvas context API
        renderGlyph(cmd.opcode);
    });
};

function renderGlyph(digit) {
    const canvas = document.getElementById(`canvas-glyph-${digit}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Coordinates centered inside 24x44 container (digit is 18x40)
    const x = 3; 
    const y = 2;
    const color = 'rgb(255, 165, 0)'; // Classic glowing amber documentation color

    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    ctx.lineWidth = 10;
    ctx.fillStyle = color;

    // Using your exact segment drawing engine maps
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