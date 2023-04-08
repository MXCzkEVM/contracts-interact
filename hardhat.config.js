require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("hardhat-deploy")
require("@nomicfoundation/hardhat-chai-matchers")

// require("hardhat-gas-reporter")
// require("solidity-coverage")
// require("hardhat-storage-layout")
// require("@nomicfoundation/hardhat-toolbox")
// require("@openzeppelin/hardhat-upgrades")

const PRIVATE_KEY = process.env.PRIVATE_KEY
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.4",
            },
            {
                version: "0.8.17",
            },
        ],
    },
    defaultNetwork: "hardhat",
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    networks: {
        hardhat: {
            chainId: 31337,
        },
        wannsee: {
            url: "https://wannsee-rpc.mxc.com",
            chainId: 5167003,
            accounts: [PRIVATE_KEY],
            gasPrice: 5000000,
            timeout: 50000,
        },
        taiku: {
            url: "https://rpc.a2.taiko.xyz",
            chainId: 167004,
            accounts: [PRIVATE_KEY],
            gasPrice: 250000000000,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },
}
