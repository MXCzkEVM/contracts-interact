const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config.js")
const h3 = require("h3-js")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

const mep1002Abi = require("../abi/MEP1002Token.json")
const mepNameAbi = require("../abi/MEP1002NamingToken.json")

const chainId = network.config.chainId
const config = networkConfig[chainId]

/* 
mep1002.mint('0x87756a7a4ffffff')
0x58b997c6e88ca0404ccfa790fa224a29c3b0b95350511494f20041270df82949
mep1002.setName('0x87756a7a4ffffff', '63970416519386779895700883807905088887598688597384251015603919759227108350085')
0x5382eafc1d152b8948cecbf56ccdb8f4bc81c04e2258a12ce1447b1ce055c2c8
*/

const labelhash = (label) =>
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label))

async function main() {
    mep1002()
}

function getRandomH3Index(res) {
    const MAX_LATITUDE = (90 * Math.PI) / 180
    const MAX_LONGITUDE = (180 * Math.PI) / 180

    const latitude = Math.random() * MAX_LATITUDE
    const longitude = Math.random() * MAX_LONGITUDE
    return h3.latLngToCell(latitude, longitude, res)
}

const mep1002 = async () => {
    const [deployer, user1, user2] = await ethers.getSigners()
    const mep1002 = new ethers.Contract(config.c_mep1002, mep1002Abi, deployer)
    const mepName = new ethers.Contract(config.c_mep_name, mepNameAbi, deployer)
    const tokenName = await mep1002.tokenNames("0x87756a7a4ffffff")
    console.log(tokenName)

    // const h3IndexRes7 = getRandomH3Index(7)
    // const h3IndexRes7Big = BigNumber.from(`0x${h3IndexRes7}`)
    // let res = await mep1002.mint(h3IndexRes7Big)
    // console.log(res)
    // let nameWrapperTokenId = BigNumber.from(
    //     "63970416519386779895700883807905088887598688597384251015603919759227108350085"
    // )
    // const h3IndexRes7Big = BigNumber.from(`0x87756a7a4ffffff`)
    // let res = await mep1002.callStatic.setName(
    //     h3IndexRes7Big,
    //     nameWrapperTokenId
    // )
    // await mep1002.setName(h3IndexRes7Big, nameWrapperTokenId)
    // console.log(labelhash("robot.MXC"))

    // let res = await mepName.ownerOf(BigNumber.from(`0x87756a7a4ffffff`))
    // console.log(res)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
