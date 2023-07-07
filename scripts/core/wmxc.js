const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

async function main() {
    await wmxcFunc()
}

const wmxcFunc = async () => {
    const [deployer] = await ethers.getSigners()
    const wmxc = await getWmxc()
    // await wmxc.deposit({ value: parseEther("1000") })

    let bal = await wmxc.balanceOf(deployer.address)
    console.log(formatEther(bal))
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
