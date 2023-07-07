prerequisite
1 xsd/mxc price
2 nft price

token 20%
nft 80%

XSD collateral:
Diamond NFT
Gin 1689 NFT
MXC token
Ride token
DHX token
BTC

这是一个名为 XSDMint 的智能合约，它继承了 ERC20，Ownable 和 IERC721Receiver。
这个合约主要用于创建（mint）和销毁（burn）一个名为 XSD 的 ERC20 代币。
这个合约的主要特点是，它允许用户通过提供 ERC721 代币（NFT）和其他 ERC20 代币作为抵押品来创建 XSD 代币。

以下是一些主要的功能和特点：

initNFTPrice 和 initTokenPrice：这两个函数允许合约的所有者设置 NFT 和 ERC20 代币的价格。这些价格用于计算 XSD 代币的创建和销毁量。

setRate：这个函数允许合约的所有者修改 NFT 和 ERC20 代币的比例。

setCollateral：这个函数允许合约的所有者添加或移除可以作为抵押品的 NFT 和 ERC20 代币。

calcXSDAmount：这个函数计算给定的 NFT 和 ERC20 代币可以创建多少 XSD 代币。

mintXSD：这个函数允许用户通过提供 NFT 和 ERC20 代币作为抵押品来创建 XSD 代币。
在创建代币之前，它会检查用户是否拥有 NFT，是否有足够的 ERC20 代币，以及提供的抵押品是否满足设定的比例。

BurnXSD：这个函数允许用户销毁 XSD 代币并取回他们的抵押品。
在销毁代币之前，它会检查合约是否拥有 NFT，是否有足够的 ERC20 代币，以及提供的抵押品是否满足设定的比例。

checkRatio：这个函数检查提供的 NFT 和 ERC20 代币是否满足设定的比例。

onERC721Received：这是一个必须由实现了 IERC721Receiver 接口的合约实现的函数。当一个 ERC721 代币被发送到这个合约时，这个函数会被调用。

此外，这个合约还定义了一些错误类型，用于在特定条件不满足时抛出错误。例如，如果用户试图创建或销毁 XSD 代币，但没有提供任何 NFT 或 ERC20 代币，那么会抛出 XSDMint\_\_AtLeastOne 错误。
