const { assert, expect } = require("chai")
const { network, ethers, upgrades } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("GRYDToken Unit Tests", function () {
        let owner, user1, proxy

        beforeEach(async () => {
            ;[owner, user1] = await ethers.getSigners()

            const GRYDTokenCont = await ethers.getContractFactory("GRYDToken")
            // 部署合约, 并调用初始化方法
            proxy = await upgrades.deployProxy(GRYDTokenCont, [owner.address], {
                initializer: "initialize",
                kind: "uups",
            })
        })

        it("inital correctly", async () => {
            expect(await proxy.owner()).to.equal(owner.address)
            expect(await proxy.name()).to.equal("GRYD Token")
            expect(await proxy.symbol()).to.equal("GRYD")
            expect(await proxy.balanceOf(owner.address)).to.equal(
                parseEther("100000000")
            )
        })
    })
}
