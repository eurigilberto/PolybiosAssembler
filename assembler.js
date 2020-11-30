const path = require('path');
const fs = require('fs');
const { removeComments } = require("./assemblerStages/removeComments.js")
const { transformImageImports } = require("./assemblerStages/importImage.js");
const { transformLabels } = require("./assemblerStages/transformLabels.js");
const { transformInstructions } = require("./assemblerStages/transformInstructions.js");
const { createCodeBuffer } = require("./assemblerStages/createCodeBuffer.js");
const { compilerCommands } = require("./assemblerStages/compilerCommands.js");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const directoryPath = path.join(__dirname, 'code');

fs.readdir(directoryPath, function (err, files) {

    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    let options = "Select one of the files \n";
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        options += `${i} - ${file} \n`;
    }

    rl.question(options, function (selection) {
        console.log("Selected : ", selection);
        const filePath = path.join(directoryPath, files[selection]);
        console.log("File path : ", filePath);

        const fileBuffer = fs.readFileSync(filePath);
        const loadedFile = fileBuffer.toString();

        const lines = loadedFile.split("\r\n");

        const commentsRemoved = removeComments(lines);
        const transformedCompilerCommands = compilerCommands(commentsRemoved);
        //console.log(transformedCompilerCommands)
        const imagesImported = transformImageImports(transformedCompilerCommands);
        const labelsTransformed = transformLabels(imagesImported);
        const instructionsTransformed = transformInstructions(labelsTransformed);
        const codeBuffer = createCodeBuffer(instructionsTransformed);

        console.log(codeBuffer);
        console.log("Assembly finished");

        rl.question(`Where would you like to store the compiled file? \nBase Path : ${__dirname}\nRelative path :`, function (outputFilePath) {
            fs.writeFileSync(path.join(__dirname, outputFilePath), codeBuffer);
            console.log("File writen");
            rl.close();
        })
    })
});