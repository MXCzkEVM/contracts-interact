const { network, ethers, deployments } = require("hardhat")
const chainId = network.config.chainId
const tokenVaultAbi = require("../abi/bridge/tokenVault.json")
const MXCL1_A2Abi = require("../abi/bridge/MXCL1-A2.json")
const MXCL1_A3Abi = require("../abi/bridge/MXCL1-A3.json")
const MXCTokenAbi = require("../abi/bridge/MXCToken.json")
const WMXC_ABI = require("../abi/swap/WMXC.json")

const contracts = {
    // arb-goerli
    421613: {
        TOKEN_VAULT: "0xbBf26D9E55311a5f9a184c330B5dA2C834d1Ed4B",
        MXCL1_A2: "0xecA2Cd0E14B4dc88F804b159fd2f88a9a90E9c37",
        // MXCL1_A3: "0xaFC87201573c7AE994ab1bb546e3DB3A91F7F78A",
        MXCL1_A3: "0x92a78e9D3DfcfDe54d59845248508CAa59fe6d4f",
    },
    // wannsee
    5167003: {
        WMXC: "0x6807F4B0D75c59Ef89f0dbEF9841Fb23fFDF105D",
    },
    // ganache
    1337: {},
}

const tokens = {
    421613: {
        MXCToken: "0xFfaBAacF13C298B2d313F654931ED99858A005Ff",
        MXCCrossToken: "0xA6E0604F531Fd9e5a7D60c622eb6866e26320583",
    },
    5167003: {
        DHXToken: "0x8bC7cf83f5F83781Ec85B78d866222987Ae24657",
    },
    16868: {},
}

const getDeployment = async (contract) => {
    const [deployer] = await ethers.getSigners()
    let { address, abi } = await deployments.get(contract)
    return new ethers.Contract(address, abi, deployer)
}

const contractAttach = async (contractName, address) => {
    const contract = await ethers.getContractFactory(contractName)
    return await contract.attach(address)
}

const getDHXToken = async () => {
    const [deployer] = await ethers.getSigners()
    return contractAttach("DHXToken", tokens[chainId].DHXToken)
}

const getWmxc = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(contracts[chainId].WMXC, WMXC_ABI, deployer)
}

const geMoonToken = async () => {
    const [deployer] = await ethers.getSigners()
    let { address, abi } = await deployments.get("Moon-Token")
    return new ethers.Contract(address, abi, deployer)
}

const getTokenVault = async () => {
    const [deployer] = await ethers.getSigners()

    return new ethers.Contract(
        contracts[chainId].TOKEN_VAULT,
        tokenVaultAbi,
        deployer
    )
}

const getMXCL1_A2 = async () => {
    const [deployer] = await ethers.getSigners()

    return new ethers.Contract(
        contracts[chainId].MXCL1_A2,
        MXCL1_A2Abi.abi,
        deployer
    )
}

const getMXCL1_A3 = async () => {
    const [deployer] = await ethers.getSigners()

    return new ethers.Contract(
        contracts[chainId].MXCL1_A3,
        MXCL1_A3Abi,
        deployer
    )
}

const getMXCToken = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(tokens[chainId].MXCToken, MXCTokenAbi, deployer)
}

const getMXCCrossToken = async () => {
    const [deployer] = await ethers.getSigners()
    let { address, abi } = await deployments.get("CrossMxc-Token")
    return new ethers.Contract(address, abi, deployer)
}

module.exports = {
    getDeployment,
    contracts: contracts[chainId],
    tokens: tokens[chainId],

    getWmxc,
    getTokenVault,

    getMXCL1_A2,
    getMXCL1_A3,
    geMoonToken,
    getDHXToken,
    getMXCToken,
    getMXCCrossToken,
}
