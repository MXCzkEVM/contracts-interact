const { network, ethers, deployments } = require("hardhat")

const chainId = network.config.chainId

const PoolConfiguratorAbi = require("../../abi/aave/PoolConfigurator.json")
const PoolDataProviderAbi = require("../../abi/aave/PoolDataProvider.json")
const PoolAddressesProviderAbi = require("../../abi/aave/PoolAddressesProvider.json")
const UiPoolDataProviderV3Abi = require("../../abi/aave/UiPoolDataProviderV3.json")
const PoolAbi = require("../../abi/aave/Pool.json")
const ACLManagerAbi = require("../../abi/aave/ACLManager.json")
const AaveOracleAbi = require("../../abi/aave/AaveOracle.json")
const ReservesSetupHelperAbi = require("../../abi/aave/ReservesSetupHelper.json")
const atokenAbi = require("../../abi/aave/AToken.json")

const tokens = {
    5167003: {
        TOKEN_DAI: "0x74CC0D1fa135e7868585C80327025845DF98eb0a",
        TOKEN_LINK: "0xBC5Cb230DED59029a4ADd25bbE8F79003EaD234b",
        TOKEN_WETH: "0x32FEF93CC6232D83d6f2b1d262905E90fc799Cf5",
        TOKEN_USDC: "0xcB95859e0a8521132a8c4Ed47b7e3286211144E4",
        TOKEN_WBTC: "0x274c8FeE6296996DeB2A1b749ef53499B9E27Fe9",
        TOKEN_USDT: "0xc4BA27360C8944e05653A1Ae0824bb58b88412DC",
        TOKEN_AAVE: "0x5111dbCF87aF7BB8Abe0CD069E06Ec32657c4844",
        TOKEN_EURS: "0x45fEf9AE19dbAc9f58C610d776F47Df21e3CfF54",

        TOKEN_PARK: "0xfF66Bbed4DC076A4cA8AE03D39dD4194117238cC",
        TOKEN_RIDE: "0xf49e9ADe92ff5206eca5672C36d6e9E79223506b",
        TOKEN_DHX: "0x4cAE8d6BdB2c4a78279Ade23151fa177aA6C99b2",
        TOKEN_XSD: "0x035f685a971e9D8852353Cd2e13cAEecc808ec5C",
        TOKEN_WMXC: "0x9d0668Bf6A44d44C05F9cC5F35653C12553c80d1",
    },
    1337: {
        TOKEN_DAI: "0xc8699717ba4fdef8617c286B47E8372B18C96B43",
        TOKEN_LINK: "0x881e74E3bC5453a7d75ed3857a74FBA504c900F0",
        TOKEN_WETH: "0x5cA355c81254D0611dF124160CEB9089A6e93f34",
        TOKEN_USDC: "0x2f908B1b1601e0d48d424F0E89F5fEBF14bab278",
        TOKEN_WBTC: "0x73673508D867467F635E29b81E22B351A0d3eAF0",
        TOKEN_USDT: "0xC83CA904D77D7Fa735498a700d635F0DE704E727",
        TOKEN_AAVE: "0x40684124409A32bF3974Fb35e94EE89c1E8b0276",
        TOKEN_EURS: "0x76ac91c91922D20590b69aa6839984A052119D06",

        TOKEN_DHX: "0x1e94C0b4FCe5e5A022831c69a8615a8F0e3d9c11",
        TOKEN_XSD: "0xEE9aE3A3A8e010C96638E715462dfce0ADA188A1",
        TOKEN_WMXC: "0xFb23e52Ec505aA24446e0C10e7fF9f7CA2cBf8f9",
        TOKEN_PARK: "0x0f8716ba51A0f837f5351843B4351699e9f255DE",
        TOKEN_RIDE: "0x5348de84B4906D7d190bAfC9865DbF00963e8292",
    },
}

const getTokens = (chainId) => {
    const t = tokens[chainId]
    return {
        base: [
            t.TOKEN_DAI,
            t.TOKEN_LINK,
            t.TOKEN_WETH,
            t.TOKEN_USDC,
            t.TOKEN_WBTC,
            t.TOKEN_USDT,
            t.TOKEN_AAVE,
            t.TOKEN_EURS,
        ],
        constom: [
            t.TOKEN_PARK,
            t.TOKEN_RIDE,
            t.TOKEN_DHX,
            t.TOKEN_XSD,
            t.TOKEN_WMXC,
        ],
    }
}

