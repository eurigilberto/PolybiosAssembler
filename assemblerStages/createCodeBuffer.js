const fs = require("fs");

function createCodeBuffer(lines){
    let buf = Buffer.alloc(64000000);

    console.log("Current program size: ", lines.length * 4 , " Bytes");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineSections = line.split(" ");

        let data = new Uint32Array(1);

        data[0] = (parseInt(lineSections[1]) << 24) + 
                     (parseInt(lineSections[2]) << 16) + 
                     (parseInt(lineSections[3] << 8)) + 
                     parseInt(lineSections[4]);
        
        buf.writeUInt32BE(data, i << 2);   
    }

    return buf;
}

module.exports={
    createCodeBuffer
}