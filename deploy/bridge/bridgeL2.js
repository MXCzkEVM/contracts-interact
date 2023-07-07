const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    // const chainId = network.config.chainId

    await deploy(`XSD-Token`, {
        args: ["XSD Token", "XSD", 100000000],
        from: deployer,
        contract: "ERC20FixedSupply",
        log: true,
    })

    await deploy(`Moon-Token`, {
        args: ["Moon Token", "Moon"],
        from: deployer,
        contract: "MoonERC20",
        log: true,
    })

    const MoonERC = await deployments.get("Moon-Token")
    console.log(`moon token address: ${MoonERC.address}`)

    await deploy("Faucet", {
        from: deployer,
        args: [MoonERC.address],
        log: true,
    })
}

module.exports.tags = ["all", "bridgeL2"]
