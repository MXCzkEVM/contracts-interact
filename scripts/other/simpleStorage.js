const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const { getSimpleStorage } = require("./address.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

async function main() {
    const [deployer] = await ethers.getSigners()
    const simpleStoage = await getSimpleStorage()
    // await wmxc.deposit({ value: parseEther("1000") })

    // let res = await simpleStoage.retrieve()
    let res = await simpleStoage.store(20)
    console.log(res)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
