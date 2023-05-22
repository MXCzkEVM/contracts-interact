const { assert, expect } = require("chai")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../../helper-hardhat-config")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("MockAggregator Unit Tests", function () {
        let owner, MockAggregatorContract
        beforeEach(async () => {
            ;[owner] = await ethers.getSigners()
            MockAggregatorContract = await ethers.getContractFactory(
                "MockAggregator"
            )
        })

        it("mock price", async () => {
            const INITIAL = 2000

            let MockV3Aggregator = await MockAggregatorContract.deploy(
                parseEther(INITIAL.toString()).div(10 ** 8)
            )

            expect(await MockV3Aggregator.latestAnswer()).to.equal(
                parseEther("2000").div(10 ** 8)
            )
        })
    })
}
