module.exports = {
    ADD: {
        hexCode: '0x01', structure: ["d 5", "d 5", "d 5"]
    },
    ADDS: {
        hexCode: '0x02', structure: ["d 5", "d 5", "d 5"]
    },
    SUB: {
        hexCode: '0x03', structure: ["d 5", "d 5", "d 5"]
    },
    SUBS: {
        hexCode: '0x04', structure: ["d 5", "d 5", "d 5"]
    },
    MUL: {
        hexCode: '0x05', structure: ["d 5", "d 5", "d 5"]
    },
    MULS: {
        hexCode: '0x06', structure: ["d 5", "d 5", "d 5"]
    },
    DIV: {//Not implemented
        hexCode: '0x07', structure: []
    },
    DIVS: {//Not implemented
        hexCode: '0x08', structure: []
    },
    AND: {
        hexCode: '0x09', structure: ["d 5", "d 5", "d 5"]
    },
    OR: {
        hexCode: '0x0A', structure: ["d 5", "d 5", "d 5"]
    },
    NOT: {
        hexCode: '0x0B', structure: ["d 5", "d 5"]
    },
    XOR: {
        hexCode: '0x0C', structure: ["d 5", "d 5", "d 5"]
    },
    SRL: {//Shift Right Logic
        hexCode: '0x0D', structure: ["d 5", "d 5", "d 5", "e 8", "d 1"]
    },
    SRA: {//Shift Right Arimetic
        hexCode: '0x0E', structure: ["d 5", "d 5", "d 5", "e 8", "d 1"]
    },
    SLL: {//Shift Left Logic
        hexCode: '0x0F', structure: ["d 5", "d 5", "d 5", "e 8", "d 1"]
    },
    LOAD: {
        hexCode: '0x10', structure: ["d 5", "d 5"]
    },
    STORE: {
        hexCode: '0x11', structure: ["d 5", "d 5", "d 4"]
    },
    JUMPI: {
        hexCode: '0x12', structure: ["d 24"], label: true
    },
    JUMP: {
        hexCode: '0x13', structure: ["d 5"]
    },
    GREATER: {
        hexCode: '0x14', structure: ["d 5", "d 5", "d 5"]
    },
    EQUAL: {
        hexCode: '0x15', structure: ["d 5", "d 5", "d 5"]
    },
    LESS: {
        hexCode: '0x16', structure: ["d 5", "d 5", "d 5"]
    },
    RVALUP: {
        hexCode: '0x17', structure: ["d 5", "e 3", "d 16"]
    },
    RVALDOWN: {
        hexCode: '0x18', structure: ["d 5", "e 3", "d 16"]
    },
    LITERALR1: {
        hexCode: '0x19', structure: ["d 24"], label: true
    },
    BTF: {//Bit Test File
        hexCode: '0x1A', structure: ["d 5", "d 5", "d 5"]
    },
    BCF: {//Bit Clear File
        hexCode: '0x1B', structure: ["d 5", "d 5"]
    },
    BSF: {//Bit set File
        hexCode: '0x1C', structure: ["d 5", "d 5"]
    },
    SVR: {//Set Video Register
        hexCode: '0x1D', structure: ["d 5", "d 4"]
    },
    GVR: {//Get Video Register
        hexCode: '0x1E', structure: ["d 5", "d 4"]
    },
    GSP: {//Get Stack Pointer
        hexCode: '0x1F', structure: ["d 5", "d 5"]
    },
    SSP: {//Set Stack Pointer
        hexCode: '0x20', structure: ["d 5"]
    },
    GSR: {//Get State Register
        hexCode: '0x21', structure: ["d 5"]
    },
    LS: {//Load Sprite
        hexCode: '0x22', structure: ["d 5", "d 5", "d 2", "d 5", "d 5"]
    },
    PUSH: {
        hexCode: '0x23', structure: ["d 5"]
    },
    POP: {
        hexCode: '0x24', structure: ["d 5"]
    },
    MOV: {
        hexCode: '0x25', structure: ["d 5", "d 5"]
    },
    GPC: {//Get program counter
        hexCode: '0x26', structure: ["d 5"]
    },
    ADDI: {//Add inmediate
        hexCode: '0x27', structure: ["d 5", "e 3", "d 16"]
    },
    SUBI: {//Sub inmediate
        hexCode: '0x28', structure: ["d 5", "e 3", "d 16"]
    },
    MULI: {//Multiply inmediate
        hexCode: '0x29', structure: ["d 5", "e 3", "d 16"]
    },
    CALL: {//Call
        hexCode: '0x2B', structure: ["d 5", "d 5", "e 13", "d 1"]
    },
    CALLI: {// Call inmediate | Currently not implemented 
        hexCode: '0x2C', structure: ["d 24"], label: true
    },
    RETURN: {//Return
        hexCode: '0x2D', structure: []
    },
    GCA: {//Get controller A
        hexCode: '0x2E', structure: ["d 5"]
    },
    SSTC: {//Set Sprite transparency color
        hexCode: '0x2F', structure: ["d 5"]
    },
    ADDRESS: {
        hexCode: '0x00', structure: ["d 24"], label: true
    }
}
