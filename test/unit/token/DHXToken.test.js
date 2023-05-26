const { assert, expect } = require("chai")
const { network, ethers, upgrades } = require("hardhat")
const { developmentChains } = require("../../../helper-hardhat-config")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("DHXToken Unit Tests", function () {
        let owner, user1, proxy, logicAddr, DHXTokenV2Test

        beforeEach(async () => {
            ;[owner, user1] = await ethers.getSigners()

            const DHXTokenContract = await ethers.getContractFactory("DHXToken")
            DHXTokenV2Test = await ethers.getContractFactory("DHXTokenV2Test")
            // 部署合约, 并调用初始化方法
            proxy = await upgrades.deployProxy(
                DHXTokenContract,
                [owner.address],
                {
                    initializer: "initialize",
                    kind: "uups",
                }
            )

            logicAddr = upgrades.erc1967.getImplementationAddress
        })

        it("inital correctly", async () => {
            expect(await proxy.owner()).to.equal(owner.address)
            expect(await proxy.balanceOf(owner.address)).to.equal(
                parseEther("100000000")
            )
        })

        it("upgrade logic", async () => {
            let logic1 = await logicAddr(proxy.address)
            proxy = await upgrades.upgradeProxy(proxy, DHXTokenV2Test)
            let logic2 = await logicAddr(proxy.address)
            expect(logic1).to.not.equal(logic2)

            await proxy.increaseValue()
            await proxy.increaseValue()
            await proxy.decreaseValue()
            expect(await proxy.Number()).to.equal(1)
        })
    })
}
