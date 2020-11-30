const image = require("../utils/image.js");
const { getSizeArray } = require("../utils/image.js");

function fillSpace(params) {
    let createdLines = [];
    const fillAmmount = parseInt(params[0]);

    for (let i = 0; i < fillAmmount; i++) {
        createdLines.push(`DB ${params[1]} ${params[2]} ${params[3]} ${params[4]}`)
    }

    return createdLines;
}

function createAssemblerCodeBundle() {
    let assemblerCode = [];
    let addLine = (line) => {
        assemblerCode.push(line)
    }
    let addMultipleLines = (lines) => {
        lines.split('\n').forEach((line) =>
            assemblerCode.push(line));
    }
    return {
        assemblerCode,
        addLine,
        addMultipleLines
    }
}

function placeSpriteAnimation(params) {
    const [imageName, imagePath, bPosX, bPosY, columnNumber, rowNumber, size, frameCount] = [...params];

    let codeBundle = createAssemblerCodeBundle();

    //Creating lables
    let posData = `${imageName}PositionData`;
    let fnName = `${imageName}Fn`;
    let startFrame = `${imageName}StartFrame`;
    let doWhileStart = `do${imageName}`;
    let doWhileOut = `doWhileOut${imageName}`;
    let resetAnim = `resetAnim${imageName}`;
    let animData = `${imageName}Data`;
    //Labels created

    codeBundle.addLine(`-- ${posData}`);
    codeBundle.addLine(`DB 0 0 0 ${bPosX}`);
    codeBundle.addLine(`DB 0 0 0 ${bPosY}`);

    for (let y = 0; y < rowNumber; y++) {
        for (let x = 0; x < columnNumber; x++) {
            codeBundle.addLine(`DB 0 0 0 ${x * getSizeArray(size)[0] / 4}`);
            codeBundle.addLine(`DB 0 0 0 ${y * getSizeArray(size)[1]}`);
        }
    }
    codeBundle.addLine(`-- ${startFrame}`);
    codeBundle.addLine(`DB 0 0 0 0`);
    codeBundle.addLine(`-- ${fnName}`);
    codeBundle.addLine(`LITERALR1 VideoLayer l`);
    codeBundle.addLine(`MOV 1 2`);
    //The base layer is on register 2
    codeBundle.addLine(`LITERALR1 ${posData} l`);
    codeBundle.addLine(`LOAD 1 3`);
    codeBundle.addLine(`ADDI 1 1`);
    codeBundle.addLine(`LOAD 1 4`);
    //Registers 3 and 4 have the horizontal and vertical base positions respectively
    codeBundle.addLine(`ADDI 1 1`);
    codeBundle.addLine(`MOV 1 5`);
    //Register 5 has the start of the offset position of the sprite sections
    codeBundle.addLine(`MOV 0 6`);
    //Register 6 is the index of the for loop
    codeBundle.addLine(`MOV 5 7`);
    //Register 7 has the start position offset

    //Calculate the current frame number
    codeBundle.addMultipleLines(`LITERALR1 ${startFrame} l
LOAD 1 10
GVR 11 9
SUB 11 10 10
SRL 10 2 10 0`);
    //Register 10 has the current frame
    //Register 10 has the current animation frame

    codeBundle.addLine(`-- ${doWhileStart}`);
    codeBundle.addMultipleLines(`LOAD 7 8
ADDI 7 1
LOAD 7 9
ADDI 7 1
ADD 8 3 8
ADD 9 4 9`);
    //8 and 9 have the Vertical and horizontal positions of the current sprite section

    const spriteArraySize = (getSizeArray(size)[0] / 4) * getSizeArray(size)[1];

    codeBundle.addMultipleLines(`MOV 6 12
MULI 12 ${spriteArraySize}
MOV 10 16
MULI 16 ${spriteArraySize * columnNumber * rowNumber}
ADD 16 12 14
LITERALR1 ${animData} l
ADD 1 14 14`);
    //Reg 14 has the start register of the current frame section for the current frame

    //Write sprite to the frame buffer
    //TODO: this should be changed to make it possible for the programer to decide what
    //the transparency color of the sprite
    codeBundle.addMultipleLines(`LITERALR1 1
SSTC 1
LS 14 2 3 8 9
LITERALR1 0
SSTC 1`);

    //Check if the for should continue
    codeBundle.addMultipleLines(`ADDI 6 1
LITERALR1 ${columnNumber * rowNumber}
LESS 6 1 0
JUMPI ${doWhileOut} l
JUMPI ${doWhileStart} l`);

    //Out of the for loop
    //Test if animation needs to be reset
    codeBundle.addMultipleLines(`-- ${doWhileOut}
LITERALR1 ${frameCount - 1}
LESS 10 1 0
JUMPI ${resetAnim} l
RETURN`);

    //ResetAnimation
    codeBundle.addMultipleLines(`-- ${resetAnim}
GVR 18 9
LITERALR1 ${startFrame} l
STORE 1 18 0
RETURN`);

    //Animation data
    codeBundle.addMultipleLines(`-- ${animData}
SPRITE_ANIM_SECTION ${imagePath} ${size} ${columnNumber} ${rowNumber} ${frameCount}`);

    return codeBundle.assemblerCode;
}

