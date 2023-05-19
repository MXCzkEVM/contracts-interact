const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

const uiPoolDataProviderAbi = require("../../abi/aave/UiPoolDataProviderV3.json")
const PoolAddressesProviderAbi = require("../../abi/aave/PoolAddressesProvider.json")
const PoolConfiguratorAbi = require("../../abi/aave/PoolConfigurator.json")
const PoolAbi = require("../../abi/aave/Pool.json")
const ACLManagerAbi = require("../../abi/aave/ACLManager.json")

const {
    loadPoolConfig,
    getTreasuryAddress,
    getReserveAddresses,
} = require("./market-config-helpers.js")

const chainId = network.config.chainId
const config = networkConfig[chainId]

const aaveContract = {
    UI_POOL_DATA_PROVIDER: "0x476452D8af32327de09343A7baCAC8C497Af77E7",
    POOL_ADDRESS_PROVIDER: "0x6281f1f6B7dC16a020CCd40e400502615695BB89",
    ACL_MANAGER: "0x73b03cd33Bf35edeF8442b942D3Eb449314e8C54",
    POOL_CONFIGURATOR: "0xE98F5d6d82601B4a8C0F62600E870FDa0B62A31D",
    POOL: "0xcd49B6B582b4bDfE2dd74449F2B7037f2301904C",
}

async function main() {
    // uiPoolData()
    const MARKET_NAME = "wannsee"
    initReserves(MARKET_NAME)
}

const initReserves = async (MARKET_NAME) => {
    const [deployer, user1, user2] = await ethers.getSigners()
    const network = hre.network.name

    const poolConfig = loadPoolConfig(MARKET_NAME)

    const addressProviderArtifact = new ethers.Contract(
        aaveContract.POOL_ADDRESS_PROVIDER,
        PoolAddressesProviderAbi,
        deployer
    )

    const {
        ATokenNamePrefix,
        StableDebtTokenNamePrefix,
        VariableDebtTokenNamePrefix,
        SymbolPrefix,
        ReservesConfig,
        RateStrategies,
    } = poolConfig

    const treasuryAddress = await getTreasuryAddress(poolConfig, network)
    const reservesAddresses = await getReserveAddresses(poolConfig, network)

    // CHUNK CONFIGURATION
    const initChunks = 1
    // Initialize variables for future reserves initialization
    let reserveTokens = []
    let reserveInitDecimals = []
    let reserveSymbols = []
    let initInputParams = []
    let strategyAddresses = {}
    let strategyAddressPerAsset = {}
    let aTokenType = {}
    let aTokenImplementationAddress =
        "0xa755b8Ba346B18A74cd1a74A48be528a5EdEc446"
    let stableDebtTokenImplementationAddress =
        "0x22BC02Bf14375785935c3c66fd85d26d133Ab9C9"
    let variableDebtTokenImplementationAddress =
        "0xb9c2e4A309b1B1151fF171237CA68646c1dC5017"

    const reserves = Object.entries(ReservesConfig).filter(
        ([_, { aTokenImpl }]) =>
            aTokenImpl === "DelegationAwareAToken" || aTokenImpl === "AToken"
    )
    for (let [symbol, params] of reserves) {
        const { strategy, aTokenImpl, reserveDecimals } = params
        if (!strategyAddresses[strategy.name]) {
            // Strategy does not exist, load it
            strategyAddresses[strategy.name] = (
                await deployments.get(`ReserveStrategy-${strategy.name}`)
            ).address
        }
        // 将策略模型与token绑定
        strategyAddressPerAsset[symbol] = strategyAddresses[strategy.name]
        console.log(
            "Strategy address for asset %s: %s",
            symbol,
            strategyAddressPerAsset[symbol]
        )
        if (aTokenImpl === "AToken") {
            aTokenType[symbol] = "generic"
        } else if (aTokenImpl === "DelegationAwareAToken") {
            aTokenType[symbol] = "delegation aware"
        }
        reserveInitDecimals.push(reserveDecimals)
        reserveTokens.push(reservesAddresses[symbol])
        reserveSymbols.push(symbol)
    }
    // console.log(strategyAddresses)
    // console.log(strategyAddressPerAsset)
    // console.log(aTokenType)
    // console.log(reserveInitDecimals)
    // console.log(reserveTokens)

    for (let i = 0; i < reserveSymbols.length; i++) {
        let aTokenToUse
        if (aTokenType[reserveSymbols[i]] === "generic") {
            aTokenToUse = aTokenImplementationAddress
        } else {
            aTokenToUse = delegationAwareATokenImplementationAddress
        }

        initInputParams.push({
            aTokenImpl: aTokenToUse,
            stableDebtTokenImpl: stableDebtTokenImplementationAddress,
            variableDebtTokenImpl: variableDebtTokenImplementationAddress,
            underlyingAssetDecimals: reserveInitDecimals[i],
            interestRateStrategyAddress:
                strategyAddressPerAsset[reserveSymbols[i]],
            underlyingAsset: reserveTokens[i],
            treasury: treasuryAddress,
            incentivesController,
            underlyingAssetName: reserveSymbols[i],
            aTokenName: `Aave ${aTokenNamePrefix} ${reserveSymbols[i]}`,
            aTokenSymbol: `a${symbolPrefix}${reserveSymbols[i]}`,
            variableDebtTokenName: `Aave ${variableDebtTokenNamePrefix} Variable Debt ${reserveSymbols[i]}`,
            variableDebtTokenSymbol: `variableDebt${symbolPrefix}${reserveSymbols[i]}`,
            stableDebtTokenName: `Aave ${stableDebtTokenNamePrefix} Stable Debt ${reserveSymbols[i]}`,
            stableDebtTokenSymbol: `stableDebt${symbolPrefix}${reserveSymbols[i]}`,
            params: "0x10",
        })
    }
}

