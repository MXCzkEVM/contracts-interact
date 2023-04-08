const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    // const chainId = network.config.chainId
    await deploy("MoonERC20", {
        from: deployer,
        args: ["Moon", "Moon Token"],
        log: true,
    })

    const MoonERC = await deployments.get("MoonERC20")
    console.log(`moon token address: ${MoonERC.address}`)
    await deploy("Faucet", {
        from: deployer,
        args: [MoonERC.address],
        log: true,
    })
}

module.exports.tags = ["all", "faucet"]
