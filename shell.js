network
/* 
--network wannsee
--network taiku
--network sepolia
*/

scripts
/* 
hh run scripts/testnet.js
hh run scripts/contracts.js
hh run scripts/swap.js

hh run scripts/layer2.js --network taiku

hh run scripts/layer1.js --network arbiture_goerli
hh run scripts/bridge.js --network arbiture_goerli
hh run scripts/bridge/bridgeL1.js --network arbiture_goerli

hh run scripts/bridge/bridgeL2.js --network wannsee
hh run scripts/layer2.js --network wannsee
hh run scripts/swap.js --network wannsee
hh run scripts/token.js --network wannsee
hh run scripts/mns/index.js --network wannsee
hh run scripts/token/digiToken.js --network wannsee
hh run scripts/token/xsdToken.js --network wannsee


hh run scripts/token/digiToken.js --network wannsee_mainnet
hh run scripts/token/xsdToken.js --network wannsee_mainnet
hh run scripts/mep/index.js --network wannsee_mainnet
hh run scripts/other/simpleStorage.js --network wannsee_mainnet
*/

test
/* 
hh test test/Faucet.test.js
hh test test/GetInitHash.test.js
hh test test/token/MXCToken.test.js
hh test test/token/DHXToken.test.js
hh test test/token/GRYDToken.test.js
hh test test/chainlink/MockAggregator.test.js
hh test test/bridge/MXCL1Bridge.test.js
hh test test/bridge/MXCL2Bridge.test.js
hh test test/xsdTokenUpgrade.test.js


hh console --network wannsee
await network.provider.send("eth_blockNumber", [])
*/

deploy
/* 
[bridge]
hh deploy --network taiku

hh deploy --tags bridgeL1 --network arbiture_goerli


hh deploy --network wannsee
hh deploy --tags bridgeL2 --network wannsee
hh deploy --tags simpleStorage --network wannsee
hh deploy --tags grydToken --network wannsee

hh deploy --tags dhxToken --network wannsee
hh deploy --tags bridge_faucet --network wannsee
hh deploy --tags xsdTokenTest --network wannsee

hh deploy --tags digiToken --network wannsee_mainnet
hh deploy --tags bmxc --network wannsee_mainnet
hh deploy --tags xsdToken --network wannsee_mainnet

[aave]
hh deploy --tags aave-oracle --network wannsee
hh deploy --tags aave-oracle --network wannsee_mainnet
hh deploy --tags aave-token --network wannsee
*/
