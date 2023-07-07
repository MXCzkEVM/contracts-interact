const { assert, expect } = require("chai")
const { network, ethers, upgrades } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("MXCL1Bridge Unit Tests", function () {
        let MXCL1BridgeProxy, mxcToken, owner, user1, user2

        beforeEach(async () => {
            ;[owner, user1, user2, ...addrs] = await ethers.getSigners()

            const ERC20 = await ethers.getContractFactory("ERC20FixedSupply")
            mxcToken = await ERC20.deploy("MXCToken", "MXC", 1000)

            // Mint some tokens for users
            await mxcToken.mint(user1.address, parseEther("1000"))

            const Bridge = await ethers.getContractFactory("MXCL1Bridge")
            MXCL1BridgeProxy = await upgrades.deployProxy(
                Bridge,
                [owner.address, mxcToken.address],
                {
                    initializer: "initialize",
                    kind: "uups",
                }
            )
        })

        it("Can't initialized again", async function () {
            await expect(
                MXCL1BridgeProxy.initialize(owner.address, mxcToken.address)
            ).to.be.revertedWith(
                "Initializable: contract is already initialized"
            )
        })

        it("Init value should be correctly", async function () {
            expect(await MXCL1BridgeProxy.admin()).to.equal(owner.address)
            expect(await MXCL1BridgeProxy.MXCToken()).to.equal(mxcToken.address)
        })

        it("Only Owner can upgrade", async function () {
            await MXCL1BridgeProxy.transferAdminship(user1.address)
            const BridgeTest = await ethers.getContractFactory(
                "MXCL1BridgeTest"
            )
            await expect(
                upgrades.upgradeProxy(MXCL1BridgeProxy, BridgeTest)
            ).to.be.revertedWith("MXCL1Bridge__NotAdmin")
        })
        it("Should allow admin to transfer adminship", async function () {
            await MXCL1BridgeProxy.transferAdminship(user2.address)
            expect(await MXCL1BridgeProxy.admin()).to.equal(user2.address)
        })

        it("Should allow deposits of tokens", async function () {
            await mxcToken
                .connect(user1)
                .approve(MXCL1BridgeProxy.address, parseEther("100"))

            await MXCL1BridgeProxy.connect(user1).deposit(parseEther("100"))

            expect(await mxcToken.balanceOf(MXCL1BridgeProxy.address)).to.equal(
                parseEther("100")
            )
        })

        it("Should not allow zero deposits", async function () {
            await mxcToken.connect(user1).approve(MXCL1BridgeProxy.address, 0)
            await expect(
                MXCL1BridgeProxy.connect(user1).deposit(0)
            ).to.be.revertedWith("MXCL1Bridge__AmountZero")
        })

        it("Should not allow deposits of tokens that exceed balance", async function () {
            await mxcToken
                .connect(user1)
                .approve(
                    MXCL1BridgeProxy.address,
                    ethers.utils.parseEther("2000")
                )
            await expect(
                MXCL1BridgeProxy.connect(user1).deposit(
                    ethers.utils.parseEther("2000")
                )
            ).to.be.revertedWith("MXCL1Bridge__TokenNotEnough")
        })

        it("Should allow only admin to withdraw", async function () {
            await expect(
                MXCL1BridgeProxy.connect(user1).withdraw(
                    user1.address,
                    parseEther("100")
                )
            ).to.be.revertedWith("MXCL1Bridge__NotAdmin")
        })
        it("Should allow admin to withdraw tokens", async function () {
            await mxcToken
                .connect(user1)
                .approve(MXCL1BridgeProxy.address, parseEther("100"))
            await MXCL1BridgeProxy.connect(user1).deposit(parseEther("100"))
            await MXCL1BridgeProxy.withdraw(owner.address, parseEther("100"))
            expect(await mxcToken.balanceOf(MXCL1BridgeProxy.address)).to.equal(
                0
            )
            expect(await mxcToken.balanceOf(owner.address)).to.equal(
                parseEther("1100")
            )
        })
        it("Should not allow withdrawals that exceed balance", async function () {
            await mxcToken
                .connect(user1)
                .approve(
                    MXCL1BridgeProxy.address,
                    ethers.utils.parseEther("100")
                )
            await MXCL1BridgeProxy.connect(user1).deposit(
                ethers.utils.parseEther("100")
            )
            await expect(
                MXCL1BridgeProxy.connect(owner).withdraw(
                    owner.address,
                    ethers.utils.parseEther("200")
                )
            ).to.be.revertedWith("Bridge Not enough")
        })
    })
}
