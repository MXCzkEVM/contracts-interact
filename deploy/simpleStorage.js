const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    // const chainId = network.config.chainId

    // gas乘以个 1.5 或者 2
    // const gasPrice = (await ethers.provider.getGasPrice()).mul(5)
    await deploy("SimpleStorage", {
        from: deployer,
        args: [],
        log: true,
        // gasPrice: 250000000000,
    })
}

module.exports.tags = ["all", "simpleStorage"]
