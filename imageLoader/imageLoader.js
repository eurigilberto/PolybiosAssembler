var fs = require("fs"),
    PNG = require("pngjs").PNG;

function loadImage(imgPath) {
    let data = fs.readFileSync(imgPath);
    let png = PNG.sync.read(data);

    let imgPixels = [];

    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            let idx = (png.width * y + x) << 2;

            let RED = png.data[idx] >> 5;
            let GREEN = png.data[idx + 1] >> 5;
            let BLUE = png.data[idx + 2] >> 6;

            png.data[idx] = Math.round((RED / 7) * 255);
            png.data[idx + 1] = Math.round((GREEN / 7) * 255);
            png.data[idx + 2] = Math.round((BLUE / 3) * 255);

            imgPixels.push((RED << 5) + (GREEN << 2) + BLUE);
        }
    }

    return {
        imgPixels,
        png
    };
}

function recreateImageWithConsolePallete(imgPath, pathOut){
    const png = loadImage(imgPath).png;
    let buffer = PNG.sync.write(png);
    fs.writeFileSync(pathOut, buffer);
}

function getImagePixelsForConsole(imgPath){
    return loadImage(imgPath).imgPixels;
}

module.exports = {
    getImagePixelsForConsole,
    recreateImageWithConsolePallete
}