const uiPoolData = async () => {
    const [deployer, user1, user2] = await ethers.getSigners()

    // Pool
    // const PoolC = new ethers.Contract(aaveContract.POOL, PoolAbi, deployer)
    // let reserveData = await PoolC.getReserveData(
    //     "0x5d4CD7625c1aa4a9A92AD6c1E3053D2C28182E04"
    // )
    // console.log(reserveData)

    // 配置资产
    // const PoolConfiguratorC = new ethers.Contract(
    //     aaveContract.POOL_CONFIGURATOR,
    //     PoolConfiguratorAbi,
    //     deployer
    // )
    // // 冻结
    // await PoolConfiguratorC.setReserveFreeze(
    //     "0x5d4CD7625c1aa4a9A92AD6c1E3053D2C28182E04",
    //     true
    // )
    // // 解冻
    // await PoolConfiguratorC.setReserveFreeze(
    //     "0x5d4CD7625c1aa4a9A92AD6c1E3053D2C28182E04",
    //     false
    // )

    // // 查看资产池储备
    // const uiPoolDataProviderC = new ethers.Contract(
    //     aaveContract.UI_POOL_DATA_PROVIDER,
    //     uiPoolDataProviderAbi,
    //     deployer
    // )
    // const reservesList = await uiPoolDataProviderC.getReservesList(
    //     aaveContract.POOL_ADDRESS_PROVIDER
    // )
    // console.log(reservesList)
    // const reservesData = await uiPoolDataProviderC.getReservesData(
    //     aaveContract.POOL_ADDRESS_PROVIDER
    // )
    // console.log(reservesData)

    // 配置权限
    // const acMangerC = new ethers.Contract(
    //     aaveContract.ACL_MANAGER,
    //     ACLManagerAbi,
    //     deployer
    // )
    // console.log(user1.address)
    // await acMangerC.addAssetListingAdmin(user1.address)
    // console.log(deployer.address, "address")
    // let queryAddr = user1.address
    // let isPoolAdmin = await acMangerC.isPoolAdmin(queryAddr)
    // console.log(isPoolAdmin, "isPoolAdmin")
    // let isRiskAdmin = await acMangerC.isRiskAdmin(queryAddr)
    // console.log(isRiskAdmin, "isRiskAdmin")
    // let isAssetListingAdmin = await acMangerC.isAssetListingAdmin(queryAddr)
    // console.log(isAssetListingAdmin, "isAssetListingAdmin")
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
