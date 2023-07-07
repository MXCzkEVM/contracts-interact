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
        TOKEN_DAI: "0x4D4DF1332075A3b24F6b69C17031d21C86866311",
        TOKEN_LINK: "0xA2A67115ae983e5166f5aF0c7AA93D95b2687be0",
        TOKEN_WETH: "0x5429aE5df68181add91C597BeE92602bCA4cb5A8",
        TOKEN_USDC: "0x1446129dC0108b91dbb62F03BDd4e793cCeAf3f5",
        TOKEN_WBTC: "0xb1B4fdB72C4D75cAfcad5001CD320995b5226Cc0",
        TOKEN_USDT: "0xD330cc339A76002f6beBcC8b77e1833A52116684",
        TOKEN_AAVE: "0x858862aBbb1d9047E7b8Ab0da25275E1b4c85aEc",
        TOKEN_EURS: "0xC4cd6cE9Ea57a0938BB610eD900E7e3248f802aB",

        // TOKEN_GRYD: "0xDB99Ec99E97B696a5D67B4C07695AB442a500f6E",
        TOKEN_PARK: "0x850e2d6329C0A99d53C52571CFc7ff8C319159fe",
        TOKEN_RIDE: "0x499A9b11b3A107e7ac45217C3401b3D0bF36A24C",
        TOKEN_XSD: "0xB9506A80429Ee619C74D46a3276c622358795e2B",
        TOKEN_WMXC: "0x6807F4B0D75c59Ef89f0dbEF9841Fb23fFDF105D",
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
        POOL_DATA_PROVIDER: "0x02BD761589CFf1E85e85a0b2DA961eb914DbC620",
        POOL_ADDRESS_PROVIDER: "0xAaEba9e8Ad2A482689706b9dd0D3c849b979CBdB",
        ACL_MANAGER: "0x92066966625516eaD9DAc39e07246b3588F924FA",
        POOL_CONFIGURATOR: "0xd75629f6a165AEE11d486eb4fdb698596F68fd44",
        POOL: "0x0C59362fFd7F053ea3a846fbcf5e849E74387E00",
        WrappedTokenGatewayV3: "0xBeD4Ab7152ca8115c88092190cd544C273AcFb15",
        UiIncentiveDataProviderV3: "0x1A3Bb2108C4031CaD8A1a8130f6617345FB55A32",
        UiPoolDataProviderV3: "0xb0D26C1b119b22405929A66818322A5a69c8B7bb",
        WalletBalanceProvider: "0x489A2F822279532fd362570579725E57f50d78f4",
        AToken: "0xA546B55258847132470Cba1717Dc1Ed0b46016e5",
        StableDebtToken: "0xC57b152C705b43c677D630C1eE6a0a988D92a061",
        VariableDebtToken: "0xe7462FC8b94EC1DAc074415A14A9918Fe0b21F71",
        TreasuryProxy: "0x9780B9F3aE8B992c596d624956bfE5B62d31F0E8",
        rateStrategyStableOne: "0x60D334DE197D9D1dA4Ca65045fcd27d25f4e78E3",
        rateStrategyStableTwo: "0x0ADC041d9642D18d56d6922a190c2fD2e28DbAfc",
        rateStrategyVolatileOne: "0xF839aEdD09A83BC16E58D6d5bEc38b5e6F0875ca",
        IncentivesProxy: "0x2E6d60BaDbe846E0f37819d0Ca59058B7Dd8BE72",
        AaveOracle: "0x270DCF244f3A217Af8eff6FBD288ddF2f7225978",
        ReservesSetupHelper: "0xe04661468CE5973D8e3f7BA81Bf77bbcbC285E77",
        Faucet: "0x1dC7b283b6bB8BA1071812BA98EC084CBb7b9aF2",

        ChainLinkEthUsd: "0xd95d27B3762726aCE11419dA6ecA0e2A948e6BdD",
        PriceAggregator: "0x94eE52C0583FA3802bCAd74BF300d3cE10FF1D7e",
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
    getAAveOracle,
    getTokenConfig,
    getReservesSetupHelper,
    getDeployMents,
    getAtoken,
}
