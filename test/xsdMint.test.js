
import { expect, assert } from "chai";
import { network, deployments, ethers, getNamedAccounts } from "hardhat";
import { developmentChains } from "../helper-hardhat-config"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parse } from "path";

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
    describe("xsdMint Unit Tests", function () {
        let owner, user1, DiamondNFT, GinNFT, XSDMint, WMXCToken, RideToken, WBTCToken, DHXToken
        beforeEach(async () => {
            [owner, user1] = await ethers.getSigners()

            const NFTContract = await ethers.getContractFactory("BasicNft")
            const ERC20FixedSupplyContract = await ethers.getContractFactory("ERC20FixedSupply")
            const XSDMintContract = await ethers.getContractFactory("XSDMint")

            DiamondNFT = await NFTContract.deploy("Diamond", "diamond")
            GinNFT = await NFTContract.deploy("Gin", "gin1689")
            WMXCToken = await ERC20FixedSupplyContract.deploy("WMXC", "WMXC", 10000)
            RideToken = await ERC20FixedSupplyContract.deploy("Ride", "RIDE", 10000)
            WBTCToken = await ERC20FixedSupplyContract.deploy("WBTC", "WBTC", 10000)
            DHXToken = await ERC20FixedSupplyContract.deploy("DHX", "DHX", 10000)
            XSDMint = await XSDMintContract.deploy(price_mxcxsd)

            for (let i = 0; i < 5; i++) {
                await DiamondNFT.mintNft()
            }
            for (let i = 0; i < 5; i++) {
                await GinNFT.mintNft()
            }
        })

        describe("Constructor", () => {
            it("Initializes the token Correctly.", async () => {
                assert.equal(await DiamondNFT.name(), "Diamond")
                assert.equal(await DiamondNFT.symbol(), "diamond")
                assert.equal(await GinNFT.name(), "Gin")
                assert.equal(await GinNFT.symbol(), "gin1689")

                expect(await DiamondNFT.balanceOf(owner.address)).to.equal(5)
                expect(await GinNFT.balanceOf(owner.address)).to.equal(5)
                expect(await WMXCToken.balanceOf(owner.address)).to.equal(parseEther("10000"))
                expect(await RideToken.balanceOf(owner.address)).to.equal(parseEther("10000"))
                expect(await WBTCToken.balanceOf(owner.address)).to.equal(parseEther("10000"))
                expect(await DHXToken.balanceOf(owner.address)).to.equal(parseEther("10000"))
            })
        })

        describe("SetPrice", () => {
            beforeEach(async () => {
                await XSDMint.initNFTPrice(DiamondNFT.address, 0, price_DiamondNFT1);
                await XSDMint.initNFTPrice(DiamondNFT.address, 1, price_DiamondNFT2);
                await XSDMint.initNFTPrice(GinNFT.address, 0, price_GinNFT1);
                await XSDMint.initNFTPrice(GinNFT.address, 1, price_GinNFT2);

                await XSDMint.initTokenPrice(WMXCToken.address, price_WMXCToken);
                await XSDMint.initTokenPrice(RideToken.address, price_RideToken);
                await XSDMint.initTokenPrice(WBTCToken.address, price_WBTCToken);
                await XSDMint.initTokenPrice(DHXToken.address, price_DHXToken);
            });

            it("Set the token price Correctly.", async () => {
                expect(await XSDMint.s_nftPrice(DiamondNFT.address, 0)).to.equal(price_DiamondNFT1)
                expect(await XSDMint.s_nftPrice(DiamondNFT.address, 1)).to.equal(price_DiamondNFT2)
                expect(await XSDMint.s_nftPrice(GinNFT.address, 0)).to.equal(price_GinNFT1)
                expect(await XSDMint.s_nftPrice(GinNFT.address, 1)).to.equal(price_GinNFT2)

                expect(await XSDMint.s_tokenPrice(WMXCToken.address)).to.equal(price_WMXCToken)
                expect(await XSDMint.s_tokenPrice(RideToken.address)).to.equal(price_RideToken)
                expect(await XSDMint.s_tokenPrice(WBTCToken.address)).to.equal(price_WBTCToken)
                expect(await XSDMint.s_tokenPrice(DHXToken.address)).to.equal(price_DHXToken)
            })
        })

        describe("modifyCollateral", () => {
            it("Not owner set", async () => {
                expect(await XSDMint.s_acceptNft(DiamondNFT.address)).to.equal(false)
                await expect(XSDMint.connect(user1).modifyCollateral([DiamondNFT.address], [WMXCToken.address], true)).to.be.revertedWith("Ownable: caller is not the owner")
            })
            it("Set collateral Correctly", async () => {
                expect(await XSDMint.s_acceptNft(DiamondNFT.address)).to.equal(false)
                await XSDMint.modifyCollateral([DiamondNFT.address], [WMXCToken.address], true)

                expect(await XSDMint.s_acceptNft(DiamondNFT.address)).to.equal(true)
                expect(await XSDMint.s_acceptToken(WMXCToken.address)).to.equal(true)
            })
            it("Not owner set", async () => {
                expect(await XSDMint.s_acceptNft(DiamondNFT.address)).to.equal(false)
                await expect(XSDMint.connect(user1).modifyCollateral([DiamondNFT.address], [WMXCToken.address], true)).to.be.revertedWith("Ownable: caller is not the owner")
            })
        })

        describe("calcXSDAmount", () => {
            beforeEach(async () => {
                await XSDMint.initNFTPrice(DiamondNFT.address, 0, price_DiamondNFT1);
                await XSDMint.initNFTPrice(DiamondNFT.address, 1, price_DiamondNFT2);
                await XSDMint.initNFTPrice(GinNFT.address, 0, price_GinNFT1);
                await XSDMint.initNFTPrice(GinNFT.address, 1, price_GinNFT2);

                await XSDMint.initTokenPrice(WMXCToken.address, price_WMXCToken);
                await XSDMint.initTokenPrice(RideToken.address, price_RideToken);
                await XSDMint.initTokenPrice(WBTCToken.address, price_WBTCToken);
                await XSDMint.initTokenPrice(DHXToken.address, price_DHXToken);

                await XSDMint.modifyCollateral([DiamondNFT.address, GinNFT.address], [WMXCToken.address, RideToken.address, WBTCToken.address, DHXToken.address], true)
            });

            it("Not token or nft", async () => {
                await expect(XSDMint.calcXSDAmount([{
                    collection: DiamondNFT.address,
                    token_id: 0,
                }], [])).to.be.revertedWithCustomError(XSDMint, "XSDMint__AtLeastOne")
                await expect(XSDMint.calcXSDAmount([], [
                    {
                        token: WMXCToken.address,
                        amount: 1
                    }
                ])).to.be.revertedWithCustomError(XSDMint, "XSDMint__AtLeastOne")
            })

            it("Calc amount correctly", async () => {
                let wmx_amount = parseEther("100")
                let targetv = await XSDMint.calcXSDAmount([{
                    collection: DiamondNFT.address,
                    token_id: 0,
                }], [{
                    token: WMXCToken.address,
                    amount: wmx_amount
                }])
                // expect = (price_DiamondNFT1 + price_WMXCToken * amount)/price_mxcxsd
                // (2700 + 1 * 100) / 2
                expect(targetv).to.equal(price_DiamondNFT1.add(price_WMXCToken.mul(wmx_amount)).div(price_mxcxsd))

                let ride_amount = parseEther("3")
                targetv = await XSDMint.calcXSDAmount([{
                    collection: DiamondNFT.address,
                    token_id: 1,
                }], [{
                    token: RideToken.address,
                    amount: ride_amount
                }])
                // (2600 + 2*3) / 2
                expect(targetv).to.equal(price_DiamondNFT2.add(price_RideToken.mul(ride_amount)).div(price_mxcxsd))

                wmx_amount = parseEther("1")
                targetv = await XSDMint.calcXSDAmount([{
                    collection: GinNFT.address,
                    token_id: 1,
                }], [{
                    token: WMXCToken.address,
                    amount: wmx_amount
                }])
                // (90 + 1)/2
                expect(targetv).to.equal(price_GinNFT2.add(price_WMXCToken.mul(wmx_amount)).div(price_mxcxsd))

                let btc_amount = parseEther("2")
                targetv = await XSDMint.calcXSDAmount([{
                    collection: GinNFT.address,
                    token_id: 0,
                }, {
                    collection: GinNFT.address,
                    token_id: 1,
                }], [{
                    token: WBTCToken.address,
                    amount: btc_amount
                }])
                expect(targetv).to.equal((price_GinNFT1.add(price_GinNFT2).add(price_WBTCToken.mul(btc_amount))).div(price_mxcxsd))
            })
        })

        describe("MintXSD", () => {
            beforeEach(async () => {
                await XSDMint.initNFTPrice(DiamondNFT.address, 0, price_DiamondNFT1);
                await XSDMint.initNFTPrice(DiamondNFT.address, 1, price_DiamondNFT2);
                await XSDMint.initNFTPrice(GinNFT.address, 0, price_GinNFT1);
                await XSDMint.initNFTPrice(GinNFT.address, 1, price_GinNFT2);

                await XSDMint.initTokenPrice(WMXCToken.address, price_WMXCToken);
                await XSDMint.initTokenPrice(RideToken.address, price_RideToken);
                await XSDMint.initTokenPrice(WBTCToken.address, price_WBTCToken);
                await XSDMint.initTokenPrice(DHXToken.address, price_DHXToken);

                await XSDMint.modifyCollateral([DiamondNFT.address, GinNFT.address], [WMXCToken.address, RideToken.address, WBTCToken.address, DHXToken.address], true)
            });

            it("No token or nft", async () => {
                await expect(XSDMint.mintXSD([{
                    collection: DiamondNFT.address,
                    token_id: 0,
                }], [])).to.be.revertedWithCustomError(XSDMint, "XSDMint__AtLeastOne")
                await expect(XSDMint.mintXSD([], [{
                    token: WMXCToken.address,
                    amount: 1
                }])).to.be.revertedWithCustomError(XSDMint, "XSDMint__AtLeastOne")
            })

            it("NFT not owner", async () => {
                await expect(XSDMint.connect(user1).mintXSD([{
                    collection: DiamondNFT.address,
                    token_id: 0,
                }], [{
                    token: WMXCToken.address,
                    amount: 1
                }])).to.be.revertedWithCustomError(XSDMint, "XSDMint__NFTNotOwner")
            })

            it("Token amount overlow", async () => {
                await DiamondNFT.approve(XSDMint.address, 0)
                await WMXCToken.approve(XSDMint.address, parseEther("10000"))
                await expect(XSDMint.mintXSD([{
                    collection: DiamondNFT.address,
                    token_id: 0,
                }], [{
                    token: WMXCToken.address,
                    amount: parseEther("10001")
                }])).to.be.revertedWithCustomError(XSDMint, "XSDMint__TokenOverAmount")
            })

            it("Mint unbalance", async () => {
                await DiamondNFT.approve(XSDMint.address, 0)
                await WMXCToken.approve(XSDMint.address, parseEther("100"))
                await expect(XSDMint.mintXSD([{
                    collection: DiamondNFT.address,
                    token_id: 0,
                }], [{
                    token: WMXCToken.address,
                    amount: parseEther("100")
                }])).to.be.revertedWithCustomError(XSDMint, "XSDMint__Unbalance")
            })

            it("Mint correctly", async () => {
                await GinNFT.approve(XSDMint.address, 0)
                await WMXCToken.approve(XSDMint.address, parseEther("25"))

                let wmxc_amount = parseEther("25")
                await XSDMint.mintXSD([{
                    collection: GinNFT.address,
                    token_id: 0,
                }], [{
                    token: WMXCToken.address,
                    amount: wmxc_amount
                }])
                // 100+25/ 2 = 62.5
                // owner get the xsd token
                let rws = (price_GinNFT1.add(wmxc_amount.mul(price_WMXCToken))).div(price_mxcxsd)
                expect(await XSDMint.balanceOf(owner.address)).to.equal(rws)

                // contract get token and nft
                expect(await GinNFT.ownerOf(0)).to.equal(XSDMint.address)
                expect(await WMXCToken.balanceOf(XSDMint.address)).to.equal(parseEther("25"))
            })
        })

        describe("BurnXSD", () => {
            beforeEach(async () => {
                await XSDMint.initNFTPrice(DiamondNFT.address, 0, price_DiamondNFT1);
                await XSDMint.initNFTPrice(DiamondNFT.address, 1, price_DiamondNFT2);
                await XSDMint.initNFTPrice(GinNFT.address, 0, price_GinNFT1);
                await XSDMint.initNFTPrice(GinNFT.address, 1, price_GinNFT2);

                await XSDMint.initTokenPrice(WMXCToken.address, price_WMXCToken);
                await XSDMint.initTokenPrice(RideToken.address, price_RideToken);
                await XSDMint.initTokenPrice(WBTCToken.address, price_WBTCToken);
                await XSDMint.initTokenPrice(DHXToken.address, price_DHXToken);

                await XSDMint.modifyCollateral([DiamondNFT.address, GinNFT.address], [WMXCToken.address, RideToken.address, WBTCToken.address, DHXToken.address], true)

                await GinNFT.approve(XSDMint.address, 0)
                await DiamondNFT.approve(XSDMint.address, 0)
                await WMXCToken.approve(XSDMint.address, parseEther("700"))
                await XSDMint.mintXSD([{
                    collection: GinNFT.address,
                    token_id: 0,
                }, {
                    collection: DiamondNFT.address,
                    token_id: 0,
                }], [{
                    token: WMXCToken.address,
                    amount: parseEther("700")
                }])
            });

            it("No token or nft", async () => {
                await expect(XSDMint.BurnXSD([{
                    collection: DiamondNFT.address,
                    token_id: 0,
                }], [])).to.be.revertedWithCustomError(XSDMint, "XSDMint__AtLeastOne")
                await expect(XSDMint.BurnXSD([], [{
                    token: WMXCToken.address,
                    amount: 1
                }])).to.be.revertedWithCustomError(XSDMint, "XSDMint__AtLeastOne")
            })

            it("NFT not in XSDMint contract", async () => {
                await expect(XSDMint.BurnXSD([{
                    collection: DiamondNFT.address,
                    token_id: 1,
                }], [{
                    token: WMXCToken.address,
                    amount: 1
                }])).to.be.revertedWithCustomError(XSDMint, "XSDMint__NFTNotExist")
            })

            it("XSDMint token insufficient", async () => {
                await expect(XSDMint.BurnXSD([{
                    collection: GinNFT.address,
                    token_id: 0,
                }], [{
                    token: WMXCToken.address,
                    amount: parseEther("800")
                }])).to.be.revertedWithCustomError(XSDMint, "XSDMint__TokenExhausted")
            })

            it("Burn amount unbalance", async () => {
                await expect(XSDMint.BurnXSD([{
                    collection: GinNFT.address,
                    token_id: 0,
                }], [{
                    token: WMXCToken.address,
                    amount: parseEther("700")
                }])).to.be.revertedWithCustomError(XSDMint, "XSDMint__Unbalance")
            })

            it("XSD balance not enough", async () => {
                await expect(XSDMint.BurnXSD([{
                    collection: GinNFT.address,
                    token_id: 0,
                }], [{
                    token: WMXCToken.address,
                    amount: parseEther("700")
                }])).to.be.revertedWithCustomError(XSDMint, "XSDMint__Unbalance")
            })



            // it("Mint unbalance", async () => {
            //     await DiamondNFT.approve(XSDMint.address, 0)
            //     await WMXCToken.approve(XSDMint.address, parseEther("100"))
            //     await expect(XSDMint.mintXSD([{
            //         collection: DiamondNFT.address,
            //         token_id: 0,
            //     }], [{
            //         token: WMXCToken.address,
            //         amount: parseEther("100")
            //     }])).to.be.revertedWithCustomError(XSDMint, "XSDMint__Unbalance")
            // })

            // it("Mint correctly", async () => {
            //     await GinNFT.approve(XSDMint.address, 0)
            //     await WMXCToken.approve(XSDMint.address, parseEther("25"))

            //     let wmxc_amount = parseEther("25")
            //     await XSDMint.mintXSD([{
            //         collection: GinNFT.address,
            //         token_id: 0,
            //     }], [{
            //         token: WMXCToken.address,
            //         amount: wmxc_amount
            //     }])
            //     // 100+25/ 2 = 62.5
            //     // owner get the xsd token
            //     let rws = (price_GinNFT1.add(wmxc_amount.mul(price_WMXCToken))).div(price_mxcxsd)
            //     expect(await XSDMint.balanceOf(owner.address)).to.equal(rws)

            //     // contract get token and nft
            //     expect(await GinNFT.ownerOf(0)).to.equal(XSDMint.address)
            //     expect(await WMXCToken.balanceOf(XSDMint.address)).to.equal(parseEther("25"))
            // })
        })
    })
}
