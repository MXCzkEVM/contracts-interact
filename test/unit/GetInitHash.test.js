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
    describe("getInitHash Unit Tests", function () {
        let owner, userServer, user1, user2, user3, user4, MoonToken, Faucet
        beforeEach(async () => {
            ;[owner, userServer, user1, user2, user3, user4] =
                await ethers.getSigners()
            const CallHashContract = await ethers.getContractFactory("CallHash")

            CallHash = await CallHashContract.deploy()
        })

        describe("getValue", function () {
            it("main line", async () => {
                // userServer request to faucet
                let res = await CallHash.getInitHash()
                console.log(res)
            })
        })
    })
}
