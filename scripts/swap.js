const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

const chainId = network.config.chainId
const config = networkConfig[chainId]

const contractFactory = async (contractName, address) => {
    const contract = await ethers.getContractFactory(contractName)
    return await contract.attach(address)
}

async function main() {
    multCall()
}
const multCall = async () => {
    const [deployer, user1, user2] = await ethers.getSigners()
    let multCall = await contractFactory("Multicall", config.c_multCall)
    let chunk = [
        {
            address: "0x86f515845c3451742d1dB85B77Fd53f83fA1D393",
            callData:
                "0x06f2bf620000000000000000000000006774442e57a9c16da8c447c4b151a4d7f306d92f",
        },
    ]
    const data = chunk.map((obj) => [obj.address, obj.callData])
    let res = await multCall.callStatic.aggregate(data)
    console.log(res)
    // console.log(`Current Value is: ${currentValue}`)

    // const transactionResponse = await simpleStorage
    //     .connect(deployer)
    //     .store(100, { gasLimit: 3000000 })
    // await transactionResponse.wait(1)

    // const updatedValue = await simpleStorage.retrieve()
    // console.log(`Updated Value is: ${updatedValue}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
