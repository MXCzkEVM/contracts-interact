const {
    ethers,
    getNamedAccounts,
    deployments,
    network,
    upgrades,
} = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

// wannsee_mainnet
const digiTokenAddress = "0x77E5a8bE0bb40212458A18dEC1A9752B04Cb6EA1"

async function main() {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const DIGITokenV2 = await ethers.getContractFactory("DIGITokenV2")

    const instance = DIGITokenV2.attach(digiTokenAddress)
    let owner = await instance.owner()
    console.log(owner)
}

const upgrade = async () => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const DIGIToken = await ethers.getContractFactory("DIGIToken")
    const DIGITokenV2 = await ethers.getContractFactory("DIGITokenV2")

    const instance = DIGITokenV2.attach(digiTokenAddress)
    let owner = await instance.owner()
    console.log(owner)

    const instanceV2 = DIGITokenV2.attach(digiTokenAddress)
    await instanceV2.transferAdminship(
        "0x75c4b5c07c6285cb2a14c512eebaf4a6aed09be6"
    )
    console.log(owner)

    // only admin can upgrade
    await upgrades.upgradeProxy(instance, DIGITokenV2)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
