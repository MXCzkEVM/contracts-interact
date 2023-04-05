const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

async function main() {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // deployer balance
    let user_bal = formatEther(await getBalance(deployer))
    console.log(`address: ${deployer}`)
    console.log(`balance: ${user_bal}`)

    // bll token && horse token
    const Bull = await ethers.getContractAt(
        "IERC20",
        networkConfig[chainId].Bull
    )
    const Horse = await ethers.getContractAt(
        "IERC20",
        networkConfig[chainId].Horse
    )
    let bull_bal = await Bull.balanceOf(deployer)
    let horse_bal = await Horse.balanceOf(deployer)
    console.log(`Bull balance: ${bull_bal}`)
    console.log(`Horse balance: ${horse_bal}`)

    // interact contract
    const simpleStorage = await ethers.getContract("SimpleStorage")
    console.log(simpleStorage.address)
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)

    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated Value is: ${updatedValue}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
