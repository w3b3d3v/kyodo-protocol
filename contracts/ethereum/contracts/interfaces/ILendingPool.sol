// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

interface ILendingPool {
    event Deposit(
        address indexed reserve,
        address user,
        address indexed onBehalfOf,
        uint amount,
        uint16 indexed referral
    );

    event Withdraw(address indexed reserve, address indexed user, address indexed to, uint amount);

    function deposit(address asset, uint amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint amount, address to) external returns (uint);
    function borrow(address asset, uint amount, uint interestRateMode, uint16 referralCode, address onBehalfOf) external;
    function repay(address asset, uint amount, uint rateMode, address onBehalfOf) external returns (uint);

    function getUserAccountData(address user) external view returns (
        uint totalCollateralETH,
        uint totalDebtETH,
        uint availableBorrowsETH,
        uint currentLiquidationThreshold,
        uint ltv,
        uint healthFactor
    );
}