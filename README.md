hh run scripts/testnet.js --network wannsee
hh run scripts/testnet.js --network taiku
hh run scripts/testnet.js --network sepolia
hh deploy --network taiku
hh deploy --network wannsee

test
hh test test/unit/Faucet.test.js

hh console --network wannsee
await network.provider.send("eth_blockNumber", [])

deploy
hh deploy --tags faucet --network wannsee
hh deploy --tags simple_storage --network wannsee

[taiku]
simpleStorage
0x6F17DbD2C10d11f650fE49448454Bf13dFA91641
MoonToken
0x6c3c72297C448A4BAa6Fc45552657Ad68378E3E1

[wannsee]
simpleStorage
0x77E5a8bE0bb40212458A18dEC1A9752B04Cb6EA1
