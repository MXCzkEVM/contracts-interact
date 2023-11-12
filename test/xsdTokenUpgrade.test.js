const { assert, expect } = require("chai")
const { network, ethers, upgrades } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const BigNumber = ethers.BigNumber.from
const getBalance = ethers.provider.getBalance

/* 
1 deploy diamond nft, gin1689 nft
2 deploy wmxc/ride/wbtc/dhx token
3 set nft and token price, set mxcxsd price, modifyRate, modifyCollateral
4 calcXSDAmount 
5 mintXSD
6 BurnXSD
*/

const price_DiamondNFT1 = parseEther("2700")
const price_DiamondNFT2 = parseEther("2600")
const price_DiamondNFT3 = parseEther("3000")
const price_DiamondNFT4 = parseEther("3000")
const price_GinNFT1 = parseEther("100")
const price_GinNFT2 = parseEther("90")
const price_WMXCToken = BigNumber("1")
const price_RideToken = BigNumber("2")
const price_WBTCToken = BigNumber("5000")
const price_DHXToken = BigNumber("100")
const price_mxcxsd = BigNumber("2")

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("xsdTokenUpgrade Unit Tests", function () {
        let owner, user1, XSDProxy, XSDMintContract, WMXCToken, RideToken
        beforeEach(async () => {
            ;[owner, user1] = await ethers.getSigners()

            const NFTContract = await ethers.getContractFactory("BasicNft")
            const ERC20FixedSupplyContract = await ethers.getContractFactory(
                "ERC20FixedSupply"
            )
            WMXCToken = await ERC20FixedSupplyContract.deploy(
                "WMXC",
                "WMXC",
                10000
            )
            RideToken = await ERC20FixedSupplyContract.deploy(
                "Ride",
                "RIDE",
                10000
            )
            DiamondNFT = await NFTContract.deploy("Diamond", "diamond")

            XSDTokenContract = await ethers.getContractFactory("XSDToken")
            XSDMintContract = await ethers.getContractFactory("XSDMintV2")
            XSDProxy = await upgrades.deployProxy(
                XSDTokenContract,
                [owner.address],
                {
                    initializer: "initialize",
                    kind: "uups",
                }
            )
        })

        describe("Constructor", () => {
            it("Initializes the token Correctly.", async () => {
                let name = await XSDProxy.name()
                let symbol = await XSDProxy.symbol()
                let balance = await XSDProxy.balanceOf(owner.address)
                console.log(name, symbol, formatEther(balance))

                XSDProxy = await upgrades.upgradeProxy(
                    XSDProxy,
                    XSDMintContract
                )

                await XSDProxy.setCollateral(
                    [DiamondNFT.address],
                    [RideToken.address],
                    true
                )

                let isCollateral = await XSDProxy.s_acceptNft(
                    DiamondNFT.address
                )
                console.log(isCollateral)
            })
        })
    })
}
