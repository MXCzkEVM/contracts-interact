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
const xsdTokenAddress = "0x7d2016B09BF46A7CAABD3b45f9e1D6C485A2c729"

async function main() {
    // const { deployer } = await getNamedAccounts()
    // const chainId = network.config.chainId

    const XSDToken = await ethers.getContractFactory("XSDToken")

    const instance = XSDToken.attach(xsdTokenAddress)
    // let owner = await instance.owner()
    // console.log(owner)

    const data = [
        {
            address: "0xf63218f680C84b34235542f615a0a50b2ec95d9A",
            amount: "1150",
        },
        {
            address: "0xc5f0fE29C827074E53e1fE4B73Db0596866E30e3",
            amount: "848",
        },
    ]

    // let balance = await instance.balanceOf(owner)
    // console.log(formatEther(balance))

    for (let i = 0; i < data.length; i++) {
        item = data[i]
        console.log(`Excute address: ${item.address}, value: ${item.amount}`)
        await instance.transfer(item.address, parseEther(item.amount))
    }

    // await instance.mint(deployer, parseEther("80000"))

    // const instanceV2 = DIGITokenV2.attach(digiTokenAddress)
    // await instanceV2.transferAdminship(
    //     "0x75c4b5c07c6285cb2a14c512eebaf4a6aed09be6"
    // )
    // console.log(owner)

    // // only admin can upgrade
    // await upgrades.upgradeProxy(instance, DIGITokenV2)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