const contracts = {
    // wannsee
    5167003: {
        // POOL_DATA_PROVIDER: "0x476452D8af32327de09343A7baCAC8C497Af77E7",
        // POOL_ADDRESS_PROVIDER: "0x6281f1f6B7dC16a020CCd40e400502615695BB89",
        // ACL_MANAGER: "0x73b03cd33Bf35edeF8442b942D3Eb449314e8C54",
        // POOL_CONFIGURATOR: "0xE98F5d6d82601B4a8C0F62600E870FDa0B62A31D",
        // POOL: "0xcd49B6B582b4bDfE2dd74449F2B7037f2301904C",

        POOL_DATA_PROVIDER: "0x421C716718DE9Ba05128e364c8d964e00C79a30b",
        POOL_ADDRESS_PROVIDER: "0xFe55653FC5251b54BF37115599E7466ed3727f2A",
        ACL_MANAGER: "0x720e4b72F069a9a7666f0916F7f6F20A06cF2df2",
        POOL_CONFIGURATOR: "0x5184eb1dA2de9D67A264c74F89AB357A979f4A01",
        POOL: "0x25d8456Cca7617fc194DBcA3C504AA6a18539Dd8",
        WrappedTokenGatewayV3: "0x6282151FD846FFfc292A4DED8d4234ED0ce11104",
        UiIncentiveDataProviderV3: "0x251276b91B055884064e05cFd61Df0Cf21737815",
        UiPoolDataProviderV3: "0xd5b3b50c27731380ce5d500e3088b2C5da97875D",
        WalletBalanceProvider: "0xa905F29F2F99BC6ee97144B85F1dC892567Be3F3",
        AToken: "0x5268910eDE4cB39b7128225ad13F837fe5807ac5",
        StableDebtToken: "0x702acF34808B20F4932b1a30c038eD7c2F285C37",
        VariableDebtToken: "0x8E3504f251C7CF08c605f3A4c8A8B2458a1Ee1bF",
        TreasuryProxy: "0x8241b35f89Ea6d3c7D5603765412b96F8d97964b",
        rateStrategyStableOne: "0xF69d40Bd8E608C1864e5FF4f9e015D4f923bED60",
        rateStrategyStableTwo: "0x85C99653fcD8a8230AFf2D82bB7F7F1Fa8b46286",
        rateStrategyVolatileOne: "0x1380945DfB39c525b646d544ada2ccBB474f5EFB",
        IncentivesProxy: "0xe8D674447717Cbd8E0Ecc7C12FA1EB0245e8d942",
        AaveOracle: "0x2D36373Db3Ca79c3d1DFa2E91Df3E1aC2879Df7a",
        ReservesSetupHelper: "0xc588B56B944E70C1195a2Bb6868087DaB58B5A10",
        Faucet: "0x3f84e53D58c3f2423B8c8dc7E3e9c9f46a3d7089",

        ChainLinkEthUsd: "0xca156A2D75c5E5d9Eea903A723FE8B94f0D6bbcF",
        PriceAggregator: "0x7384419eAEa8568af986fB0E1973FF07A1DAEb8f",
    },
    // ganache
    1337: {
        POOL_DATA_PROVIDER: "0x35d07822a087ca33085dFD66fc01103f94FF8925",
        POOL_ADDRESS_PROVIDER: "0xbaFFE20374276bc4a6F9A4e7886db9d67268cC35",
        ACL_MANAGER: "0x4d861394170337801AfF6cb3A73d97FA7fb25DE4",
        POOL_CONFIGURATOR: "0xfCeF11608c59B729906b44D7A995b80a545C2561",
        POOL: "0x7a88da6512908d57Ff51C60Cf5Dd06F2Cf539d42",
        WrappedTokenGatewayV3: "0x49424CC3CC0Adb5d5eD549Fb9778c09838EeB468",
        UiIncentiveDataProviderV3: "0x6EfF4eEFd827D4B8410fe4e6B5387937505aC0FA",
        UiPoolDataProviderV3: "0x0b4f4249864A85B8364c5487DF3BDe52088B8Dda",
        WalletBalanceProvider: "0x5166c891efad6fA055B0f119DF62010320343eB1",
        AToken: "0x5a77174Ed7E90e9BeD58194F8E56fffE373C7Fbc",
        StableDebtToken: "0x05F5E12B3d537d560c373e8f6FA3e28b8935bc28",
        VariableDebtToken: "0x1B92916186c9baa1fd744AF92c22cC8d0dDDeF32",
        TreasuryProxy: "0x9672AF9d98B0bEaA168bb68B01d7491e4fDb75Cb",
        rateStrategyStableOne: "0xa70cc9b90811455e06a4f286b189250b4ec5B670",
        rateStrategyStableTwo: "0xDf38045f70544F774f1B702a27ac56d850D1146b",
        rateStrategyVolatileOne: "0x6B9bc19aA1eb3c458b5914EB35ED8c0f01048892",
        IncentivesProxy: "0xAad96F84A2619b3BdcE0f508C165B2D966bF119c",
        AaveOracle: "0x466acFc9867c6e4e94b0Fe3589f7f0B6b5f3CA9F",
        ReservesSetupHelper: "0x5d22BB610296660F6034880a65Dde508779B0C28",

        ChainLinkEthUsd: "0xae370B5c1b0111610c4756A1Cc11974Ef0CcA114",
        PriceAggregator: "0x9e5682D92fe4B42E3F4d4832046A44b9D7FefcFA",
    },
}

