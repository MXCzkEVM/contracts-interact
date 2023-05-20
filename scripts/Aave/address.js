const { network, ethers } = require("hardhat")

const chainId = network.config.chainId

const PoolConfiguratorAbi = require("../../abi/aave/PoolConfigurator.json")
const PoolDataProviderAbi = require("../../abi/aave/UiPoolDataProviderV3.json")
const PoolAddressesProviderAbi = require("../../abi/aave/PoolAddressesProvider.json")
const PoolAbi = require("../../abi/aave/Pool.json")
const ACLManagerAbi = require("../../abi/aave/ACLManager.json")

const tokens = {
    5167003: {},
    1337: {
        TOKEN_DAI: "0xA90F0fBf5EEA273Dba7a8A91CCD70347d21E22Dd",
        TOKEN_LINK: "0x09F31d01FB2aEA4495533762e88f3602298DFa60",
        TOKEN_AAVE: "0x943206d2c2e189f8cb8F20F1860107af883Ee955",
        TOKEN_USDC: "0xFfD8D1E6DF65E23B6394Eb43a63916cdA0416645",
        TOKEN_WBTC: "0x9dD13c2E090C23e6cde0715b14819FEA673bacFd",
        TOKEN_AAVE: "0x99BdB4d7eFc51804073df85CEDf2D62c4ce573f6",
        TOKEN_EURS: "0x9dE0B5556De7AB725599bA930Db00DaE97987234",
    },
}

const contracts = {
    5167003: {
        POOL_DATA_PROVIDER: "0x476452D8af32327de09343A7baCAC8C497Af77E7",
        POOL_ADDRESS_PROVIDER: "0x6281f1f6B7dC16a020CCd40e400502615695BB89",
        ACL_MANAGER: "0x73b03cd33Bf35edeF8442b942D3Eb449314e8C54",
        POOL_CONFIGURATOR: "0xE98F5d6d82601B4a8C0F62600E870FDa0B62A31D",
        POOL: "0xcd49B6B582b4bDfE2dd74449F2B7037f2301904C",
    },
    1337: {
        POOL_DATA_PROVIDER: "0xC861fB426FE18144563bE55170FB68df5Ec2c84b",
        POOL_ADDRESS_PROVIDER: "0x7e5BE8cC8BAb29f5e1251b6826F682Fe2b347598",
        ACL_MANAGER: "0x3792773ce37c67a1E62c38f9d1eACFEf0A7fee36",
        POOL_CONFIGURATOR: "0xB6C746d402Ad3914D7C5Dc6B53297A0Aca6A4775",
        POOL: "0x1F3Fa41C08063a25236A86B8baBd73A7Eb6Ca7A7",
    },
}

const getPool = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(contracts[chainId].POOL, PoolAbi, deployer)
}

const getPoolConfigurator = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].POOL_CONFIGURATOR,
        PoolConfiguratorAbi,
        deployer
    )
}

const getPoolDataProvider = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].POOL_DATA_PROVIDER,
        PoolDataProviderAbi,
        deployer
    )
}

const getACLManager = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].ACL_MANAGER,
        ACLManagerAbi,
        deployer
    )
}

const getPoolAddressesProvider = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].POOL_ADDRESS_PROVIDER,
        PoolAddressesProviderAbi,
        deployer
    )
}

module.exports = {
    contractsAddress: contracts[chainId],
    tokenAddress: tokens[chainId],
    getPoolConfigurator,
    getPoolDataProvider,
    getACLManager,
    getPoolAddressesProvider,
    getPool,
}
