const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("bMXC", {
        from: deployer,
        args: ["0x75c4b5c07c6285cb2a14c512eebaf4a6aed09be6"],
        log: true,
        contract: "bMXCToken",
    })
}

module.exports.tags = ["all", "bmxc"]
