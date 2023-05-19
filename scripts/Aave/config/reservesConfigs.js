const {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
} = require("./rateStrategies")

const strategyDAI = {
    strategy: rateStrategyStableTwo,
    baseLTVAsCollateral: "7500",
    liquidationThreshold: "8000",
    liquidationBonus: "10500",
    liquidationProtocolFee: "1000",
    borrowingEnabled: true,
    stableBorrowRateEnabled: true,
    flashLoanEnabled: true,
    reserveDecimals: "18",
    aTokenImpl: "AToken",
    reserveFactor: "1000",
    supplyCap: "2000000000",
    borrowCap: "0",
    debtCeiling: "0",
    borrowableIsolation: true,
}

const strategyUSDC = {
    strategy: rateStrategyStableOne,
    baseLTVAsCollateral: "8000",
    liquidationThreshold: "8500",
    liquidationBonus: "10500",
    liquidationProtocolFee: "1000",
    borrowingEnabled: true,
    stableBorrowRateEnabled: true,
    flashLoanEnabled: true,
    reserveDecimals: "6",
    aTokenImpl: "AToken",
    reserveFactor: "1000",
    supplyCap: "2000000000",
    borrowCap: "0",
    debtCeiling: "0",
    borrowableIsolation: true,
}

const strategyLINK = {
    strategy: rateStrategyVolatileOne,
    baseLTVAsCollateral: "7000",
    liquidationThreshold: "7500",
    liquidationBonus: "11000",
    liquidationProtocolFee: "1000",
    borrowingEnabled: true,
    stableBorrowRateEnabled: false,
    flashLoanEnabled: true,
    reserveDecimals: "18",
    aTokenImpl: "AToken",
    reserveFactor: "2000",
    supplyCap: "0",
    borrowCap: "0",
    debtCeiling: "0",
    borrowableIsolation: false,
}

module.exports = {
    strategyDAI,
    strategyUSDC,
    strategyLINK,
}
