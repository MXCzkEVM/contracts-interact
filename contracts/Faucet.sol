// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
    function requestMoon(address reqAddr) external {
        IERC20 token = IERC20(moonToken);
        if (requestedMoon[reqAddr]) {
            revert Faucet_ReqMultiTimes();
        }
        if (token.balanceOf(address(this)) < moonAllowed) {
            revert Faucet_MoonEmpty();
        }

        token.transfer(reqAddr, moonAllowed);
        requestedMoon[reqAddr] = true;
        emit SendMoon(reqAddr);
    }

    function requestMXC(address reqAddr) external {
        if (block.timestamp <= lockTime[reqAddr]) {
            revert Faucet_LockTimeNotExpired();
        }
        if (address(this).balance < mxcAllowed) {
            revert Faucet_MXCEmpty();
        }

        payable(reqAddr).transfer(mxcAllowed);
        lockTime[reqAddr] = block.timestamp + 1 days;
        emit SendMxc(reqAddr);
    }

    receive() external payable {}
}
