const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

const chainId = network.config.chainId
const config = networkConfig[chainId]

/* 
deployer - 水龙头合约 token合约管理员 
user1 - 服务器调用合约的账户 (需要gas调用合约)
user2 - 客户端请求合约地址
*/

const contractFactory = async (contractName, address) => {
    const contract = await ethers.getContractFactory(contractName)
    return await contract.attach(address)
}

async function main() {
    // simpleStorageMain()
    faucetMain()
}

const faucetMain = async () => {
    const [deployer, user1, user2] = await ethers.getSigners()

    let MoonToken = await contractFactory("MoonERC20", config.c_moonToken)
    let Faucet = await contractFactory("Faucet", config.c_faucet)

    // ======== user ========
    const Balance = await getBalance(user2.address)
    console.log(`balance of ${user2.address} : ${Balance}`)
    // ======== user ========

    // ======== moonToken ========
    // const totalSupply = await MoonToken.totalSupply()
    // console.log(`Current totalSupply is: ${totalSupply}`)
    // const isOwner = await MoonToken.owners(Faucet.address)
    // console.log(`${Faucet.address} is owner: ${isOwner}`)
    // const faucetBalance = await MoonToken.balanceOf(Faucet.address)
    // console.log(`faucet moon token balance : ${faucetBalance}`)
    // ======== moonToken ========

    // ======== faucet ========
    // let moonTokenAddress = await Faucet.moonToken()
    // console.log(moonTokenAddress, "moonTokenAddress")
    // console.log(formatEther(await getBalance(Faucet.address)))
    // console.log(formatEther(await Faucet.mxcAllowed()))
    // console.log(formatEther(await Faucet.moonAllowed()))
    // ======== faucet ========

    // ======== requestMoon ========
    // 1 - mint token to faucet contract
    // await MoonToken.connect(deployer).mint(Faucet.address, parseEther("100000"))

    // 2 - deployer set faucet as moon token owner
    // await MoonToken.connect(deployer).setOwner(Faucet.address)

    // 3 - user1 requestMoon token, user1 need some ether
    // await Faucet.connect(user1).requestMoon(user2.address, {
    //     gasLimit: 3000000,
    // })
    // ======== requestMoon ========

    // ======== requestMxc ========
    // 1 - send ether to faucet contract
    // console.log(Faucet.address)

    // 2 - set mxcAllowed 300,0000, default is to high
    // await Faucet.connect(deployer).setMxcAllowed(3000000)

    // 3 - user1 requestMxc, user1 need some ether
    // await Faucet.connect(user1).requestMXC(user2.address, {
    //     gasLimit: 3000000,
    // })

    // ======== requestMxc ========
    // let tx = await Faucet.connect(user1).callStatic.requestMoon(user2.address, {
    //     gasLimit: 3000000,
    // })
    // let tx = await Faucet.connect(user1).callStatic.requestMXC(user2.address, {
    //     gasLimit: 3000000,
    // })
    // console.log(tx)
}

const simpleStorageMain = async () => {
    let simpleStorage = await contractFactory(
        "SimpleStorage",
        config.c_simpleStorage
    )
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    // const transactionResponse = await simpleStorage.store(7)
    // await transactionResponse.wait(1)

    // const updatedValue = await simpleStorage.retrieve()
    // console.log(`Updated Value is: ${updatedValue}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
