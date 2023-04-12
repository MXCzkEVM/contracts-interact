const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

const chainId = network.config.chainId
const config = networkConfig[chainId]

const mxcL1ABI = require("../abi/MXCL1.json")
const mxcTokenABI = require("../abi/MXCToken.json")

async function main() {
    stake()
}

const stake = async () => {
    const [deployer] = await ethers.getSigners()

    const mxcL1 = new ethers.Contract(config.c_mxcL1, mxcL1ABI.abi, deployer)
    const mxcToken = new ethers.Contract(
        config.c_mxcToken,
        mxcTokenABI.abi,
        deployer
    )
    // await mxcToken.approve(mxcL1.address, parseEther("5000"))
    // await mxcL1.stake(parseEther("5000"))
    // const stakeVal = await mxcL1.getStakeAmount()
    // console.log(formatEther(stakeVal))

    await mxcToken["mint(address)"](deployer.address)
    // console.log()
    // await mxcToken.callStatic.mint(deployer.address, parseEther("10000"))
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
