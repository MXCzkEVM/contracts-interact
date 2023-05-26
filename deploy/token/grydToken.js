const { network, ethers, upgrades } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()

    const GRYDTokenContract = await ethers.getContractFactory("GRYDToken")
    const GRYDToken = await upgrades.deployProxy(
        GRYDTokenContract,
        [deployer],
        {
            initializer: "initialize",
            kind: "uups",
        }
    )
    console.log(GRYDToken.address)
}

module.exports.tags = ["all", "grydToken"]
