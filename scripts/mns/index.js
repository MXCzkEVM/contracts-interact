const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const h3 = require("h3-js")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const { getNameWrapper } = require("./address.js")
const namehash = require("eth-ens-namehash").hash

// const chainId = network.config.chainId
// const config = networkConfig[chainId]

async function main() {
    nameWrapperFunc()
}

const nameWrapperFunc = async () => {
    const [addr1, addr2] = await ethers.getSigners()
    // console.log(addr1.address, addr2.address)

    // 域名权限
    const nameWrapper = await getNameWrapper()

    // 域名所属
    let res = await nameWrapper.ownerOf(
        ethers.BigNumber.from(namehash("rdmoon.mxc"))
    )
    console.log(res.toString())
    // 0xA8F36ad950Da48Cb0Ab833aAd8FebE6BF4cB3f0a

    // 授权
    // await nameWrapper.setApprovalForAll(
    //     "0x4faBD45F69D907aC3a3941c34f466A6EFf44bAcA",
    //     true
    // )

    // 获取是否授权
    // let isApprove = await nameWrapper.isApprovedForAll(
    //     "0x45A83F015D0265800CBC0dACe1c430E724D49cAc",
    //     "0x4faBD45F69D907aC3a3941c34f466A6EFf44bAcA"
    // )
    // console.log(isApprove)

    // console.log()

    // 转移权限
    // let isTrans = await nameWrapper.callStatic.safeTransferFrom(
    //     "0x45A83F015D0265800CBC0dACe1c430E724D49cAc",
    //     "0x4faBD45F69D907aC3a3941c34f466A6EFf44bAcA",
    //     namehash("bruce.mxc"),
    //     1,
    //     "0x"
    // )
    // console.log(isTrans)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
