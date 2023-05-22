const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const {
    rateStrategyStableOne,
    rateStrategyStableTwo,
    rateStrategyVolatileOne,
} = require("./rateStrategies")

// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

const eEthereumNetwork = {
    wannsee: "wannsee",
}

const CommonsConfig = {
    MarketId: "Commons Aave Market",
    ATokenNamePrefix: "Wannseee",
    StableDebtTokenNamePrefix: "Wannseee",
    VariableDebtTokenNamePrefix: "Wannseee",
    SymbolPrefix: "MXC",
    ProviderId: 8080,
    OracleQuoteCurrencyAddress: ZERO_ADDRESS,
    OracleQuoteCurrency: "USD",
    OracleQuoteUnit: "8",
    WrappedNativeTokenSymbol: "WMXC",
    ChainlinkAggregator: {
        [eEthereumNetwork.wannsee]: {
            LINK: ZERO_ADDRESS,
            USDC: ZERO_ADDRESS,
            DAI: ZERO_ADDRESS,
            WBTC: ZERO_ADDRESS,
            WETH: ZERO_ADDRESS,
            USDT: ZERO_ADDRESS,
            EURS: ZERO_ADDRESS,
        },
    },
    ReserveFactorTreasuryAddress: {
        [eEthereumNetwork.wannsee]: ZERO_ADDRESS,
    },
    FallbackOracle: {
        [eEthereumNetwork.wannsee]: ZERO_ADDRESS,
    },
    ReservesConfig: {},
    IncentivesConfig: {
        enabled: {},
        rewards: {
            [eEthereumNetwork.wannsee]: {
                StkAave: ZERO_ADDRESS,
            },
        },
        rewardsOracle: {
            [eEthereumNetwork.wannsee]: {
                StkAave: ZERO_ADDRESS,
            },
        },
    },
    EModes: {
        StableEMode: {
            id: "1",
            ltv: "9700",
            liquidationThreshold: "9750",
            liquidationBonus: "10100",
            label: "Stablecoins",
            assets: ["USDC", "USDT", "DAI", "EURS"],
        },
    },
    L2PoolEnabled: {},
    ParaswapRegistry: {},
    FlashLoanPremiums: {
        total: 0.0005e4,
        protocol: 0.0004e4,
    },
    RateStrategies: {
        rateStrategyVolatileOne,
        rateStrategyStableOne,
        rateStrategyStableTwo,
    },
}

module.exports = {
    eEthereumNetwork,
    CommonsConfig,
}
