const path = require('path');
const {recreateImageWithConsolePallete} = require("./imageLoader.js");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(`Image Relative Path\nBase Path: ${__dirname}`, function(relativePath){
    const imgPath = path.join(__dirname, relativePath);
    console.log("Selected image path : ", imgPath);

    rl.question(`Image output relative path\nBase Path: ${__dirname}`, function(outputRelativePath){
        const imgPathOut = path.join(__dirname, outputRelativePath);
        console.log("Selecte output path : ", imgPathOut);
        
        recreateImageWithConsolePallete(imgPath, imgPathOut)
    })
})