// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../interfaces/IERC20V2.sol";

/* 
1 user can tranfer the token receied in faucet 
2 user only can transfer 1e18 wei
3 can't tranfer any token that get from other user
*/

error OnlyReceiveOnce();
error ERC20_NotOwner();
error ERC20_IllegalAmount();
error TransferNotAllow();

contract MoonERC20 is IERC20 {
    string public name;
    string public symbol;
    uint256 public override totalSupply;
    uint8 public decimals = 18;

    mapping(address => bool) public owners;
    mapping(address => uint256) public tokenStatus;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;

    event FaucetReceive(address indexed from, address indexed to);

    modifier onlyOwner() {
        if (!owners[msg.sender]) {
            revert ERC20_NotOwner();
        }
        _;
    }

    modifier onlyOne(uint amount) {
        if (amount != 1e18) {
            revert ERC20_IllegalAmount();
        }
        _;
    }

    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
        owners[msg.sender] = true;
    }

    function setOwner(address _newOwner) public onlyOwner {
        owners[_newOwner] = true;
    }

    function cancelOwner(address _newOwner) public onlyOwner {
        owners[_newOwner] = false;
    }

    function faucetReceive(
        address recipient
    ) external override onlyOwner returns (bool) {
        if (tokenStatus[recipient] != 0) {
            revert OnlyReceiveOnce();
        }

        balanceOf[msg.sender] -= 1e18;
        balanceOf[recipient] += 1e18;
        tokenStatus[recipient] = 1;

        emit FaucetReceive(msg.sender, recipient);
        return true;
    }

    function transfer(
        address recipient,
        uint amount
    ) external override onlyOne(amount) returns (bool) {
        if (amount != 1e18) {
            revert ERC20_IllegalAmount();
        }
        if (tokenStatus[msg.sender] != 1) {
            revert TransferNotAllow();
        }

        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        tokenStatus[msg.sender] = 2;

        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(
        address spender,
        uint amount
    ) external override onlyOne(amount) returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external override onlyOne(amount) returns (bool) {
        if (tokenStatus[msg.sender] != 1) {
            revert TransferNotAllow();
        }

        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        tokenStatus[msg.sender] = 2;

        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(address account, uint amount) external onlyOwner {
        balanceOf[account] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}