function placeImageOverMultipleSprites(params) {
    const [imageName, imagePath, bPosX, bPosY, columnNumber, rowNumber, size] = [...params];

    let codeBundle = createAssemblerCodeBundle();

    codeBundle.addLine(`-- ${imageName}PositionData`)
    //Sprite collection base position
    codeBundle.addLine(`DB 0 0 0 ${bPosX}`);
    codeBundle.addLine(`DB 0 0 0 ${bPosY}`);

    for (let y = 0; y < rowNumber; y++) {
        for (let x = 0; x < columnNumber; x++) {
            codeBundle.addLine(`DB 0 0 0 ${x * getSizeArray(size)[0] / 4}`);
            codeBundle.addLine(`DB 0 0 0 ${y * getSizeArray(size)[1]}`);
        }
    }

    codeBundle.addLine(`-- ${imageName}Fn`)
    codeBundle.addLine(`LITERALR1 VideoLayer l`);
    codeBundle.addLine(`MOV 1 2`);
    //The base layer is on register 2
    codeBundle.addLine(`LITERALR1 ${imageName}PositionData l`)
    codeBundle.addLine(`LOAD 1 3`);
    codeBundle.addLine(`ADDI 1 1`);
    codeBundle.addLine(`LOAD 1 4`);
    //Registers 3 and 4 have the horizontal and vertical base positions respectively
    codeBundle.addLine(`ADDI 1 1`);
    codeBundle.addLine(`MOV 1 5`);
    //Register 5 has the start of the offset position of the sprite sections
    codeBundle.addLine(`MOV 0 6`);
    //Register 6 is the index of the for loop
    codeBundle.addLine(`MOV 5 7`);
    //Register 7 has the start position offset
    codeBundle.addLine(`-- for${imageName}Start`);

    codeBundle.addMultipleLines(`LOAD 7 8
ADDI 7 1
LOAD 7 9
ADDI 7 1
ADD 8 3 8
ADD 9 4 9`);
    //8 and 9 have the Vertical and horizontal positions of the current sprite section

    const spriteArraySize = (getSizeArray(size)[0] / 4) * getSizeArray(size)[1];
    console.log("Sprite array size:")
    console.log(spriteArraySize);

    codeBundle.addMultipleLines(`MOV 6 12
MULI 12 ${spriteArraySize}
LITERALR1 ${imageName}Data l
ADD 1 12 14`);
    //Reg 14 has the start register of the current frame section for the current frame

    codeBundle.addMultipleLines(`LITERALR1 1
SSTC 1
LS 14 2 3 8 9
LITERALR1 0
SSTC 1`);
    //Image pasted in the video layer

    codeBundle.addMultipleLines(`ADDI 6 1
LITERALR1 ${columnNumber * rowNumber}
LESS 6 1 0
JUMPI outFor${imageName}Sections l
JUMPI for${imageName}Start l
-- outFor${imageName}Sections
RETURN`);

    codeBundle.addMultipleLines(`-- ${imageName}Data
SPRITE_SECTION ${imagePath} ${size} ${columnNumber} ${rowNumber}`);

    return codeBundle.assemblerCode;
}

const commands = {
    "fillSpace": fillSpace,
    "placeImageOverMultipleSprites": placeImageOverMultipleSprites,
    "placeSpriteAnimation": placeSpriteAnimation
}

function compilerCommands(lines) {
    let validLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineSections = line.split(" ")

        const command = commands[lineSections[0]];
        if (command) {
            const newLines = command(lineSections.slice(1));
            validLines = [
                ...validLines,
                ...newLines
            ];
        } else {
            validLines.push(line);
        }
    }

    return validLines;
}

module.exports = {
    compilerCommands
}