const { network, ethers, upgrades } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()

    const TokenContract = await ethers.getContractFactory("DIGIToken")
    const Token = await upgrades.deployProxy(TokenContract, [deployer], {
        initializer: "initialize",
        kind: "uups",
    })
    console.log(Token.address)
}

module.exports.tags = ["all", "grydToken"]
