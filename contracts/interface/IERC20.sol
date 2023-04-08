// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

abstract contract IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function totalSupply() external view virtual returns (uint256);

    function balanceOf(address account) external view virtual returns (uint256);

    function faucetReceive(address recipient) external virtual returns (bool);

    function transfer(
        address to,
        uint256 amount
    ) external virtual returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view virtual returns (uint256);

    function approve(
        address spender,
        uint256 amount
    ) external virtual returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external virtual returns (bool);
}
