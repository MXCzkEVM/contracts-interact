// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../interfaces/IERC20Base.sol";

error Faucet_NotOwner();
error Faucet_ReqMultiTimes();
error Faucet_LockTimeNotExpired();
error Faucet_MXCEmpty();
error Faucet_MoonEmpty();

contract Faucet {
    address public moonToken;
    address public owner;

    uint256 public moonAllowed = 1e18;
    uint256 public mxcAllowed = 100 * 1e18;

    mapping(address => bool) public requestedMoon;
    // Address and blocktime + 1 day is saved in TimeLock
    mapping(address => uint256) public lockTime;

    event SendMoon(address indexed Receiver);
    event SendMxc(address indexed Receiver);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Faucet_NotOwner();
        }
        _;
    }

    constructor(address _moonToken) {
        moonToken = _moonToken;
        owner = msg.sender;
    }

    function setOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function setMxcAllowed(uint256 _newMxcAllowed) public onlyOwner {
        mxcAllowed = _newMxcAllowed;
    }

    function setMoonallowed(uint256 _newMoonAllowed) public onlyOwner {
        moonAllowed = _newMoonAllowed;
    }

    // one address can't receive once
    function requestMoon(address recipient) external {
        IERC20 token = IERC20(moonToken);
        if (requestedMoon[recipient]) {
            revert Faucet_ReqMultiTimes();
        }
        if (token.balanceOf(address(this)) < moonAllowed) {
            revert Faucet_MoonEmpty();
        }

        token.faucetReceive(recipient);
        requestedMoon[recipient] = true;
        emit SendMoon(recipient);
    }

    function requestMXC(address recipient) external {
        if (block.timestamp <= lockTime[recipient]) {
            revert Faucet_LockTimeNotExpired();
        }
        if (address(this).balance < mxcAllowed) {
            revert Faucet_MXCEmpty();
        }

        payable(recipient).transfer(mxcAllowed);
        lockTime[recipient] = block.timestamp + 1 days;
        emit SendMxc(recipient);
    }

    receive() external payable {}
}
