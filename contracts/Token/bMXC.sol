// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract bMXCToken is ERC20, Ownable {
    constructor(address _owner) ERC20("bMXC", "bMXC") {
        transferOwnership(_owner);
        _mint(_owner, 40000000 * 10 ** 18);
    }

    function mint(
        address account,
        uint256 amount
    ) public onlyOwner returns (bool) {
        _mint(account, amount);
        return true;
    }
}
