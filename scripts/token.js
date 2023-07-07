const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

const { getDHXToken } = require("../config/address.js")

async function main() {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let dhxToken = await getDHXToken()
    let total = await dhxToken.totalSupply()
    let owner = await dhxToken.owner()

    // await dhxToken.mint(
    //     "0x45A83F015D0265800CBC0dACe1c430E724D49cAc",
    //     parseEther("9000000000")
    // )
    // console.log(res)

    console.log(formatEther(total))
    // console.log(owner)
    // deployer balance
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
