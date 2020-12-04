const mnemonics = require('../mnemonics.js');

function transformInstructions(lines) {
    let validLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineSections = line.split(" ");

        if (lineSections[0] == "DB") {
            validLines.push(line);
        } else if (mnemonics[lineSections[0]] != undefined) {

            const mnemonicData = mnemonics[lineSections[0]];
            const instruction = mnemonicData.hexCode;
            let data = parseInt(Number(instruction), 10) << 24;
            let currentRegisterIndex = 24;
            let sectionIndex = 1;
            const structure = mnemonicData.structure;

            for (let i = 0; i < structure.length; i++) {
                const [type, size] = structure[i].split(" ");
                currentRegisterIndex -= size;
                if (type == "d") {
                    const paramData = parseInt(lineSections[sectionIndex]);
                    if (paramData < Math.pow(2, size)) {
                        data += paramData << currentRegisterIndex;
                        sectionIndex += 1;
                    } else {
                        console.log("Line with the error : ", line);
                        throw new Error(`Data size is bigger than the supported size (${size}) in line: ${line}`);
                    }
                } else if (type != "e") {
                    throw new Error(`Structure type error, type : ${type}`);
                }
            }

            validLines.push(`DB ${getByte(4, data)} ${getByte(3, data)} ${getByte(2, data)} ${getByte(1, data)}`);

        } else {
            console.log("Previous Line: ", lines[i - 1])
            throw new Error(`Invalid line found on transformation stage | line : ${line}`);

        }
    }

    return validLines;
}

const byteParams = {
    4: {
        mask: 0xFF000000,
        shift: 24
    },
    3: {
        mask: 0x00FF0000,
        shift: 16
    },
    2: {
        mask: 0x0000FF00,
        shift: 8
    },
    1: {
        mask: 0x000000FF,
        shift: 0
    }
}

function getByte(n, data) {
    return ((data & byteParams[n].mask) >> byteParams[n].shift);
}

module.exports = {
    transformInstructions
}