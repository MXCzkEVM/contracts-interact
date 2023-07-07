// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "solmate/src/tokens/ERC20.sol";
import "solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IUniswapV2Factory {
    function getPair(
        address tokenA,
        address tokenB
    ) external view returns (address pair);
}

interface IUniswapV2Pair {
    function token0() external view returns (address);

    function token1() external view returns (address);

    function getReserves()
        external
        view
        returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

interface IMXCMarketplace {
    struct LatestInfo {
        uint256 price;
        uint256 transactions;
    }

    function assertPrice(
        address,
        uint256
    ) external view returns (LatestInfo memory);
}

error XSDMint__PairNotExist();
error XSDMint__NotAllowAsset();
error XSDMint__AtLeastOne();
error XSDMint__NFTNotOwner();
error XSDMint__TokenOverAmount();
error XSDMint__TokenExhausted();
error XSDMint__Unbalance();
error XSDMint__IllegalAmount();
error XSDMint__NFTNotExist();
error XSDMint__XSDNotEnough();
error XSDMint__AssetNotRequiement();

contract XSDMint is ERC20, IERC721Receiver {
    address public s_admin;
    address public s_swapFactory;
    address public s_weth;
    uint128 public s_priceUnit;
    uint128 public s_nftMinimum;
    uint256[2] public rate = [8, 2];
    mapping(ERC721 => bool) public s_acceptNft;
    mapping(ERC20 => bool) public s_acceptToken;

    struct NFTTokens {
        ERC721 collection;
        uint256 token_id;
    }
    struct ERC20Tokens {
        ERC20 token;
        uint256 amount;
    }

    modifier onlyOwner() {
        require(msg.sender == s_admin, "Ownable: caller is not the owner");
        _;
    }

    constructor(
        address _factoryAddress,
        address _weth
    ) ERC20("XSD Token", "XSD", 18) {
        s_admin = msg.sender;
        s_swapFactory = _factoryAddress;
        s_weth = _weth;
        s_priceUnit = 6;
        s_nftMinimum = 3;
    }

    function setCollateralRate(uint256[2] calldata _rate) external onlyOwner {
        rate = _rate;
    }

    function setFactory(address _factoryAddress) external onlyOwner {
        s_swapFactory = _factoryAddress;
    }

    function setWMXC(address _wethAddress) external onlyOwner {
        s_weth = _wethAddress;
    }

    function setCollateral(
        ERC721[] calldata nftAddr,
        ERC20[] calldata erc20Addr,
        bool addOrRemove
    ) public onlyOwner {
        uint256 nft_length = nftAddr.length;
        uint256 erc20_length = erc20Addr.length;

        for (uint256 i; i < nft_length; ) {
            s_acceptNft[nftAddr[i]] = addOrRemove;
            unchecked {
                ++i;
            }
        }
        for (uint256 i; i < erc20_length; ) {
            s_acceptToken[erc20Addr[i]] = addOrRemove;
            unchecked {
                ++i;
            }
        }
    }

    function getTokenPrice(address _token) public view returns (uint256) {
        if (_token == s_weth) {
            return uint256(10 ** s_priceUnit);
        }

        IUniswapV2Factory factory = IUniswapV2Factory(s_swapFactory);
        address pairAddress = factory.getPair(s_weth, _token);

        if (pairAddress == address(0)) {
            revert XSDMint__PairNotExist();
        }

        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        (uint112 reserve0, uint112 reserve1, ) = pair.getReserves();
        address token0 = pair.token0();

        if (token0 == s_weth) {
            return (uint256(reserve1) * (10 ** s_priceUnit)) / reserve0;
        } else {
            return (uint256(reserve0) * (10 ** s_priceUnit)) / reserve1;
        }
    }

    function getNFTValue(
        NFTTokens[] calldata nftTokens
    ) internal view returns (uint256 nft_value) {
        uint256 nft_length = nftTokens.length;

        for (uint256 i; i < nft_length; ) {
            ERC721 collection = nftTokens[i].collection;
            uint256 token_id = nftTokens[i].token_id;

            if (!s_acceptNft[collection]) {
                revert XSDMint__NotAllowAsset();
            }

            IMXCMarketplace mkp = IMXCMarketplace(address(collection));
            IMXCMarketplace.LatestInfo memory leatestInfo = mkp.assertPrice(
                address(collection),
                token_id
            );
            if (
                leatestInfo.transactions < s_nftMinimum ||
                leatestInfo.price == 0
            ) {
                revert XSDMint__AssetNotRequiement();
            }
            nft_value = nft_value + leatestInfo.price * (10 ** s_priceUnit);

            unchecked {
                ++i;
            }
        }
    }

    function getTokenValue(
        ERC20Tokens[] calldata erc20Tokens
    ) internal view returns (uint256 token_value) {
        uint256 erc20_length = erc20Tokens.length;

        for (uint256 i; i < erc20_length; ) {
            ERC20 token = erc20Tokens[i].token;
            uint256 amount = erc20Tokens[i].amount;

            if (!s_acceptToken[token]) {
                revert XSDMint__NotAllowAsset();
            }

            uint256 tokenPrice = getTokenPrice(address(token));

            token_value = token_value + tokenPrice * amount;
            unchecked {
                ++i;
            }
        }
    }

    function calcXSDAmount(
        NFTTokens[] calldata nftTokens,
        ERC20Tokens[] calldata erc20Tokens
    ) external view returns (uint256) {
        if (nftTokens.length == 0 || erc20Tokens.length == 0) {
            revert XSDMint__AtLeastOne();
        }

        uint256 nft_value = getNFTValue(nftTokens);
        uint256 token_value = getTokenValue(erc20Tokens);
        uint256 xsdPrice = getTokenPrice(address(this));
        uint256 xsdMintAmount = (nft_value + token_value) / xsdPrice;
        return xsdMintAmount;
    }

    function mintXSD(
        NFTTokens[] calldata nftTokens,
        ERC20Tokens[] calldata erc20Tokens
    ) public {
        if (nftTokens.length == 0 || erc20Tokens.length == 0) {
            revert XSDMint__AtLeastOne();
        }

        uint256 nft_value = getNFTValue(nftTokens);
        uint256 token_value = getTokenValue(erc20Tokens);
        if (!checkRatio(nft_value, token_value)) {
            revert XSDMint__Unbalance();
        }

        uint256 xsdPrice = getTokenPrice(address(this));
        uint256 xsdMintAmount = (nft_value + token_value) / xsdPrice;
        if (xsdMintAmount <= 0) {
            revert XSDMint__IllegalAmount();
        }

        uint256 nft_length = nftTokens.length;
        for (uint256 i; i < nft_length; ) {
            ERC721 collection = nftTokens[i].collection;
            uint256 token_id = nftTokens[i].token_id;

            if (ERC721(collection).ownerOf(token_id) != msg.sender) {
                revert XSDMint__NFTNotOwner();
            }
            collection.safeTransferFrom(msg.sender, address(this), token_id);
            unchecked {
                ++i;
            }
        }

        uint256 erc20_length = erc20Tokens.length;
        for (uint256 i; i < erc20_length; ) {
            ERC20 token = erc20Tokens[i].token;
            uint256 amount = erc20Tokens[i].amount;

            if (ERC20(token).balanceOf(msg.sender) < amount) {
                revert XSDMint__TokenOverAmount();
            }
            token.transferFrom(msg.sender, address(this), amount);
            unchecked {
                ++i;
            }
        }

        _mint(msg.sender, xsdMintAmount);
    }

    function BurnXSD(
        NFTTokens[] calldata nftTokens,
        ERC20Tokens[] calldata erc20Tokens
    ) public {
        if (nftTokens.length == 0 || erc20Tokens.length == 0) {
            revert XSDMint__AtLeastOne();
        }

        uint256 nft_value = getNFTValue(nftTokens);
        uint256 token_value = getTokenValue(erc20Tokens);
        if (!checkRatio(nft_value, token_value)) {
            revert XSDMint__Unbalance();
        }

        uint256 xsdPrice = getTokenPrice(address(this));
        uint256 xsdBurnAmount = (nft_value + token_value) / xsdPrice;
        if (xsdBurnAmount <= 0) {
            revert XSDMint__IllegalAmount();
        }

        if (balanceOf[msg.sender] < xsdBurnAmount) {
            revert XSDMint__XSDNotEnough();
        }

        uint256 nft_length = nftTokens.length;
        for (uint256 i; i < nft_length; ) {
            ERC721 collection = nftTokens[i].collection;
            uint256 token_id = nftTokens[i].token_id;

            if (ERC721(collection).ownerOf(token_id) != address(this)) {
                revert XSDMint__NFTNotExist();
            }
            collection.safeTransferFrom(address(this), msg.sender, token_id);
            unchecked {
                ++i;
            }
        }

        uint256 erc20_length = erc20Tokens.length;
        for (uint256 i; i < erc20_length; ) {
            ERC20 token = erc20Tokens[i].token;
            uint256 amount = erc20Tokens[i].amount;

            if (ERC20(token).balanceOf(address(this)) < amount) {
                revert XSDMint__TokenExhausted();
            }
            token.transfer(msg.sender, amount);
            unchecked {
                ++i;
            }
        }
        _burn(msg.sender, xsdBurnAmount);
    }

    function checkRatio(
        uint256 nftv,
        uint256 tokenv
    ) public view returns (bool) {
        uint256 expectedTokenv = (nftv * rate[1]) / rate[0];
        uint256 deviation = expectedTokenv > tokenv
            ? expectedTokenv - tokenv
            : tokenv - expectedTokenv;

        // Allow a deviation of up to 1%.
        return deviation <= expectedTokenv / 100;
    }

    function onERC721Received(
        address /*operator*/,
        address /*from*/,
        uint /*tokenId*/,
        bytes calldata /*data*/
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
