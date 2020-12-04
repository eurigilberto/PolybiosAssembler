const path = require('path');
const fs = require('fs');

function importCode(lines){
    let validLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineSections = line.split(" ");

        if(lineSections[0] == "import"){
            const codePath = path.join(__dirname, "../", lineSections[1]);

            const codeLines = fs.readFileSync(codePath).toString().split("\r\n");
            codeLines.forEach((codeLine)=>{
                validLines.push(codeLine);
            });
        }else{
            validLines.push(line);
        }
    }

    return validLines;
}

module.exports = {
    importCode
}