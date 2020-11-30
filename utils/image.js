function getSizeArray(sizeString) {
    return sizeString
        .split("x")
        .map(val => parseInt(val));
}

module.exports = {
    getSizeArray
}