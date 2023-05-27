const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = depds
    const { deployer } = await getNamedAccounts()

    // const chainId = network.config.cha
    })
}

module.exports.tags = ["all", "simpleStorage"]
