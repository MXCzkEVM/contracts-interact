const { network, ethers, upgrades } = require("hardhat")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

require("dotenv").config()

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const BigNumber = ethers.BigNumber.from
const getBalance = ethers.provider.getBalance

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()

    // const [signer] = await ethers.getSigners()
    // const fee = await ethers.provider.getFeeData()
    // console.log(fee.gasPrice?.mul(150).div(100).toString())

    // const [signer] = await ethers.getSigners()
    // console.log(signer.address)

    // await signer.sendTransaction({
    //     from: signer.address,
    //     to: signer.address,
    //     value: parseEther("5"),
    //     nonce: 167,
    //     gasPrice: fee.gasPrice?.mul(150).div(100),
    // })

    const XSDTokenContract = await ethers.getContractFactory("XSDToken")
    const xsdToken = await upgrades.deployProxy(XSDTokenContract, [deployer], {
        initializer: "initialize",
        kind: "uups",
        timeout: 120000,
        pollingInterval: 25000,
    })
    console.log(xsdToken.address)
}

module.exports.tags = ["all", "xsdToken"]
