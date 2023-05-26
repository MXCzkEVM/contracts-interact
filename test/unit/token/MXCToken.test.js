const { assert, expect } = require("chai")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../../helper-hardhat-config")

const { increaseTime } = require("../../../utils/utils")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("MXCToken Unit Tests", function () {
        let owner, user1, user2, MXCToken
        beforeEach(async () => {
            ;[owner, user1, user2] = await ethers.getSigners()
            const MXCTokenContract = await ethers.getContractFactory("MXCToken")

            MXCToken = await MXCTokenContract.deploy()
        })

        describe("request", function () {
            it("main line", async () => {
                // userServer request to faucet
                // await Faucet.connect(userServer).requestMoon(user1.address)
                let res = await MXCToken.balanceOf(owner.address)
                console.log(res)

                // expect(await MXCToken.balanceOf(user1.address)).to.equal(
                //     parseEther("1")
                // )
            })
        })
    })
}
