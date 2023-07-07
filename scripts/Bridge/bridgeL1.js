const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const {
    getTokenVault,
    getMXCL1_A2,
    getMXCL1_A3,
    getMXCToken,
    getMXCCrossToken,
    contracts,
    tokens,
} = require("../../config/address.js")
const {
    deploy,
} = require("@openzeppelin/hardhat-upgrades/dist/utils/deploy.js")
const { parse } = require("dotenv")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

async function main() {
    // let res = await getBalance("0x6aa0DAF6C3d66651a50e7918E6e1fa9E024da1a7")
    // console.log(formatEther(res))
    // stakeA2()
    stakeA3()
    // TokenBridgeFunc()
    // mxcTokenFunc()
}

const stakeA2 = async () => {
    const mxcL1 = await getMXCL1_A2()

    // await mxcL1.stake(parseEther("5000"))
    const stakeVal = await mxcL1.getStakeAmount()
    console.log(formatEther(stakeVal))
}

const stakeA3 = async () => {
    const [deployer] = await ethers.getSigners()
    const mxcL1 = await getMXCL1_A3()

    let mxcToken = await getMXCToken()
    let balance = await mxcToken.balanceOf(deployer.address)
    // console.log(formatEther(balance))
    // await mxcToken.approve(mxcL1.address, parseEther("6000000"))
    // let approveValue = await mxcToken.allowance(deployer.address, mxcL1.address)
    // console.log(formatEther(approveValue))

    let res = await mxcL1.callStatic.depositMxcToken(parseEther("6000000"))
    console.log(res)

    // console.log(deployer.address)

    // const stakeVal = await mxcL1.getMxcTokenBalance(deployer.address)
    // console.log(formatEther(stakeVal))
}

const mxcTokenFunc = async () => {
    const [deployer] = await ethers.getSigners()
    // const mxcToken = new ethers.Contract(
    //     config.c_mxcToken,
    //     mxcTokenABI.abi,
    //     deployer
    // )
    // await mxcToken.approve(mxcL1.address, parseEther("5000"))
    // 检查授权额度
    // let res = await mxcToken.allowance(deployer.address, mxcL1.address)
    // console.log(formatEther(res))
    // await mxcToken["mint(address)"](deployer.address)
    // let mxcToken = await getMXCToken()
    // await mxcToken.callStatic.mint(deployer.address, parseEther("10000"))

    let mxcCrossToken = await getMXCCrossToken()
    // console.log(mxcCrossToken)
    let res = await mxcCrossToken.mint(
        "0xa8eF099f636AFe4210de699f546A37326820aaF7"
        // parseEther("1000")
    )

    // await mxcCrossToken.approve(tokens.MXCToken, parseEther("100"))

    // let mxcToken = await getMXCToken()
    // let res = await mxcToken.exchange(deployer.address, parseEther("100"))
    // console.log(res)
}

const TokenBridgeFunc = async () => {
    const tokenVault = await getTokenVault()
    const destChainId = 5167003
    const to = "0x4faBD45F69D907aC3a3941c34f466A6EFf44bAcA"
    const tokenAddress = "0x15bc370507497AaC421912e339f70Eaa20d04490"
    const amountInWei = ethers.utils.parseUnits("20", 18)
    const gasLimit = BigNumber.from(140000).add(BigNumber.from(3000000))
    const processingFee = 0
    const refundAddress = "0x4faBD45F69D907aC3a3941c34f466A6EFf44bAcA"
    const memo = ""
    const callValue = 0

    console.log(amountInWei, "amountInWei")
    console.log(gasLimit, "gasLimit")
    console.log(processingFee, "processingFee")
    console.log(refundAddress, "refundAddress")

    let res = await tokenVault.estimateGas.sendERC20(
        destChainId,
        to,
        tokenAddress,
        amountInWei,
        gasLimit,
        processingFee,
        refundAddress,
        memo,
        {
            value: processingFee + callValue,
        }
    )
    console.log(res.toString())
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
