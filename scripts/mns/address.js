const { network, ethers, deployments } = require("hardhat")
const chainId = network.config.chainId

const ABI_NameWrapper = require("../../abi/mns/NameWrapper.json")

const contracts = {
    // wannsee
    5167003: {
        NameWrapper: "0x2246EdAd0bc9212Bae82D43974619480A9D1f387",
    },
}

const getNameWrapper = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].NameWrapper,
        ABI_NameWrapper,
        deployer
    )
}

module.exports = {
    contracts: contracts[chainId],
    getNameWrapper,
}
