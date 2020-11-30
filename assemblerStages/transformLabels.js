const mnemonics = require('../mnemonics.js');

function transformLabels(lines){
    let validLines = [];
    let labelMap = {};
    let labelessLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineSections = line.split(" ");
        
        if(lineSections[0] == "--"){
            labelMap[lineSections[1]] = labelessLines.length;
        }else{
            labelessLines.push(line);
        }
    }

    console.log(labelMap);

    for (let i = 0; i < labelessLines.length; i++) {
        const line = labelessLines[i];
        const lineSections = line.split(" ");

        if(mnemonics[lineSections[0]] && mnemonics[lineSections[0]].label && lineSections.length >= 3 && lineSections[2] == "l"){
            const labelAddress = labelMap[lineSections[1]];
            if(labelAddress){
                validLines.push(`${lineSections[0]} ${labelAddress}`)
            }else{
                throw new Error(`The label used does not appear in the file. Label : ${lineSections[1]}`)
            }
        }else{
            validLines.push(line);
        }
    }

    return validLines;
}

module.exports={
    transformLabels
}