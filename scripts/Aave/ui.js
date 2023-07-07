const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const {
    contractsAddress,
    tokenAddress,
    getUiPoolDataProviderV3,
} = require("./address.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber

async function main() {
    await UiPoolDataProviderV3Func()
}

const UiPoolDataProviderV3Func = async () => {
    const UiPoolDataProviderV3 = await getUiPoolDataProviderV3()
    // const reservesData = await UiPoolDataProviderV3.getReservesData(
    //     contractsAddress.POOL_ADDRESS_PROVIDER
    // )
    // console.log(reservesData)

    // const reservesList = await UiPoolDataProviderV3.getReservesList(
    //     contractsAddress.POOL_ADDRESS_PROVIDER
    // )
    // console.log(reservesList)

    const reservesUser = await UiPoolDataProviderV3.getUserReservesData(
        contractsAddress.POOL_ADDRESS_PROVIDER,
        "0x45A83F015D0265800CBC0dACe1c430E724D49cAc"
    )
    console.log(reservesUser)

    // const lendingPoolAddressProvider = contractsAddress.POOL_ADDRESS_PROVIDER

    // let [reservesRaw, poolBaseCurrencyRaw] =
    //     await UiPoolDataProviderV3.getReservesData(
    //         contractsAddress.POOL_ADDRESS_PROVIDER
    //     )
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
