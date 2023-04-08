const developmentChains = ["hardhat", "localhost"]
const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
    },
    5167003: {
        name: "wannsee",
    },
    167004: {
        name: "taiko",
        Bull: "0x6048e5ca54c021D39Cd33b63A44980132bcFA66d",
        Horse: "0xCea5BFE9542eDf828Ebc2ed054CA688f0224796f",
    },
    11155111: {
        name: "sepolia",
        Bull: "0x5B9fEDd37f0B92E7E282B19cEbCF06F57B77C604",
        Horse: "0x1E8C104D068F22D351859cdBfE41A697A98E6EA2",
    },
}

module.exports = {
    networkConfig,
    developmentChains,
}
