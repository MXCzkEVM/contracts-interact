// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract DIGIToken is Initializable, ERC20Upgradeable, UUPSUpgradeable {
    address public owner;

    modifier onlyOwner() {
        require(owner == _msgSender(), "Not authorized");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address initialOwner) public initializer {
        __ERC20_init("DIGI Token", "DG");
        __UUPSUpgradeable_init();

        owner = initialOwner;
        _mint(msg.sender, 10000000000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}

contract DIGITokenV2 is Initializable, ERC20Upgradeable, UUPSUpgradeable {
    address public owner;

    modifier onlyOwner() {
        require(owner == _msgSender(), "Not authorized");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address initialOwner) public initializer {
        __ERC20_init("DIGI Token", "DG");
        __UUPSUpgradeable_init();

        owner = initialOwner;
        _mint(msg.sender, 10000000000 * 10 ** 18);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function transferAdminship(address newAdmin) external onlyOwner {
        owner = newAdmin;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
