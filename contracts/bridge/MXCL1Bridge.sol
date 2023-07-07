// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "solmate/src/tokens/ERC20.sol";

error MXCL1Bridge__NotAdmin();
error MXCL1Bridge__AmountZero();
error MXCL1Bridge__TokenNotEnough();

contract MXCL1Bridge is UUPSUpgradeable {
    address public admin;
    address public MXCToken;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    modifier onlyAdmin() {
        if (msg.sender != admin) revert MXCL1Bridge__NotAdmin();
        _;
    }

    function initialize(address _admin, address _MXCToken) public initializer {
        admin = _admin;
        MXCToken = _MXCToken;
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}

    function transferAdminship(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    function deposit(uint256 _amount) external {
        if (_amount == 0) {
            revert MXCL1Bridge__AmountZero();
        }
        if (ERC20(MXCToken).balanceOf(msg.sender) < _amount) {
            revert MXCL1Bridge__TokenNotEnough();
        }
        require(
            ERC20(MXCToken).transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        emit Deposited(msg.sender, _amount);
    }

    function withdraw(address _recipient, uint256 _amount) external onlyAdmin {
        require(
            ERC20(MXCToken).balanceOf(address(this)) >= _amount,
            "Bridge Not enough"
        );
        require(
            ERC20(MXCToken).transfer(_recipient, _amount),
            "Transfer failed"
        );
        emit Withdrawn(admin, _amount);
    }
}

contract MXCL1BridgeTest is UUPSUpgradeable {
    address public admin;
    address public MXCToken;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert MXCL1Bridge__NotAdmin();
        _;
    }

    function initialize(address _admin, address _MXCToken) public initializer {
        admin = _admin;
        MXCToken = _MXCToken;
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyAdmin {}

    function transferAdminship(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    function testFunc() external onlyAdmin {}
}
