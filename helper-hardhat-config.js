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
        c_simpleStorage: `0x77E5a8bE0bb40212458A18dEC1A9752B04Cb6EA1`,
        c_moonToken: `0xe031013A7B7Caf05FC20Bdc49B731E3F2f0cAfFd`,
    },
    167004: {
        name: "taiko",
        Bull: "0x6048e5ca54c021D39Cd33b63A44980132bcFA66d",
        Horse: "0xCea5BFE9542eDf828Ebc2ed054CA688f0224796f",
        c_simpleStorage: `0x6F17DbD2C10d11f650fE49448454Bf13dFA91641`,
        c_moonToken: `0x6c3c72297C448A4BAa6Fc45552657Ad68378E3E1`,
        c_faucet: `0x3c195C14D329C6B91Fd241d09a960d5A31eA8742`,
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
