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
    getAAveOracle,
    getTokenConfig,
    getReservesSetupHelper,
    getDeployMents,
} = require("./address.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

// const config = networkConfig[chainId]

async function main() {
    await ReservesSetupHelperFunc()
    // await PoolAddressesProviderFunc()
    // await AclManagerFunc()
    // await PoolConfiguratorFunc()
    // await PoolFunc()
    // await PoolDataProviderFunc()
    // await MintToken()
}

const MintToken = async () => {
    const [deployer] = await ethers.getSigners()
    let aaveToken = await getDeployMents("AAVE-TestnetMintableERC20-Aave")
    // await aaveToken["mint(uint256)"](parseEther("1000"))
    // console.log(deployer.address)
    let balance = await aaveToken.balanceOf(deployer.address)
    console.log(formatEther(balance))
}

const ReservesSetupHelperFunc = async () => {
    const ACLManager = await getACLManager()
    const ReservesSetupHelper = await getReservesSetupHelper()
    await ACLManager.addRiskAdmin(ReservesSetupHelper.address)
    const config = [
        // {
        //     asset: tokenAddress.TOKEN_PARK,
        //     baseLTV: "5000",
        //     liquidationThreshold: "6500",
        //     liquidationBonus: "11000",
        //     reserveFactor: "0",
        //     borrowCap: "0",
        //     supplyCap: "0",
        //     stableBorrowingEnabled: true,
        //     borrowingEnabled: true,
        //     flashLoanEnabled: false,
        // },
        // {
        //     asset: tokenAddress.TOKEN_RIDE,
        //     baseLTV: "5000",
        //     liquidationThreshold: "6500",
        //     liquidationBonus: "11000",
        //     reserveFactor: "0",
        //     borrowCap: "0",
        //     supplyCap: "0",
        //     stableBorrowingEnabled: true,
        //     borrowingEnabled: true,
        //     flashLoanEnabled: false,
        // },
        {
            asset: tokenAddress.TOKEN_XSD,
            baseLTV: "5000",
            liquidationThreshold: "6500",
            liquidationBonus: "11000",
            reserveFactor: "0",
            borrowCap: "0",
            supplyCap: "0",
            stableBorrowingEnabled: false,
            borrowingEnabled: true,
            flashLoanEnabled: false,
        },
        // {
        //     asset: tokenAddress.TOKEN_WMXC,
        //     baseLTV: "5000",
        //     liquidationThreshold: "6500",
        //     liquidationBonus: "11000",
        //     reserveFactor: "0",
        //     borrowCap: "0",
        //     supplyCap: "0",
        //     stableBorrowingEnabled: true,
        //     borrowingEnabled: true,
        //     flashLoanEnabled: false,
        // },
        // {
        //     asset: tokenAddress.TOKEN_DIGI,
        //     baseLTV: "5000",
        //     liquidationThreshold: "6500",
        //     liquidationBonus: "11000",
        //     reserveFactor: "0",
        //     borrowCap: "0",
        //     supplyCap: "0",
        //     stableBorrowingEnabled: true,
        //     borrowingEnabled: true,
        //     flashLoanEnabled: false,
        // },
    ]
    await ReservesSetupHelper.configureReserves(
        contractsAddress.POOL_CONFIGURATOR,
        config
    )
    await ACLManager.removeRiskAdmin(ReservesSetupHelper.address)
}

const PoolDataProviderFunc = async () => {
    const PoolDataProvider = await getPoolDataProvider()
    // // 查看资产池储备
    // let allToken = await PoolDataProvider.getAllReservesTokens()
    // console.log(allToken)
    // const reserveData = await PoolDataProvider.getReserveData(
    //     tokenAddress.TOKEN_AAVE
    // )
    // console.log(reserveData)
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

    // for (let item of getTokens.base) {
    //     await PoolConfigurator.setReserveFreeze(item, true)
    //     // await PoolConfigurator.setReserveActive(item, true)
    // }

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

    // await PoolConfigurator.setReserveBorrowing(tokenAddress.TOKEN_DHX, true)
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
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_XSD)
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
    // await PoolConfigurator.dropReserve(tokenAddress.TOKEN_DIGI)

    // 冻结/解冻
    // await PoolConfigurator.setReserveFreeze(tokenAddress.TOKEN_DAI, true)
    // await PoolConfigurator.setReserveFreeze(tokenAddress.TOKEN_DAI, false)

    // 设置可用 - 不可用的话界面有资产 但是为0
    // await PoolConfigurator.setReserveActive(tokenAddress.TOKEN_PARK, true)

    // 批量
    // const reservesList = await UiPoolDataProviderV3.getReservesList(
    //     contractsAddress.POOL_ADDRESS_PROVIDER
    // )
    // console.log(reservesList)

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

    const DIGIToken = getTokenConfig({
        asset: tokenAddress.TOKEN_DIGI,
        symbol: "DG",
    })
    // console.log(DIGIToken)

    // await PoolConfigurator.initReserves(ParkToken)
    // await PoolConfigurator.initReserves(RideToken)
    // await PoolConfigurator.initReserves(WMxcToken)
    // await PoolConfigurator.initReserves(XSDToken)
    // await PoolConfigurator.initReserves(DIGIToken)

    // await AAveOracle.setAssetSources(
    //     [
    //         tokenAddress.TOKEN_RIDE,
    //         tokenAddress.TOKEN_PARK,
    //         tokenAddress.XSD,
    //         tokenAddress.TOKEN_WMXC,
    //     ],
    //     [
    //         contractsAddress.PriceAggregator,
    //         contractsAddress.PriceAggregator,
    //         contractsAddress.PriceAggregator,
    //         contractsAddress.PriceAggregator,
    //     ]
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

    // await AAveOracle.setAssetSources(
    //     [tokenAddress.TOKEN_DIGI],
    //     [contractsAddress.DigiPriceAggregator]
    // )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
