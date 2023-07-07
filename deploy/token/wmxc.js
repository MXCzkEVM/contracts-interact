const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("WMXC9", {
        from: deployer,
        args: [],
        log: true,
    })
}

module.exports.tags = ["all", "wmxc"]
