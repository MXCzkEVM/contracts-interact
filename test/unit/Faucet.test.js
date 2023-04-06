const { assert, expect } = require("chai")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

const { increaseTime } = require("../../utils/utils")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("Faucet Unit Tests", function () {
        let owner, user1, MoonToken, Faucet
        beforeEach(async () => {
            ;[owner, user1] = await ethers.getSigners()
            const TokenContract = await ethers.getContractFactory(
                "ERC20FixedSupply"
            )
            // default mint 10eth
            MoonToken = await TokenContract.deploy("Moon", "Moon", 10000)

            // deploy faucet
            const FaucetContract = await ethers.getContractFactory("Faucet")
            Faucet = await FaucetContract.deploy(MoonToken.address)
        })

        describe("requestMoon", function () {
            it("Can't Request Multiple Times", async () => {
                await MoonToken.mint(Faucet.address, parseEther("5000"))
                await Faucet.requestMoon(user1.address)
                await expect(
                    Faucet.requestMoon(user1.address)
                ).to.be.revertedWithCustomError(Faucet, "Faucet_ReqMultiTimes")
            })
            it("contract's token balance not enough", async () => {
                await MoonToken.mint(Faucet.address, parseEther("0.5"))
                await expect(
                    Faucet.requestMoon(user1.address)
                ).to.be.revertedWithCustomError(Faucet, "Faucet_MoonEmpty")
            })
            it("request moon success", async () => {
                await MoonToken.mint(Faucet.address, parseEther("5000"))
                await expect(Faucet.requestMoon(user1.address))
                    .to.emit(Faucet, "SendMoon")
                    .withArgs(user1.address)
                expect(await MoonToken.balanceOf(user1.address)).to.equal(
                    parseEther("1")
                )
            })
        })

        describe("requestMXC", function () {
            it("lockTime not expired", async () => {
                // console.log(formatEther(await getBalance(owner.address)))
                await owner.sendTransaction({
                    to: Faucet.address,
                    value: parseEther("2000"),
                })
                await Faucet.requestMXC(user1.address)
                await expect(
                    Faucet.requestMXC(user1.address)
                ).to.be.revertedWithCustomError(
                    Faucet,
                    "Faucet_LockTimeNotExpired"
                )
            })
            it("contract's MXC balance not enough", async () => {
                await owner.sendTransaction({
                    to: Faucet.address,
                    value: parseEther("99"),
                })
                await expect(
                    Faucet.requestMXC(user1.address)
                ).to.be.revertedWithCustomError(Faucet, "Faucet_MXCEmpty")
            })
            it("request mxc success", async () => {
                await owner.sendTransaction({
                    to: Faucet.address,
                    value: parseEther("2000"),
                })

                let balance = await getBalance(user1.address)
                await Faucet.requestMXC(user1.address)
                // pass one day
                await increaseTime(24 * 60 * 60)
                await Faucet.requestMXC(user1.address)
                balance = (await getBalance(user1.address)).sub(balance)

                expect(balance).to.equal(parseEther("200"))
            })
        })
    })
}
