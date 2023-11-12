// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ERC20Upgrade.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract XSDToken is Initializable, ERC20Upgrade, UUPSUpgradeable {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address initialOwner) public initializer {
        initializeERC20("XSD token", "XSD", 18);
        __UUPSUpgradeable_init();

        owner = initialOwner;
        _mint(msg.sender, 100000000 * 10 ** 18);
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
