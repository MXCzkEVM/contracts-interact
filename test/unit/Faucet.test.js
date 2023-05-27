const { assert, expect } = require("chai")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

const { increaseTime } = require("../../utils/utils")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

/* 
1 - deploy moonToken , mint
2 - deploy faucetContract
3 - set the faucetContract as moonToken's owner

main line
- faucet get the token
- user1 request to userServer, userServer request to faucet
- user1 get the moon token and transfer to user2
- user2 can't transfer to anyone
- user2 get the moon token and transfer to user3

second line
- user1 get the moonToken to user3
- user2 get the moonToken to user3
- user3 get 2 moonToken
*/

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("Faucet Unit Tests", function () {
        let owner, userServer, user1, user2, user3, user4, MoonToken, Faucet
        beforeEach(async () => {
            ;[owner, userServer, user1, user2, user3, user4] =
                await ethers.getSigners()
            const MoonTokenContract = await ethers.getContractFactory(
                "MoonERC20"
            )

            MoonToken = await MoonTokenContract.deploy("Moon", "Moon Token")

            const FaucetContract = await ethers.getContractFactory("Faucet")
            Faucet = await FaucetContract.deploy(MoonToken.address)
            await MoonToken.setOwner(Faucet.address)
        })

        describe("faucet request", function () {
            beforeEach(async () => {
                // faucet get the token
                await MoonToken.mint(Faucet.address, parseEther("100000"))
            })
            it("main line", async () => {
                // userServer request to faucet
                await Faucet.connect(userServer).requestMoon(user1.address)
                expect(await MoonToken.balanceOf(user1.address)).to.equal(
                    parseEther("1")
                )
                // user1 get the moon token and transfer to user2
                await MoonToken.connect(user1).transfer(
                    user2.address,
                    parseEther("1")
                )
                expect(await MoonToken.balanceOf(user1.address)).to.equal(0)
                expect(await MoonToken.balanceOf(user2.address)).to.equal(
                    parseEther("1")
                )
                // user2 can't transfer to anyone
                await expect(
                    MoonToken.connect(user2).transfer(
                        user3.address,
                        parseEther("1")
                    )
                ).to.be.revertedWithCustomError(MoonToken, "TransferNotAllow")

                // user2 get the moon token and transfer to user3
                await Faucet.connect(userServer).requestMoon(user2.address)
                await MoonToken.connect(user2).transfer(
                    user3.address,
                    parseEther("1")
                )
                expect(await MoonToken.balanceOf(user3.address)).to.equal(
                    parseEther("1")
                )
            })

            it("second line", async () => {
                await Faucet.connect(userServer).requestMoon(user1.address)
                await Faucet.connect(userServer).requestMoon(user2.address)

                await MoonToken.connect(user1).transfer(
                    user3.address,
                    parseEther("1")
                )
                await MoonToken.connect(user2).transfer(
                    user3.address,
                    parseEther("1")
                )

                expect(await MoonToken.balanceOf(user3.address)).to.equal(
                    parseEther("2")
                )
                await expect(
                    MoonToken.connect(user3).transfer(
                        user4.address,
                        parseEther("1")
                    )
                ).to.be.revertedWithCustomError(MoonToken, "TransferNotAllow")
            })
        })

        describe("requestMoon", function () {
            it("Can't Request Multiple Times", async () => {
                await MoonToken.mint(Faucet.address, parseEther("100000"))
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
            e(owner.address)))
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
                await owner.sendTransadffction({
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
