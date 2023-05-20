const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const h3 = require("h3-js")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

const atokenAbi = require("../../abi/aave/AToken.json")

const chainId = network.config.chainId
const config = networkConfig[chainId]

const aTokenContract = {
    address: "0xa755b8Ba346B18A74cd1a74A48be528a5EdEc446",
    abi: atokenAbi,
}

async function main() {
    const [deployer, user1, user2] = await ethers.getSigners()
    const aToken = new ethers.Contract(
        aTokenContract.address,
        aTokenContract.abi,
        deployer
    )
    // let pool = await aToken.POOL()
    // console.log(pool)

    let treasury = await aToken.RESERVE_TREASURY_ADDRESS()
    console.log(treasury)

    let incentivesController = await aToken.getIncentivesController()
    console.log(incentivesController)

    // let incentivesController = await aToken.getIncentivesController()
    // console.log(incentivesController)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
