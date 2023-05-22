const { network, ethers, upgrades } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()

    const DHXTokenContract = await ethers.getContractFactory("DHXToken")
    const DHXToken = await upgrades.deployProxy(DHXTokenContract, [deployer], {
        initializer: "initialize",
        kind: "uups",
    })
    console.log(DHXToken.address)
}

module.exports.tags = ["all", "dhxToken"]
