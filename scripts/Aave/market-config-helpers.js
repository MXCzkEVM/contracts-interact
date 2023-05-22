const { deployments, network } = require("hardhat")
const { getAddress } = require("ethers/lib/utils")
const { CommonsConfig, eEthereumNetwork } = require("./config/common.js")
const {
    strategyDAI,
    strategyUSDC,
    strategyLINK,
    strategyDHX,
} = require("./config/reservesConfigs.js")
const { networkConfig } = require("../../helper-hardhat-config.js")
const chainId = network.config.chainId
const config = networkConfig[chainId]

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const TESTNET_TOKEN_PREFIX = `-TestnetMintableERC20-Aave`

const wannseeMarket = {
    ...CommonsConfig,
    MarketId: "Wannsee Market",
    ATokenNamePrefix: "Wannsee",
    StableDebtTokenNamePrefix: "Wannsee",
    VariableDebtTokenNamePrefix: "Wannsee",
    SymbolPrefix: "Mxc",
    ProviderId: 30,
    ReservesConfig: {
        DAI: strategyDAI,
        USDC: strategyUSDC,
        LINK: strategyLINK,
        // DHX: strategyDHX,
    },
    ReserveAssets: {
        [eEthereumNetwork.wannsee]: {
            DAI: ZERO_ADDRESS,
            USDC: ZERO_ADDRESS,
            LINK: ZERO_ADDRESS,
        },
    },
}

const ConfigNames = {
    wannsee: "wannsee",
}

const loadPoolConfig = (configName) => {
    switch (configName) {
        case ConfigNames.wannsee:
            return wannseeMarket
        default:
            throw new Error(
                `Unsupported pool configuration: ${configName} is not one of the supported configs ${Object.values(
                    ConfigNames
                )}`
            )
    }
}

const getParamPerNetwork = (param, network) => {
    if (!param) return undefined

    return param[network]
}

const getTreasuryAddress = async (poolConfig, network) => {
    const treasuryConfigAddress = getParamPerNetwork(
        poolConfig.ReserveFactorTreasuryAddress,
        network
    )

    if (
        treasuryConfigAddress &&
        getAddress(treasuryConfigAddress) !== getAddress(ZERO_ADDRESS)
    ) {
        return treasuryConfigAddress
    }

    console.log(
        "[WARNING] Using latest deployed Treasury proxy instead of ReserveFactorTreasuryAddress from configuration file"
    )

    const deployedTreasury = await deployments.get("TreasuryProxy")

    return deployedTreasury.address
}

const getReserveAddresses = async (poolConfig, network) => {
    const isLive = config.live

    if (isLive && !poolConfig.TestnetMarket) {
        console.log("[NOTICE] Using ReserveAssets from configuration file")

        return getParamPerNetwork(poolConfig.ReserveAssets, network) || {}
    }
    console.log(
        "[WARNING] Using deployed Testnet tokens instead of ReserveAssets from configuration file"
    )
    const reservesKeys = Object.keys(poolConfig.ReservesConfig)
    const allDeployments = await hre.deployments.all()
    const testnetTokenKeys = Object.keys(allDeployments).filter(
        (key) =>
            key.includes(TESTNET_TOKEN_PREFIX) &&
            reservesKeys.includes(key.replace(TESTNET_TOKEN_PREFIX, ""))
    )
    return testnetTokenKeys.reduce((acc, key) => {
        const symbol = key.replace(TESTNET_TOKEN_PREFIX, "")
        acc[symbol] = allDeployments[key].address
        return acc
    }, {})
}

module.exports = {
    loadPoolConfig,
    getTreasuryAddress,
    getReserveAddresses,
}
