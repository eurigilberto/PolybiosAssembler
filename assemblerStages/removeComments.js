function removeComments(lines){
    let validLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if(line){
            //Check if the line is a comment
            if(line[0] + line[1] != "//"){
                validLines.push(line);
            }
        }
    }

    return validLines;
}

module.exports={
    removeComments
}