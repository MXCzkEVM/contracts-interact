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
    421613: {
        name: "arbiture_goerli",
        c_mxcToken: "0x7Ab0Bd16f86Bc84A97387F204A962C9df79b420A",
    },
    5167003: {
        name: "wannsee",
        live: false,
        timeout: 120000000,
    },
    167004: {
        name: "taiko",
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
