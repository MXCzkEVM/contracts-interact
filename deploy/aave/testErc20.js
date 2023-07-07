const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    // await deploy("ERC20FixedSupply", {
    //     from: deployer,
    //     args: ["XSD", "XSD", 100000000],
    //     log: true,
    // })

    // await deploy("ERC20FixedSupply", {
    //     from: deployer,
    //     args: ["DHX", "DHX", 100000000],
    //     log: true,
    // })

    // await deploy("ERC20FixedSupply", {
    //     from: deployer,
    //     args: ["WMXC", "WMXC", 100000000],
    //     log: true,
    // })
    // await deploy("ERC20FixedSupply", {
    //     from: deployer,
    //     args: ["PARK", "PARK", 100000000],
    //     log: true,
    // })

    // await deploy("ERC20FixedSupply", {
    //     from: deployer,
    //     args: ["RIDE", "RIDE", 100000000],
    //     log: true,
    // })
}

module.exports.tags = ["all", "aave-token"]
