// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "solmate/src/tokens/ERC20.sol";
import "solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "hardhat/console.sol";

error XSDMint__AtLeastOne();
error XSDMint__NFTNotOwner();
error XSDMint__TokenOverAmount();
error XSDMint__TokenExhausted();
error XSDMint__Unbalance();
error XSDMint__IllegalAmount();
error XSDMint__NFTNotExist();
error XSDMint__XSDNotEnough();

contract XSDMintV0 is ERC20, Ownable, IERC721Receiver {
    uint256[2] public rate = [8, 2];
    mapping(ERC721 => bool) public s_acceptNft;
    mapping(ERC20 => bool) public s_acceptToken;

    // price, only exit in test
    mapping(ERC721 => mapping(uint256 => uint256)) public s_nftPrice;
    mapping(ERC20 => uint256) public s_tokenPrice;

    struct NftTokens {
        ERC721 collection;
        uint256 token_id;
    }
    struct Erc20Tokens {
        ERC20 token;
        uint256 amount;
    }

    constructor(uint256 price_mxcxsd) ERC20("XSD Token", "XSD", 18) {
        mxcxsd = price_mxcxsd;
    }

    // ======only exit in test / start=======
    uint256 public mxcxsd;

    function initNFTPrice(
        ERC721 collection,
        uint256 token_id,
        uint256 price
    ) public onlyOwner {
        s_nftPrice[collection][token_id] = price;
    }

    function initTokenPrice(ERC20 tokenAddr, uint256 price) public onlyOwner {
        s_tokenPrice[tokenAddr] = price;
    }

    // ======only exit in test / end=======
    function modifyRate(uint256[2] calldata _rate) public onlyOwner {
        rate = _rate;
    }

    function modifyCollateral(
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

    function calcXSDAmount(
        NftTokens[] calldata nftTokens,
        Erc20Tokens[] calldata erc20Tokens
    ) public view returns (uint256) {
        if (nftTokens.length == 0 || erc20Tokens.length == 0) {
            revert XSDMint__AtLeastOne();
        }

        uint256 nft_length = nftTokens.length;
        uint256 erc20_length = erc20Tokens.length;

        uint256 nftVal = 0;
        uint256 tokenVal = 0;
        for (uint256 i; i < nft_length; ++i) {
            ERC721 collection = nftTokens[i].collection;
            uint256 token_id = nftTokens[i].token_id;
            nftVal = nftVal + s_nftPrice[collection][token_id];
        }

        for (uint256 i; i < erc20_length; ++i) {
            ERC20 token = erc20Tokens[i].token;
            uint256 amount = erc20Tokens[i].amount;
            tokenVal = tokenVal + s_tokenPrice[token] * amount;
        }

        uint256 xsdMintAmount = (nftVal + tokenVal) / mxcxsd;
        return xsdMintAmount;
    }

    function mintXSD(
        NftTokens[] calldata nftTokens,
        Erc20Tokens[] calldata erc20Tokens
    ) public {
        if (nftTokens.length == 0 || erc20Tokens.length == 0) {
            revert XSDMint__AtLeastOne();
        }

        uint256 nft_length = nftTokens.length;
        uint256 erc20_length = erc20Tokens.length;

        uint256 nftVal = 0;
        uint256 tokenVal = 0;
        for (uint256 i; i < nft_length; ) {
            ERC721 collection = nftTokens[i].collection;
            uint256 token_id = nftTokens[i].token_id;

            // check nft owner
            if (ERC721(collection).ownerOf(token_id) != msg.sender) {
                revert XSDMint__NFTNotOwner();
            }

            // get nft price
            nftVal = nftVal + s_nftPrice[collection][token_id];
            // transfer token to contract
            collection.safeTransferFrom(msg.sender, address(this), token_id);

            unchecked {
                ++i;
            }
        }

        for (uint256 i; i < erc20_length; ) {
            ERC20 token = erc20Tokens[i].token;
            uint256 amount = erc20Tokens[i].amount;

            // check balance
            if (ERC20(token).balanceOf(msg.sender) < amount) {
                revert XSDMint__TokenOverAmount();
            }

            tokenVal = tokenVal + s_tokenPrice[token] * amount;
            // transfer token to contract
            token.transferFrom(msg.sender, address(this), amount);

            unchecked {
                ++i;
            }
        }

        if (!checkRatio(nftVal, tokenVal)) {
            revert XSDMint__Unbalance();
        }

        uint256 xsdMintAmount = (nftVal + tokenVal) / mxcxsd;
        if (xsdMintAmount <= 0) {
            revert XSDMint__IllegalAmount();
        }

        _mint(msg.sender, xsdMintAmount);
    }

    function BurnXSD(
        NftTokens[] calldata nftTokens,
        Erc20Tokens[] calldata erc20Tokens
    ) public {
        if (nftTokens.length == 0 || erc20Tokens.length == 0) {
            revert XSDMint__AtLeastOne();
        }

        uint256 nft_length = nftTokens.length;
        uint256 erc20_length = erc20Tokens.length;

        uint256 nftVal = 0;
        uint256 tokenVal = 0;
        for (uint256 i; i < nft_length; ) {
            ERC721 collection = nftTokens[i].collection;
            uint256 token_id = nftTokens[i].token_id;

            // check nft owner
            if (ERC721(collection).ownerOf(token_id) != address(this)) {
                revert XSDMint__NFTNotExist();
            }

            // get nft price
            nftVal = nftVal + s_nftPrice[collection][token_id];
            // transfer token to user
            collection.safeTransferFrom(address(this), msg.sender, token_id);

            unchecked {
                ++i;
            }
        }

        for (uint256 i; i < erc20_length; ) {
            ERC20 token = erc20Tokens[i].token;
            uint256 amount = erc20Tokens[i].amount;

            // check balance
            if (ERC20(token).balanceOf(address(this)) < amount) {
                revert XSDMint__TokenExhausted();
            }

            tokenVal = tokenVal + s_tokenPrice[token] * amount;
            // transfer token to user
            token.transfer(msg.sender, amount);

            unchecked {
                ++i;
            }
        }

        if (!checkRatio(nftVal, tokenVal)) {
            revert XSDMint__Unbalance();
        }

        uint256 xsdBurnAmount = (nftVal + tokenVal) / mxcxsd;
        if (xsdBurnAmount <= 0) {
            revert XSDMint__IllegalAmount();
        }

        if (balanceOf[msg.sender] < xsdBurnAmount) {
            revert XSDMint__XSDNotEnough();
        }

        _burn(msg.sender, xsdBurnAmount);
    }

    function checkRatio(
        uint256 nftv,
        uint256 tokenv
    ) public view returns (bool) {
        uint256 nftvs = nftv * rate[1];
        uint256 tokenvs = tokenv * rate[0];
        uint256 bigger = nftvs > tokenvs ? nftvs : tokenvs;
        uint256 smaller = nftvs > tokenvs ? tokenvs : nftvs;
        if (bigger - smaller < 2) {
            return true;
        } else {
            return false;
        }
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
