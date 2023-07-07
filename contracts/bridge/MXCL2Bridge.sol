// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

error MXCL2Bridge__NotAdmin();
error MXCL2Bridge__NotEnough();

contract MXCL2Bridge is UUPSUpgradeable {
    address public admin;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    modifier onlyAdmin() {
        if (msg.sender != admin) revert MXCL2Bridge__NotAdmin();
        _;
    }

    function initialize(address _admin) public initializer {
        admin = _admin;
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}

    function transferAdminship(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    receive() external payable {
        deposit();
    }

    fallback() external payable {
        deposit();
    }

    function deposit() public payable {
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(address _recipient, uint256 _amount) external onlyAdmin {
        uint256 balance = address(this).balance;
        if (_amount > balance) {
            revert MXCL2Bridge__NotEnough();
        }
        payable(_recipient).transfer(_amount);
        emit Withdrawn(_recipient, _amount);
    }
}

contract MXCL2BridgeTest is UUPSUpgradeable {
    address public admin;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    modifier onlyAdmin() {
        if (msg.sender != admin) revert MXCL2Bridge__NotAdmin();
        _;
    }

    function initialize(address _admin) public initializer {
        admin = _admin;
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}

    function transferAdminship(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    receive() external payable {}

    fallback() external payable {}

    function deposit() public payable {
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(address _recipient, uint256 _amount) external onlyAdmin {
        uint256 balance = address(this).balance;
        if (_amount > balance) {
            revert MXCL2Bridge__NotEnough();
        }
        payable(_recipient).transfer(_amount);
        emit Withdrawn(_recipient, _amount);
    }

    function testFunc() external {}
}
