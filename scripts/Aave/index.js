const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const {
    getPool,
    getPoolConfigurator,
    getPoolDataProvider,
    getACLManager,
    getPoolAddressesProvider,
    tokenAddress,
    getTokens,
    contractsAddress,
    getUiPoolDataProviderV3,
    initContract,
    getAAveOracle,
    getTokenConfig,
    getReservesSetupHelper,
} = require("./address.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

// const config = networkConfig[chainId]

async function main() {
    // initContract()

    // await ReservesSetupHelperFunc()
    // await PoolAddressesProviderFunc()
    // await AclManagerFunc()
    await PoolConfiguratorFunc()
    // await PoolFunc()
    // await UiPoolDataProviderV3Func()
    // await PoolDataProviderFunc()
}

const ReservesSetupHelperFunc = async () => {
    // const ACLManager = await getACLManager()
    // const ReservesSetupHelper = await getReservesSetupHelper()
    // await ACLManager.addRiskAdmin(ReservesSetupHelper.address)
    // const config = [
    //     {
    //         asset: tokenAddress.TOKEN_DAI,
    //         baseLTV: "7500",
    //         liquidationThreshold: "8000",
    //         liquidationBonus: "10500",
    //         reserveFactor: "1000",
    //         borrowCap: "0",
    //         supplyCap: "0",
    //         stableBorrowingEnabled: true,
    //         borrowingEnabled: true,
    //         flashLoanEnabled: false,
    //     },
    // ]
    // await ReservesSetupHelper.configureReserves(
    //     contractsAddress.POOL_CONFIGURATOR,
    //     config,
    //     {
    //         gasLimit: 5750000,
    //     }
    // )
    // await ACLManager.removeRiskAdmin(ReservesSetupHelper.address)
}

const UiPoolDataProviderV3Func = async () => {
    // 配置资产
    const UiPoolDataProviderV3 = await getUiPoolDataProviderV3()
    const reservesData = await UiPoolDataProviderV3.getReservesData(
        contractsAddress.POOL_ADDRESS_PROVIDER
    )
    console.log(reservesData)
    const reservesList = await UiPoolDataProviderV3.getReservesList(
        contractsAddress.POOL_ADDRESS_PROVIDER
    )
    console.log(reservesList)
}

const PoolDataProviderFunc = async () => {
    const PoolDataProvider = await getPoolDataProvider()
    // 查看资产池储备
    let allToken = await PoolDataProvider.getAllReservesTokens()
    console.log(allToken)
    const reserveData = await PoolDataProvider.getReserveData(
        tokenAddress.TOKEN_AAVE
    )
    console.log(reserveData)
}

const PoolFunc = async () => {
    // Pool
    const Pool = await getPool()
    // let reserveData = await Pool.getReserveData(tokenAddress.TOKEN_DAI)
    // console.log(reserveData)
    // let configuration = await Pool.getConfiguration(tokenAddress.TOKEN_DHX)
    // console.log(configuration)
    // let ReservesList = await Pool.getReservesList()
    // console.log(ReservesList)
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

const PoolConfiguratorFunc = async () => {
    const PoolConfigurator = await getPoolConfigurator()
    const AAveOracle = await getAAveOracle()
    const UiPoolDataProviderV3 = await getUiPoolDataProviderV3()

    // {
    //     asset: tokenAddress.TOKEN_DAI,
    //     baseLTV: "7500",
    //     liquidationThreshold: "8000",
    //     liquidationBonus: "10500",
    //     reserveFactor: "1000",
    //     borrowCap: "0",
    //     supplyCap: "2000000000",
    //     stableBorrowingEnabled: true,
    //     borrowingEnabled: true,
    //     flashLoanEnabled: true,
    // },

    await PoolConfigurator.setReserveBorrowing(tokenAddress.TOKEN_DHX, true)
    // await PoolConfigurator.callStatic.configureReserveAsCollateral(
    //     tokenAddress.TOKEN_DAI,
    //     "7500",
    //     "8000",
    //     "10500"
    // )
    // await PoolConfigurator.setBorrowCap(tokenAddress.TOKEN_DAI, "0")
    // await PoolConfigurator.setReserveStableRateBorrowing(
    //     tokenAddress.TOKEN_DAI,
    //     true
    // )
    // await PoolConfigurator.setReserveFlashLoaning(tokenAddress.TOKEN_DAI, false)
    // PoolConfigurator.setSupplyCap(tokenAddress.TOKEN_DAI, "2000000000")
    // PoolConfigurator.setReserveFactor(tokenAddress.TOKEN_DAI, "1000")

    // 清除资产
    // await PoolConfigurator.dropReserve()
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_RIDE)
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_PARK)
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_DAI)
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_EURS)
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_USDT)
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_USDC)
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_WBTC)
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_AAVE)
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_LINK)
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_WETH)

    // 冻结/解冻
    // await PoolConfigurator.setReserveFreeze(tokenAddress.TOKEN_DAI, true)
    // await PoolConfigurator.setReserveFreeze(tokenAddress.TOKEN_DAI, false)

    // 设置可用
    // await PoolConfigurator.setReserveActive(tokenAddress.TOKEN_DAI, false)

    // 批量
    // const reservesList = await UiPoolDataProviderV3.getReservesList(
    //     contractsAddress.POOL_ADDRESS_PROVIDER
    // )
    // console.log(reservesList)

    // const DhxToken = getTokenConfig({
    //     asset: tokenAddress.TOKEN_DHX,
    //     symbol: "DHX",
    // })
    // const ParkToken = getTokenConfig({
    //     asset: tokenAddress.TOKEN_PARK,
    //     symbol: "PARK",
    // })
    // const RideToken = getTokenConfig({
    //     asset: tokenAddress.TOKEN_RIDE,
    //     symbol: "RIDE",
    // })
    // const WMxcToken = getTokenConfig({
    //     asset: tokenAddress.TOKEN_WMXC,
    //     symbol: "WMXC",
    // })
    // const XSDToken = getTokenConfig({
    //     asset: tokenAddress.TOKEN_XSD,
    //     symbol: "XSD",
    // })
    // await PoolConfigurator.initReserves(DhxToken)
    // await PoolConfigurator.initReserves(ParkToken)
    // await PoolConfigurator.initReserves(RideToken)
    // await PoolConfigurator.initReserves(WMxcToken)
    // await PoolConfigurator.initReserves(XSDToken)

    // for (let item of getTokens.constom) {
    //     await AAveOracle.setAssetSources(
    //         [item],
    //         [contractsAddress.PriceAggregator]
    //     )
    // }

    // await AAveOracle.setAssetSources(
    //     [tokenAddress.TOKEN_DHX],
    //     [contractsAddress.PriceAggregator]
    // )
    // await AAveOracle.setAssetSources(
    //     [tokenAddress.TOKEN_PARK],
    //     [contractsAddress.PriceAggregator]
    // )
    // await AAveOracle.setAssetSources(
    //     [tokenAddress.TOKEN_RIDE],
    //     [contractsAddress.PriceAggregator]
    // )
    // await AAveOracle.setAssetSources(
    //     [tokenAddress.TOKEN_WMXC],
    //     [contractsAddress.PriceAggregator]
    // )
    // await AAveOracle.setAssetSources(
    //     [tokenAddress.TOKEN_XSD],
    //     [contractsAddress.PriceAggregator]
    // )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
