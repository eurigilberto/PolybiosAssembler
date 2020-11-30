const path = require('path');
const fs = require('fs');
const { getImagePixelsForConsole } = require("../imageLoader/imageLoader.js");
const { getSizeArray } = require("../utils/image.js");

function transformImageImports(lines) {
    let validLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineSections = line.split(" ");
        if (lineSections[0] == "SPRITE") {
            /* Params
                1 - relative path
                2 - Sprite Size
            */
            const imgPath = path.join(__dirname, "../", lineSections[1])

            validLines = [
                ...validLines,
                ...getImageCode(imgPath, lineSections[2])
            ];

        } else if (lineSections[0] == "SPRITE_ANIM") {
            /* Params
                1 - relative path
                2 - Sprite Size
            */
            const dirPath = path.join(__dirname, "../", lineSections[1])
            const files = fs.readdirSync(dirPath);

            const sortedFiles = files.sort((a, b) => {
                return parseInt(a.split(".")[0]) - parseInt(b.split(".")[0]);
            });

            for (let i = 0; i < sortedFiles.length; i++) {
                const file = sortedFiles[i];
                const imgPath = path.join(dirPath, file);

                validLines = [
                    ...validLines,
                    ...getImageCode(imgPath, lineSections[2])
                ];
            }
        } else if (lineSections[0] == "SPRITE_ANIM_SECTION") {
            console.log("Sprite anim section called");
            console.log("Line: ", line);
            /* Params
                1 - relative path of folder containing the image
                2 - size array
                3 - column count
                4 - row count
                5 - frame count
            */
            const dirPath = path.join(__dirname, "../", lineSections[1])
            const files = fs.readdirSync(dirPath);

            const sortedFiles = files.sort((a, b) => {
                return parseInt(a.split(".")[0]) - parseInt(b.split(".")[0]);
            });

            const size = getSizeArray(lineSections[2]);
            const columnNumber = parseInt(lineSections[3]);
            const rowNumber = parseInt(lineSections[4]);
            const frameCount = lineSections[5];

            const sw = size[0];
            const sh = size[1];

            for (let frameNumber = 0; frameNumber < sortedFiles.length; frameNumber++) {
                //This section is going to be called for each frame

                const file = sortedFiles[frameNumber];
                const imgPath = path.join(dirPath, file);

                importImageInSections(imgPath, sw, sh, columnNumber, rowNumber, validLines);
            }
        } else if(lineSections[0] == "SPRITE_SECTION") {
            /* Params
                1 - relative path
                2 - sprite size
                3 - column number
                4 - row number
            */
            const size = getSizeArray(lineSections[2]);
            const columnNumber = parseInt(lineSections[3]);
            const rowNumber = parseInt(lineSections[4]);

            const sw = size[0];
            const sh = size[1];

            const imgPath = path.join(__dirname, "../", lineSections[1]);

            importImageInSections(imgPath, sw, sh, columnNumber, rowNumber, validLines);
        } else {
            validLines.push(line);
        }
    }

    return validLines;
}

function importImageInSections(imgPath, sw, sh, columnNumber, rowNumber, validLines) {
    const pixels = getImagePixelsForConsole(imgPath);
    const imgSpectedSize = sw * sh * columnNumber * rowNumber;

    //Separate frames into separate sections
    if (pixels.length >= (imgSpectedSize)) {
        for (let y = 0; y < rowNumber; y++) {
            for (let x = 0; x < columnNumber; x++) {
                //This section is going to be called for each section of the frame
                for (let sy = 0; sy < sh; sy++) {
                    for (let sx = 0; sx < sw; sx = sx + 4) {
                        const offsetX = x * sw;
                        const offsetY = y * sw * columnNumber * sh;
                        const index = offsetX + offsetY + sx + sy * sw * columnNumber;
                        const spriteLine = `DB ${pixels[index]} ${pixels[index + 1]} ${pixels[index + 2]} ${pixels[index + 3]}`;

                        validLines.push(spriteLine);
                    }
                }
            }
        }
    } else {
        throw new Error(`Image does not have the correct size. Expected size: ${imgSpectedSize} | Image current size: ${pixels.length}`);
    }
}

function getImageCode(imgPath, sizeString) {
    const pixels = getImagePixelsForConsole(imgPath);
    const size = getSizeArray(sizeString);
    return transformImageToCode(pixels, size);
}

function transformImageToCode(pixels, size) {
    let storeCommands = [];
    const imageSize = size[0] * size[1];

    if (pixels.length == imageSize) {
        let i = 0;
        while (i < imageSize) {
            storeCommands.push(`DB ${pixels[i]} ${pixels[i + 1]} ${pixels[i + 2]} ${pixels[i + 3]}`);
            i += 4;
        }
    } else {
        throw new Error(`The image does not have the right size. Selected size: ${size[0] * size[1]} | image size: ${pixels.length}`);
    }

    return storeCommands;
}

module.exports = {
    transformImageImports
}