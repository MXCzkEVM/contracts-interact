hh run scripts/testnet.js --network wannsee
hh run scripts/testnet.js --network taiku
hh run scripts/testnet.js --network sepolia
hh deploy --network taiku
hh deploy --network wannsee

simpleStorage
0x6F17DbD2C10d11f650fE49448454Bf13dFA91641

test
hh test test/unit/Faucet.test.js

hh console --network wannsee
await network.provider.send("eth_blockNumber", [])
