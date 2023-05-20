const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const {
    getPool,
    getPoolConfigurator,
    getPoolDataProvider,
    getACLManager,
    getPoolAddressesProvider,
    tokenAddress,
    contractsAddress,
} = require("./address.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

// const config = networkConfig[chainId]

async function main() {
    // PoolAddressesProviderFunc()
    // AclManagerFunc()
    // PoolFunc()
    // PoolDataProviderFunc()
    PoolConfiguratorFunc()
}

const PoolFunc = async () => {
    // Pool
    const Pool = await getPool()
    let reserveData = await Pool.getReserveData(tokenAddress.TOKEN_DAI)
    console.log(reserveData)
    let configuration = await Pool.getConfiguration(tokenAddress.TOKEN_DAI)
    console.log(configuration)
    let ReservesList = await Pool.getReservesList()
    console.log(ReservesList)
}

const PoolAddressesProviderFunc = async () => {
    // 获取地址
    const PoolAddressesProvider = await getPoolAddressesProvider()
    const Pool = await PoolAddressesProvider.getPool()
    console.log(Pool)
    const PoolConfigurator = await PoolAddressesProvider.getPoolConfigurator()
    console.log(PoolConfigurator)
    PoolDataProvider = await PoolAddressesProvider.getPoolDataProvider()
    console.log(PoolDataProvider)
}

const AclManagerFunc = async () => {
    const [deployer] = await ethers.getSigners()
    // 配置权限
    const ACLManager = await getACLManager()
    let queryAddr = deployer.address
    console.log(queryAddr)
    let isPoolAdmin = await ACLManager.isPoolAdmin(queryAddr)
    console.log(isPoolAdmin, "isPoolAdmin")
    let isRiskAdmin = await ACLManager.isRiskAdmin(queryAddr)
    console.log(isRiskAdmin, "isRiskAdmin")
    let isAssetListingAdmin = await ACLManager.isAssetListingAdmin(queryAddr)
    console.log(isAssetListingAdmin, "isAssetListingAdmin")
}

const PoolDataProviderFunc = async () => {
    // 配置资产
    const PoolDataProvider = await getPoolDataProvider()
    // 查看资产池储备
    const reservesList = await PoolDataProvider.getReservesList(
        contractsAddress.POOL_ADDRESS_PROVIDER
    )
    console.log(reservesList)
    // const reservesData = await PoolDataProvider.getReservesData(
    //     contractsAddress.POOL_ADDRESS_PROVIDER
    // )
    // console.log(reservesData)
}

const PoolConfiguratorFunc = async () => {
    const PoolConfigurator = getPoolConfigurator()
    // 清除资产
    // await PoolConfigurator.dropReserve(
    //     "0x6774442e57A9c16da8c447c4b151a4D7f306d92f"
    // )
    // // 冻结
    // await PoolConfigurator.setReserveFreeze(
    //     "0x3EeE70b42fD410EbA12BE899396e540776e97F70",
    //     true
    // )
    // // 解冻
    // await PoolConfigurator.setReserveFreeze(
    //     "0x5d4CD7625c1aa4a9A92AD6c1E3053D2C28182E04",
    //     false
    // )
    // 设置可用
    await PoolConfigurator.setReserveActive(tokenAddress.TOKEN_DAI, true)
    // const block = await ethers.provider.getBlockNumber()
    // // 索引事件
    // const reserveInitEvents = await PoolConfigurator.queryFilter(
    //     "ReserveInitialized",
    //     672675,
    //     block
    // )
    // reserveInitEvents.map((item) => {
    //     let args = item.args
    //     console.log(`assets: ${args.asset}`)
    //     console.log(`aToken: ${args.aToken}`)
    //     console.log(`stableDebtToken: ${args.stableDebtToken}`)
    //     console.log(`variableDebtToken: ${args.variableDebtToken}`)
    //     console.log(
    //         `interestRateStrategyAddress: ${args.interestRateStrategyAddress}`
    //     )
    //     console.log("------------------------")
    // })
    // const DHX = [
    //     {
    //         aTokenImpl: "0xa755b8Ba346B18A74cd1a74A48be528a5EdEc446",
    //         stableDebtTokenImpl: "0x22BC02Bf14375785935c3c66fd85d26d133Ab9C9",
    //         variableDebtTokenImpl: "0xb9c2e4A309b1B1151fF171237CA68646c1dC5017",
    //         underlyingAssetDecimals: "18",
    //         interestRateStrategyAddress:
    //             "0x6358c2BB58a56B1b4daF66Ac7f7721059E08CDD2",
    //         underlyingAsset: "0x3EeE70b42fD410EbA12BE899396e540776e97F70",
    //         treasury: "0x0000000000000000000000000000000000000000",
    //         incentivesController: "0x0000000000000000000000000000000000000000",
    //         underlyingAssetName: "DHX",
    //         aTokenName: "MXC Wannsee DHX",
    //         aTokenSymbol: "aMxcDHX",
    //         variableDebtTokenName: "Wannsee Mxc Variable Debt DHX",
    //         variableDebtTokenSymbol: "variableDebtMxcDHX",
    //         stableDebtTokenName: "Wannsee Mxc Stable Debt DHX",
    //         stableDebtTokenSymbol: "stableDebtMxcDAI",
    //         params: "0x10",
    //     },
    // ]
    // const PARK = [
    //     {
    //         aTokenImpl: "0xa755b8Ba346B18A74cd1a74A48be528a5EdEc446",
    //         stableDebtTokenImpl: "0x22BC02Bf14375785935c3c66fd85d26d133Ab9C9",
    //         variableDebtTokenImpl: "0xb9c2e4A309b1B1151fF171237CA68646c1dC5017",
    //         underlyingAssetDecimals: "18",
    //         interestRateStrategyAddress:
    //             "0x6358c2BB58a56B1b4daF66Ac7f7721059E08CDD2",
    //         underlyingAsset: "0x6774442e57A9c16da8c447c4b151a4D7f306d92f",
    //         treasury: "0x0000000000000000000000000000000000000000",
    //         incentivesController: "0x0000000000000000000000000000000000000000",
    //         underlyingAssetName: "PARK",
    //         aTokenName: "MXC Wannsee PARK",
    //         aTokenSymbol: "aMxcPARK",
    //         variableDebtTokenName: "Wannsee Mxc Variable Debt PARK",
    //         variableDebtTokenSymbol: "variableDebtMxcPARK",
    //         stableDebtTokenName: "Wannsee Mxc Stable Debt PARK",
    //         stableDebtTokenSymbol: "stableDebtMxcDAI",
    //         params: "0x10",
    //     },
    // ]
    // await PoolConfigurator.initReserves(PARK)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
