const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../../helper-hardhat-config.js")
const h3 = require("h3-js")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance
const BigNumber = ethers.BigNumber
const {
    getMep1002,
    getMep1004,
    getMep1002Name,
    contracts,
    getNameWrapper,
} = require("./address.js")
const namehash = require("eth-ens-namehash").hash
const chainId = network.config.chainId
const config = networkConfig[chainId]

/* 
mep1002.mint('0x87756a7a4ffffff')
0x58b997c6e88ca0404ccfa790fa224a29c3b0b95350511494f20041270df82949
mep1002.setName('0x87756a7a4ffffff', '63970416519386779895700883807905088887598688597384251015603919759227108350085')
0x5382eafc1d152b8948cecbf56ccdb8f4bc81c04e2258a12ce1447b1ce055c2c8

0x087756a292ffffff
0xd16a9b6aeeec4ee0d589723f865da0ce9692c6e5984688ac86395ebb7d7010cc
mep1002.setName('0x087756a292ffffff', '53551285823785723237713183774026980791113027755853721001936078284267512544183')

0x08775698a3ffffff
0x3922049f7e4040d54991719395df41962679c6ad9671d2566d1a162ec4d4687b
mep1002.setName('0x08775698a3ffffff', '')
*/

async function main() {
    // mep1004Func()
    // mep1002SetName()
    // mep1002Event()
    // mep1002SetNameEvent()
    mep1002SetNameFunc()
}

const mep1002Event = async () => {
    let latest = await ethers.provider.getBlockNumber()
    let mep1002 = await getMep1002()
    let events = await mep1002.queryFilter(
        "Transfer",
        contracts.MEP1002Transfer,
        latest
    )
    console.log(events)
}

const mep1002NameEvent = async () => {
    // let latest = await ethers.provider.getBlockNumber()
    let mep1002Name = await getMep1002Name()
    // let events = await mep1002Name.queryFilter("Transfer", 356, latest)
    const startBlock = 61546
    // const endBlock = 50000
    const eventFilter = mep1002Name.filters.Transfer()
    const events = await mep1002Name.queryFilter(
        eventFilter,
        startBlock
        // endBlock
    )
    console.log(events.length, "events")
    // for (const event of events) {
    //     console.log("Indexed event data:", event)
    // }
}

const mep1002SetNameEvent = async () => {
    // event : MEP1002TokenUpdateName
    // 触发: mint setName resetName

    // const inputString = "\\u0004test\\u0004test\\u000btestmep1004\\u0003mxc\\u0000";
    // const decodedString = inputString.replace(/\\u(\w{4})/g, ".").split(".").filter(item => !!item).join(".");
    // console.log(decodedString);

    // let latest = await ethers.provider.getBlockNumber()
    let mep1002 = await getMep1002()
    const eventFilter = mep1002.filters.MEP1002TokenUpdateName()
    const events = await mep1002.queryFilter(
        eventFilter,
        contracts.MEP1002TokenUpdateNameStart
    )

    events = events.map((item) => {
        const tokenId = item.args?.tokenId._hex
        const hexId = tokenId.replace("0x", "")
        const name = item.args?.name

        let st = ""
        for (let i in name) {
            if (name[i].match(/[a-zA-Z0-9]/)) {
                st = st + name[i]
            } else {
                st = st + "."
            }
        }
        if (st.length > 0) {
            if (st[0] == ".") {
                st = st.slice(1, st.length - 1)
            }
            if (st[st.length - 1] == ".") {
                st = st.slice(0, st.length - 2)
            }
        }
        name = [...name].filter((c) => c.match(/[a-zA-Z0-9]/)).join(",")
        name = st.replace(".mxc", "")
        return {
            hexId,
            name,
        }
    })
    console.log(events, "eee")
}

const mep1004Func = async () => {
    let mep1004 = await getMep1004()

    const MEP1002TokenIds = [BigNumber.from("0x0870134a4dffffff")]

    let res = await mep1004.callStatic.insertToMEP1002Slot(
        BigNumber.from(10),
        MEP1002TokenIds[0],
        0
    )
    console.log(res)

    // let latest = await ethers.provider.getBlockNumber()
    // let events = await mep1004.queryFilter("InsertToMEP1002Slot", 356, latest)
    // console.log(events)
}

function getRandomH3Index(res) {
    const MAX_LATITUDE = (90 * Math.PI) / 180
    const MAX_LONGITUDE = (180 * Math.PI) / 180

    const latitude = Math.random() * MAX_LATITUDE
    const longitude = Math.random() * MAX_LONGITUDE
    return h3.latLngToCell(latitude, longitude, res)
}

const mep1002SetNameFunc = async () => {
    const [deployer, user1, user2] = await ethers.getSigners()

    const mep1002 = await getMep1002()
    const mep1002Name = await getMep1002Name()

    // let res = await mep1002Name.totalSupply()
    // console.log(res.toString())

    // readName
    // const tokenName = await mep1002.tokenNames("0x87756a7a4ffffff")
    // console.log(tokenName)

    // Mint
    // // const h3IndexRes7 = getRandomH3Index(7)
    // const h3s = ['0x871ef2144ffffff','0x871f1d489ffffff','0x876520d95ffffff','0x872f5a32dffffff']
    // // const h3IndexRes7Big = BigNumber.from(`0x${h3IndexRes7}`)
    // // console.log(h3IndexRes7Big)
    // for(let i=0;i<h3s.length;i++) {
    //     try {
    //         let res = await mep1002.callStatic.mint(BigNumber.from(h3s[i]))
    //         console.log(res);
    //     } catch (error) {
    //         console.log(i,error);
    //     }
    // }

    let res = await mep1002.callStatic.mint(BigNumber.from("0x874192baeffffff"))
    console.log(res);

    // let res = await mep1002.callStatic.mint(BigNumber.from("0x87194a985ffffff"))
    // console.log(res)
    // let nameWrapperTokenId = BigNumber.from(
    //     namehash("bruce.mxc")
    // )

    // console.log(deployer.address);
    // // setName
    // const h3IndexRes7Big = BigNumber.from(`0x087194a985ffffff`)
    // let res = await mep1002.callStatic.setName(
    //     h3IndexRes7Big,
    //     nameWrapperTokenId
    // )
    // console.log(res);
    // await mep1002.setName(h3IndexRes7Big, nameWrapperTokenId)
    //

    // let res = await mep1002Name.ownerOf(BigNumber.from(`0x87194e68effffff`))
    // console.log(res)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
