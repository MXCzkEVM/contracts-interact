const { network, ethers, deployments } = require("hardhat")
const chainId = network.config.chainId

const ABI_MEP1002 = require("../../abi/mep/MEP1002Token.json")
const ABI_MEP1004 = require("../../abi/mep/MEP1004Token.json")
const ABI_MEPName = require("../../abi/mep/MEP1002NamingToken.json")

const contracts = {
    // wannsee
    5167003: {
        WMXC: "0x6807F4B0D75c59Ef89f0dbEF9841Fb23fFDF105D",
        MEP1002: "0xFf3159E5779C61f5d2965305DC1b9E8a1E16a39c",
        MEP1004: "0x5CE293229a794AF03Ec3c95Cfba6b1058D558026",
        MEPName: "0xad5a1855A383732f311241c1A4F9510da0Ad0743",

        MEP1002BlockNumber: 356,
        MEP1002TokenUpdateNameStart: 645464,
        MEP1002Transfer: 61546,
        MEPNameStart: 61546,
    },
    18686: {
        MEP1002: "0x068234de9429FaeF2585A6eD9A52695cDa78aFE1",
        MEP1004: "0x8Ff08F39B1F4Ad7dc42E6D63fd25AeE47EA801Ce",
        MEPName: "0x7407459464741c17F8341D7EAFED5a4A5d9303b4",

        MEP1002BlockNumber: 356,
        MEP1002TokenUpdateNameStart: 645464,
        MEP1002Transfer: 61546,
        MEPNameStart: 61546,
    },
}

const getMep1002 = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].MEP1002,
        ABI_MEP1002,
        deployer
    )
}

const getMep1002Name = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].MEPName,
        ABI_MEPName,
        deployer
    )
}

const getMep1004 = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].MEP1004,
        ABI_MEP1004,
        deployer
    )
}

module.exports = {
    contracts: contracts[chainId],
    getMep1002,
    getMep1004,
    getMep1002Name,
}
