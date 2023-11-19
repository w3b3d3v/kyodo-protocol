// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

interface IAaveIncentivesController {
  function claimRewards(
    address[] calldata assets,
    uint amount,
    address to
  ) external returns (uint);
}