// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract DHXToken is Initializable, ERC20Upgradeable, UUPSUpgradeable {
    address public owner;

    modifier onlyOwner() {
        require(owner == _msgSender(), "Not authorized");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address initialOwner) public initializer {
        __ERC20_init("DHX", "DataHighway token");
        __UUPSUpgradeable_init();

        owner = initialOwner;
        _mint(msg.sender, 100000000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}

// only for test the upgrade
contract DHXTokenV2Test is Initializable, ERC20Upgradeable, UUPSUpgradeable {
    address public owner;
    uint256 public Number;

    modifier onlyOwner() {
        require(owner == _msgSender(), "Not authorized");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address initialOwner) public initializer {
        __ERC20_init("DHX", "DataHighway token");
        __UUPSUpgradeable_init();

        owner = initialOwner;
        _mint(msg.sender, 100000000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function increaseValue() external {
        ++Number;
    }

    function decreaseValue() external {
        --Number;
    }
}
