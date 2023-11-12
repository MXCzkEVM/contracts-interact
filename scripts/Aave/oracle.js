const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const { getDeployMents } = require("./address.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

async function main() {
    const mxcusd = await getDeployMents("MXCUSDMockAggregator")
    let price = await mxcusd.latestAnswer()
    console.log(price.toString())
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
