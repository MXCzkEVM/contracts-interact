const { ethers } = require("hardhat")

const getBlockTime = async () => {
    let blockNum = await ethers.provider.getBlockNumber()
    let block = await ethers.provider.getBlock(blockNum)
    return block.timestamp
}

const increaseTime = async (increaseTime) => {
    await network.provider.send("evm_increaseTime", [increaseTime])
    await network.provider.send("evm_mine")
}

const deployContracts = async (contractName, args = [], data = {}) => {
    const contratcFactory = await ethers.getContractFactory(contractName)
    contract = await contratcFactory.deploy(...args, data)
    return contract
}

// 多签 按顺序 从小到大签
const getSignature = async (users, hash) => {
    // sort the users
    let newSort = users.sort((a, b) => a.address - b.address)
    let signature = "0x"

    for (let i = 0; i < newSort.length; i++) {
        let sigItem = await newSort[i].signMessage(ethers.utils.arrayify(hash))
        signature = `${signature}${sigItem.replace("0x", "")}`
    }

    return signature
}

module.exports = {
    getBlockTime,
    increaseTime,
    getSignature,
    deployContracts,
}
