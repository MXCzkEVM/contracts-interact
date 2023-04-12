hh run scripts/layer2.js --network wannsee
hh run scripts/layer2.js --network taiku
hh run scripts/layer1.js --network arbiture_goerli

--network wannsee
--network taiku
--network sepolia

hh run scripts/testnet.js
hh run scripts/contracts.js

test
hh test test/unit/Faucet.test.js

hh console --network wannsee
await network.provider.send("eth_blockNumber", [])

deploy
hh deploy --tags faucet --network wannsee
hh deploy --tags faucet --network taiku
hh deploy --tags simple_storage --network wannsee
hh deploy --network taiku
hh deploy --network wannsee

[taiku]
simpleStorage
0x6F17DbD2C10d11f650fE49448454Bf13dFA91641
MoonToken
0x6c3c72297C448A4BAa6Fc45552657Ad68378E3E1

[wannsee]
simpleStorage
0x77E5a8bE0bb40212458A18dEC1A9752B04Cb6EA1
Moon Token
0xe031013A7B7Caf05FC20Bdc49B731E3F2f0cAfFd
faucet
0x20533B476eFa880Ff135284ab7964Ed8F3C71119 - forget set owner
