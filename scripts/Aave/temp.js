const waitForTx = async (tx) => await tx.wait(1)
// const MARKET_NAME = "wannsee"
// initReserves(MARKET_NAME)
// configureReservesByHelper(MARKET_NAME)
// setReseves()

const {
    loadPoolConfig,
    getTreasuryAddress,
    getReserveAddresses,
} = require("./market-config-helpers.js")
const { chunk, isValidAddress } = require("./utils.js")

const configureReservesByHelper = async (MARKET_NAME) => {
    const [deployer, user1, user2] = await ethers.getSigners()
    const network = hre.network.name

    const poolConfig = loadPoolConfig(MARKET_NAME)
    const {
        ATokenNamePrefix,
        StableDebtTokenNamePrefix,
        VariableDebtTokenNamePrefix,
        SymbolPrefix,
        ReservesConfig,
        RateStrategies,
    } = poolConfig
    const reservesAddresses = await getReserveAddresses(poolConfig, network)

    // console.log(ReservesConfig)
    // console.log(reservesAddresses)

    const addressProviderArtifact = await deployments.get(
        "PoolAddressesProvider-Aave"
    )
    const addressProvider = await ethers.getContractAt(
        addressProviderArtifact.abi,
        addressProviderArtifact.address
    )

    const aclManagerArtifact = await deployments.get(`ACLManager-Aave`)
    const aclManager = await ethers.getContractAt(
        aclManagerArtifact.abi,
        await addressProvider.getACLManager()
    )

    const reservesSetupArtifact = await deployments.get("ReservesSetupHelper")
    const reservesSetupHelper = await ethers.getContractAt(
        reservesSetupArtifact.abi,
        reservesSetupArtifact.address
    )

    const protocolDataArtifact = await deployments.get(`PoolDataProvider-Aave`)
    const protocolDataProvider = await ethers.getContractAt(
        protocolDataArtifact.abi,
        (
            await deployments.get(`PoolDataProvider-Aave`)
        ).address
    )

    const tokens = []
    const symbols = []
    const inputParams = []

    for (const [
        assetSymbol,
        {
            baseLTVAsCollateral,
            liquidationBonus,
            liquidationThreshold,
            reserveFactor,
            borrowCap,
            supplyCap,
            stableBorrowRateEnabled,
            borrowingEnabled,
            flashLoanEnabled,
        },
    ] of Object.entries(ReservesConfig)) {
        if (baseLTVAsCollateral === "-1") continue

        const assetAddressIndex = Object.keys(reservesAddresses).findIndex(
            (value) => value === assetSymbol
        )
        const [, tokenAddress] =
            Object.entries(reservesAddresses)[assetAddressIndex]
        const { usageAsCollateralEnabled: alreadyEnabled } =
            await protocolDataProvider.getReserveConfigurationData(tokenAddress)

        // if (alreadyEnabled) {
        //     console.log(
        //         `- Reserve ${assetSymbol} is already enabled as collateral, skipping`
        //     )
        //     continue
        // }
        // Push data

        inputParams.push({
            asset: tokenAddress,
            baseLTV: baseLTVAsCollateral,
            liquidationThreshold,
            liquidationBonus,
            reserveFactor,
            borrowCap,
            supplyCap,
            stableBorrowingEnabled: stableBorrowRateEnabled,
            borrowingEnabled: borrowingEnabled,
            flashLoanEnabled: flashLoanEnabled,
        })

        tokens.push(tokenAddress)
        symbols.push(assetSymbol)
    }
    console.log(tokens)
    console.log(symbols)

    if (tokens.length) {
        // Set aTokenAndRatesDeployer as temporal admin
        const aclAdmin = await ethers.getSigner(
            await addressProvider.getACLAdmin()
        )
        // console.log(reservesSetupHelper.address)
        // await waitForTx(
        //     await aclManager
        //         .connect(aclAdmin)
        //         .addRiskAdmin(reservesSetupHelper.address)
        // )

        // Deploy init per chunks
        const enableChunks = 20
        const chunkedSymbols = chunk(symbols, enableChunks)
        const chunkedInputParams = chunk(inputParams, enableChunks)
        const poolConfiguratorAddress =
            await addressProvider.getPoolConfigurator()

        console.log(`- Configure reserves in ${chunkedInputParams.length} txs`)
        for (
            let chunkIndex = 0;
            chunkIndex < chunkedInputParams.length;
            chunkIndex++
        ) {
            console.log(chunkedInputParams[chunkIndex])
            // const tx = await waitForTx(
            //     await reservesSetupHelper.configureReserves(
            //         poolConfiguratorAddress,
            //         chunkedInputParams[chunkIndex]
            //     )
            // )
            // console.log(
            //     `  - Init for: ${chunkedSymbols[chunkIndex].join(", ")}`,
            //     `\n    - Tx hash: ${tx.transactionHash}`
            // )
        }
        // Remove ReservesSetupHelper from risk admins
        // await waitForTx(
        //     await aclManager
        //         .connect(aclAdmin)
        //         .removeRiskAdmin(reservesSetupHelper.address)
        // )
    }
}

const initReserves = async (MARKET_NAME) => {
    const [deployer, user1, user2] = await ethers.getSigners()
    const network = hre.network.name

    const poolConfig = loadPoolConfig(MARKET_NAME)

    const addressProviderArtifact = new ethers.Contract(
        wannseeContract.POOL_ADDRESS_PROVIDER,
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

    const incentivesController = await deployments.get("IncentivesProxy")

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
            incentivesController: incentivesController.address,
            underlyingAssetName: reserveSymbols[i],
            aTokenName: `Aave ${ATokenNamePrefix} ${reserveSymbols[i]}`,
            aTokenSymbol: `a${SymbolPrefix}${reserveSymbols[i]}`,
            variableDebtTokenName: `Aave ${VariableDebtTokenNamePrefix} Variable Debt ${reserveSymbols[i]}`,
            variableDebtTokenSymbol: `variableDebt${SymbolPrefix}${reserveSymbols[i]}`,
            stableDebtTokenName: `Aave ${StableDebtTokenNamePrefix} Stable Debt ${reserveSymbols[i]}`,
            stableDebtTokenSymbol: `stableDebt${SymbolPrefix}${reserveSymbols[i]}`,
            params: "0x10",
        })
    }

    // Deploy init reserves per chunks
    const chunkedSymbols = chunk(reserveSymbols, initChunks)
    const chunkedInitInputParams = chunk(initInputParams, initChunks)

    const proxyArtifact = await deployments.get(`PoolConfigurator-Proxy-Aave`)
    const configuratorArtifact = await deployments.get(
        `PoolConfigurator-Implementation`
    )

    const configurator = await ethers.getContractAt(
        configuratorArtifact.abi,
        proxyArtifact.address
    )

    console.log(
        `- Reserves initialization in ${chunkedInitInputParams.length} txs`
    )
    for (
        let chunkIndex = 0;
        chunkIndex < chunkedInitInputParams.length;
        chunkIndex++
    ) {
        console.log(chunkedInitInputParams[chunkIndex])
        // const tx = await waitForTx(
        //   await configurator.initReserves(chunkedInitInputParams[chunkIndex], { gasLimit: 5750000 })
        // );

        // console.log(
        //   `  - Reserve ready for: ${chunkedSymbols[chunkIndex].join(", ")}`,
        //   `\n    - Tx hash: ${tx.transactionHash}`
        // );
    }
}
