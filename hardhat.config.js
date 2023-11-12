require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("hardhat-deploy")
require("@nomicfoundation/hardhat-chai-matchers")
require("@openzeppelin/hardhat-upgrades")
// require("hardhat-gas-reporter")
// require("solidity-coverage")
// require("hardhat-storage-layout")
// require("@nomicfoundation/hardhat-toolbox")

const PRIVATE_KEY_MXCADMIN1 = process.env.PRIVATE_KEY_MXCADMIN1
const PRIVATE_KEY_DOUGHNUT = process.env.PRIVATE_KEY_DOUGHNUT
const PRIVATE_KEY_MUFFIN = process.env.PRIVATE_KEY_MUFFIN
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2
const PRIVATE_KEY3 = process.env.PRIVATE_KEY3
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL

module.exports = {
    defaultNetwork: "hardhat",
    namedAccounts: {
        deployer: {
            default: 0,
            167004: 0,
            5167003: 0,
            1337: 0,
        },
        user: {
            default: 1,
        },
    },
    networks: {
        ganache: {
            chainId: 1337,
            url: "HTTP://127.0.0.1:7545",
            gasPrice: 100,
        },
        hardhat: {
            chainId: 31337,
            gasPrice: 6000000000000,
            live: true,
            saveDeployments: true,
        },
        arbiture_goerli: {
            // url: "https://goerli-rollup.arbitrum.io/rpc",
            url: "https://goerli-rollup.arbitrum.io/rpc",
            chainId: 421613,
            accounts: [PRIVATE_KEY_MXCADMIN1, PRIVATE_KEY_DOUGHNUT],
            saveDeployments: true,
        },
        wannsee: {
            // url: "https://wannsee-rpc.mxc.com",
            url: "http://207.246.99.8:8545",
            chainId: 5167003,
            accounts: [PRIVATE_KEY_DOUGHNUT, PRIVATE_KEY_MXCADMIN1],
            // gasPrice: 6000000000000,
            allowUnlimitedContractSize: true,
            saveDeployments: true,
        },
        wannsee_mainnet: {
            // url: "https://rpc.mxc.com",
            url: "http://207.246.101.30:8545",
            chainId: 18686,
            accounts: [PRIVATE_KEY_DOUGHNUT, PRIVATE_KEY_MUFFIN],
            saveDeployments: true,
            allowUnlimitedContractSize: true,
            // gwei
            gasPrice: 600 * 10000 * 1000000000,
            // gasLimit: 30000000,
        },
        taiku: {
            url: "https://rpc.a2.taiko.xyz",
            chainId: 167004,
            accounts: [PRIVATE_KEY_DOUGHNUT, PRIVATE_KEY2, PRIVATE_KEY3],
            gasPrice: 250000000000,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY_DOUGHNUT],
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.18",
            },
            {
                version: "0.8.17",
            },
            {
                version: "0.8.15",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    },
                },
            },

            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    },
                },
            },

            {
                version: "0.6.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    },
                },
            },
            {
                version: "0.6.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    },
                },
            },
            {
                version: "0.5.16",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    },
                },
            },
            {
                version: "0.4.24",
            },
            {
                version: "0.4.18",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    },
                },
            },
        ],
    },
}
