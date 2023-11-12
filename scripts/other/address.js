const { network, ethers, deployments } = require("hardhat")
const chainId = network.config.chainId
const abiSimpleStorage = require("../../abi/other/simpleStorage.json")

const contracts = {
    // arb-goerli
    421613: {},
    // wannsee
    5167003: {
        WMXC: "0x6807F4B0D75c59Ef89f0dbEF9841Fb23fFDF105D",
        simpleStorage: "0x153f143dC8FED1A07eAf1482c0277012CFC77937",
    },
    // ganache
    18686: {
        simpleStorage: "0x571AadC24c3F583c91E9BD652e85c55311Fc0E87",
    },
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

const getSimpleStorage = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].simpleStorage,
        abiSimpleStorage,
        deployer
    )
}

module.exports = {
    getDeployment,
    contracts: contracts[chainId],
    tokens: tokens[chainId],

    getSimpleStorage,
}
