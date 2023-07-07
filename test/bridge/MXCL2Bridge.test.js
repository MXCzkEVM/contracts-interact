const { assert, expect } = require("chai")
const { network, ethers, upgrades } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("MXCL2Bridge Unit Tests", function () {
        let MXCL2BridgeProxy, owner, user1, user2

        beforeEach(async () => {
            ;[owner, user1, user2, ...addrs] = await ethers.getSigners()

            const Bridge = await ethers.getContractFactory("MXCL2Bridge")
            MXCL2BridgeProxy = await upgrades.deployProxy(
                Bridge,
                [owner.address],
                {
                    initializer: "initialize",
                    kind: "uups",
                }
            )
        })

        it("Can't initialized again", async function () {
            await expect(
                MXCL2BridgeProxy.initialize(owner.address)
            ).to.be.revertedWith(
                "Initializable: contract is already initialized"
            )
        })

        it("Init value should be correctly", async function () {
            expect(await MXCL2BridgeProxy.admin()).to.equal(owner.address)
        })

        it("Only Owner can upgrade", async function () {
            await MXCL2BridgeProxy.transferAdminship(user1.address)
            const BridgeTest = await ethers.getContractFactory(
                "MXCL2BridgeTest"
            )
            await expect(
                upgrades.upgradeProxy(MXCL2BridgeProxy, BridgeTest)
            ).to.be.revertedWith("MXCL2Bridge__NotAdmin")
        })
        it("Should allow admin to transfer adminship", async function () {
            await MXCL2BridgeProxy.connect(owner).transferAdminship(
                user2.address
            )
            expect(await MXCL2BridgeProxy.admin()).to.equal(user2.address)
        })

        it("Should allow deposits of ether", async function () {
            await expect(
                user1.sendTransaction({
                    to: MXCL2BridgeProxy.address,
                    value: parseEther("1"),
                })
            )
                .to.emit(MXCL2BridgeProxy, "Deposited")
                .withArgs(user1.address, parseEther("1"))
        })

        it("Should allow only admin to withdraw", async function () {
            await user1.sendTransaction({
                to: MXCL2BridgeProxy.address,
                value: parseEther("1"),
            })
            await expect(
                MXCL2BridgeProxy.connect(user1).withdraw(
                    user1.address,
                    parseEther("1")
                )
            ).to.be.revertedWith("MXCL2Bridge__NotAdmin")
        })

        it("Should allow admin to withdraw ether", async function () {
            await user1.sendTransaction({
                to: MXCL2BridgeProxy.address,
                value: parseEther("1"),
            })
            await expect(
                MXCL2BridgeProxy.connect(owner).withdraw(
                    owner.address,
                    parseEther("1")
                )
            )
                .to.emit(MXCL2BridgeProxy, "Withdrawn")
                .withArgs(owner.address, parseEther("1"))
        })
        it("Should not allow withdrawals that exceed balance", async function () {
            await user1.sendTransaction({
                to: MXCL2BridgeProxy.address,
                value: parseEther("1"),
            })
            await expect(
                MXCL2BridgeProxy.connect(owner).withdraw(
                    owner.address,
                    parseEther("2")
                )
            ).to.be.revertedWith("MXCL2Bridge__NotEnough")
        })
    })
}
