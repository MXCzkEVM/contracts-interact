const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    // await deploy(`Ride-Token`, {
    //     args: ["Ride Token", "Ride"],
    //     from: deployer,
    //     contract: "FreeMintERC20",
    //     log: true,
    // })

    // await deploy(`Park-Token`, {
    //     args: ["Park Token", "Park"],
    //     from: deployer,
    //     contract: "FreeMintERC20",
    //     log: true,
    // })

    await deploy(`CrossMxc-Token`, {
        args: ["CrossMxc Token", "MXC"],
        from: deployer,
        contract: "FreeMintERC20",
        log: true,
    })
}

module.exports.tags = ["all", "bridgeL1"]
