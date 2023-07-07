const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const { geMoonToken, getDeployment } = require("../../config/address.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

/* 
deployer - 水龙头合约 token合约管理员 
user1 - 服务器调用合约的账户 (需要gas调用合约)
user2 - 客户端请求合约地址
*/

async function main() {
    const [deployer, user] = await ethers.getSigners()

    // console.log(deployer.address)

    let Faucet = await getDeployment("Faucet")
    let MoonToken = await geMoonToken()

    //===========User============
    // const userMoonBalance = await MoonToken.balanceOf(user.address)
    // const userBalance = await getBalance(user.address)
    // console.log(`${user.address} - moon token balance : ${userMoonBalance}`)
    // console.log(`balance of ${user.address} : ${userBalance}`)

    // ===========Faucet============
    // const totalSupply = await MoonToken.totalSupply()
    // const isOwner = await MoonToken.owners(Faucet.address)
    // const faucetMoonBalance = await MoonToken.balanceOf(Faucet.address)
    // const faucetBalance = formatEther(await getBalance(Faucet.address))
    // const mxcAllowed = formatEther(await Faucet.mxcAllowed())
    // const moonAllowed = formatEther(await Faucet.moonAllowed())
    // console.log(`${Faucet.address} is owner: ${isOwner}`)
    // console.log(`Current MoonToken totalSupply is: ${totalSupply}`)
    // console.log(`Faucet balance: ${faucetBalance}`)
    // console.log(`Faucet moon token balance : ${faucetMoonBalance}`)
    // console.log(`Faucet mxcAllowed : ${mxcAllowed}`)
    // console.log(`Faucet moonAllowed : ${moonAllowed}`)

    // ======== requestMoon ========
    // 1 - mint token to faucet contract
    // await MoonToken.mint(Faucet.address, parseEther("100000"))

    // 2 - deployer set faucet as moon token owner
    // await MoonToken.setOwner(Faucet.address)
    // console.log(user.address)

    // 3 - user requestMoon token, user need some ether
    // await Faucet.connect(user).requestMoon(user.address)
    // ======== requestMoon ========

    // ======== requestMxc ========
    // 1 - send ether to faucet contract
    // console.log(Faucet.address)

    // 2 - set mxcAllowed 300,0000, default is to high
    // await Faucet.setMxcAllowed(parseEther("5000"))
    // console.log(res)
    console.log(formatEther(await Faucet.mxcAllowed()))

    // 3 - user requestMxc, user need some ether
    // let res = await Faucet.connect(user).callStatic.requestMXC(user.address)
    // let gasLimit = await Faucet.connect(user).estimateGas.requestMXC(
    //     "0x4faBD45F69D907aC3a3941c34f466A6EFf44bAcA"
    // )
    // console.log(formatEther(gasLimit))
    // let res = await Faucet.callStatic.requestMXC(
    //     "0x25fcd6BbB77E415c1de7A6E1C9c7176953877a76"
    // )
    // console.log(res)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