const getReservesSetupHelper = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].ReservesSetupHelper,
        ReservesSetupHelperAbi,
        deployer
    )
}

const getPool = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(contracts[chainId].POOL, PoolAbi, deployer)
}

const getAAveOracle = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].AaveOracle,
        AaveOracleAbi,
        deployer
    )
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

const getAtoken = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(contracts[chainId].AToken, atokenAbi, deployer)
}

const getUiPoolDataProviderV3 = async () => {
    const [deployer] = await ethers.getSigners()
    return new ethers.Contract(
        contracts[chainId].UiPoolDataProviderV3,
        UiPoolDataProviderV3Abi,
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

const initContract = async () => {
    const POOL_DATA_PROVIDER = (await deployments.get("PoolDataProvider-Aave"))
        .address
    const POOL_ADDRESS_PROVIDER = (
        await deployments.get("PoolAddressesProvider-Aave")
    ).address
    const ACL_MANAGER = (await deployments.get("ACLManager-Aave")).address
    const POOL_CONFIGURATOR = (
        await deployments.get("PoolConfigurator-Proxy-Aave")
    ).address
    const POOL = (await deployments.get("Pool-Proxy-Aave")).address
    const WrappedTokenGatewayV3 = (
        await deployments.get("WrappedTokenGatewayV3")
    ).address
    const UiIncentiveDataProviderV3 = (
        await deployments.get("UiIncentiveDataProviderV3")
    ).address
    const UiPoolDataProviderV3 = (await deployments.get("UiPoolDataProviderV3"))
        .address
    const WalletBalanceProvider = (
        await deployments.get("WalletBalanceProvider")
    ).address
    const rateStrategyStableOne = (
        await deployments.get("ReserveStrategy-rateStrategyStableOne")
    ).address
    const rateStrategyStableTwo = (
        await deployments.get("ReserveStrategy-rateStrategyStableTwo")
    ).address
    const rateStrategyVolatileOne = (
        await deployments.get("ReserveStrategy-rateStrategyVolatileOne")
    ).address
    const IncentivesProxy = (await deployments.get("IncentivesProxy")).address
    const AToken = (await deployments.get("AToken-Aave")).address
    const StableDebtToken = (await deployments.get("StableDebtToken-Aave"))
        .address
    const VariableDebtToken = (await deployments.get("VariableDebtToken-Aave"))
        .address
    const TreasuryProxy = (await deployments.get("TreasuryProxy")).address
    const AaveOracle = (await deployments.get("AaveOracle-Aave")).address
    const ReservesSetupHelper = (await deployments.get("ReservesSetupHelper"))
        .address
    const Faucet = (await deployments.get("Faucet-Aave")).address

    console.log(`POOL_DATA_PROVIDER: "${POOL_DATA_PROVIDER}",`)
    console.log(`POOL_ADDRESS_PROVIDER: "${POOL_ADDRESS_PROVIDER}",`)
    console.log(`ACL_MANAGER: "${ACL_MANAGER}",`)
    console.log(`POOL_CONFIGURATOR: "${POOL_CONFIGURATOR}",`)
    console.log(`POOL: "${POOL}",`)
    console.log(`WrappedTokenGatewayV3: "${WrappedTokenGatewayV3}",`)
    console.log(`UiIncentiveDataProviderV3: "${UiIncentiveDataProviderV3}",`)
    console.log(`UiPoolDataProviderV3: "${UiPoolDataProviderV3}",`)
    console.log(`WalletBalanceProvider: "${WalletBalanceProvider}",`)
    console.log(`AToken: "${AToken}",`)
    console.log(`StableDebtToken: "${StableDebtToken}",`)
    console.log(`VariableDebtToken: "${VariableDebtToken}",`)
    console.log(`TreasuryProxy: "${TreasuryProxy}",`)
    console.log(`rateStrategyStableOne: "${rateStrategyStableOne}",`)
    console.log(`rateStrategyStableTwo: "${rateStrategyStableTwo}",`)
    console.log(`rateStrategyVolatileOne: "${rateStrategyVolatileOne}",`)
    console.log(`IncentivesProxy: "${IncentivesProxy}",`)
    console.log(`AaveOracle: "${AaveOracle}",`)
    console.log(`ReservesSetupHelper: "${ReservesSetupHelper}",`)
    console.log(`Faucet: "${Faucet}",`)

    const TOKEN_DAI = (await deployments.get("DAI-TestnetMintableERC20-Aave"))
        .address
    const TOKEN_WETH = (await deployments.get("WETH-TestnetMintableERC20-Aave"))
        .address
    const TOKEN_LINK = (await deployments.get("LINK-TestnetMintableERC20-Aave"))
        .address
    const TOKEN_USDC = (await deployments.get("USDC-TestnetMintableERC20-Aave"))
        .address
    const TOKEN_WBTC = (await deployments.get("WBTC-TestnetMintableERC20-Aave"))
        .address
    const TOKEN_USDT = (await deployments.get("USDT-TestnetMintableERC20-Aave"))
        .address
    const TOKEN_AAVE = (await deployments.get("AAVE-TestnetMintableERC20-Aave"))
        .address
    const TOKEN_EURS = (await deployments.get("EURS-TestnetMintableERC20-Aave"))
        .address

    console.log(`TOKEN_DAI: "${TOKEN_DAI}",`)
    console.log(`TOKEN_LINK: "${TOKEN_LINK}",`)
    console.log(`TOKEN_WETH: "${TOKEN_WETH}",`)
    console.log(`TOKEN_USDC: "${TOKEN_USDC}",`)
    console.log(`TOKEN_WBTC: "${TOKEN_WBTC}",`)
    console.log(`TOKEN_USDT: "${TOKEN_USDT}",`)
    console.log(`TOKEN_AAVE: "${TOKEN_AAVE}",`)
    console.log(`TOKEN_EURS: "${TOKEN_EURS}"`)
}

const getTokenConfig = ({ asset, symbol, dec = 18, rateType = 2 }) => {
    const c = contracts[chainId]
    if (rateType > 2) {
        console.log("rateType overflow")
        return
    }
    const rateMap = {
        0: c.rateStrategyStableOne,
        1: c.rateStrategyStableTwo,
        2: c.rateStrategyVolatileOne,
    }
    return [
        {
            underlyingAsset: asset,
            underlyingAssetName: symbol,
            aTokenName: `MXC Wannsee ${symbol}`,
            aTokenSymbol: `aMxc${symbol}`,
            variableDebtTokenName: `Wannsee Mxc Variable Debt ${symbol}`,
            variableDebtTokenSymbol: `variableDebtMxc${symbol}`,
            stableDebtTokenName: `Wannsee Mxc Stable Debt ${symbol}`,
            stableDebtTokenSymbol: `stableDebtMxc${symbol}`,
            underlyingAssetDecimals: dec,
            aTokenImpl: c.AToken,
            stableDebtTokenImpl: c.StableDebtToken,
            variableDebtTokenImpl: c.VariableDebtToken,
            interestRateStrategyAddress: rateMap[rateType],
            treasury: c.TreasuryProxy,
            incentivesController: c.IncentivesProxy,
            params: "0x10",
        },
    ]
}

const getDeployMents = async (name) => {
    const [deployer] = await ethers.getSigners()
    const c = await deployments.get(name)
    return new ethers.Contract(c.address, c.abi, deployer)
}

module.exports = {
    contractsAddress: contracts[chainId],
    tokenAddress: tokens[chainId],
    getTokens: getTokens(chainId),
    getPoolConfigurator,
    getPoolDataProvider,
    getUiPoolDataProviderV3,
    getACLManager,
    getPoolAddressesProvider,
    getPool,
    initContract,
    getAAveOracle,
    getTokenConfig,
    getReservesSetupHelper,
    getDeployMents,
    getAtoken,
}
