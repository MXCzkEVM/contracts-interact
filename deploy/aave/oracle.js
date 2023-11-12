const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")
const parseEther = ethers.utils.parseEther

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    // const NORMOL_INITAL = "50"

    // eth/usd
    // await deploy(`MXCUSDMockAggregator`, {
    //     args: [parseEther("0.01").div(10 ** 10)],
    //     from: deployer,
    //     contract: "MockAggregator",
    //     log: true,
    // })

    // await deploy(`TestErc20PriceAggregator`, {
    //     args: [parseEther(NORMOL_INITAL).div(10 ** 8)],
    //     from: deployer,
    //     contract: "MockAggregator",
    //     log: true,
    // })

    await deploy(`DigiPriceAggregator`, {
        args: [parseEther("1").div(10 ** 10)],
        from: deployer,
        contract: "MockAggregator",
        log: true,
    })
}

module.exports.tags = ["all", "aave-oracle"]
