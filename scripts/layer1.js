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
    // stake()
    let res = await getBalance("0x6aa0DAF6C3d66651a50e7918E6e1fa9E024da1a7")
    console.log(formatEther(res))
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
    // 检查授权额度
    // let res = await mxcToken.allowance(deployer.address, mxcL1.address)
    // console.log(formatEther(res))

    // await mxcL1.stake(parseEther("5000"))
    const stakeVal = await mxcL1.getStakeAmount()
    console.log(formatEther(stakeVal))

    // await mxcToken["mint(address)"](deployer.address)
    // await mxcToken.callStatic.mint(deployer.address, parseEther("10000"))
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})