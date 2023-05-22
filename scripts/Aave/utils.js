const isValidAddress = (value) =>
    !!value &&
    isAddress(value) &&
    getAddress(value) !== getAddress(ZERO_ADDRESS)

const chunk = (arr, chunkSize) => {
    return arr.reduce(
        (prevVal, currVal, currIndx, array) =>
            !(currIndx % chunkSize)
                ? prevVal.concat([array.slice(currIndx, currIndx + chunkSize)])
                : prevVal,
        []
    )
}

module.exports = {
    chunk,
    isValidAddress,
}
