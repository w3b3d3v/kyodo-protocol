// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

interface ISparkIncentivesController {
  function claimRewards(
    address[] calldata assets,
    uint amount,
    address to
  ) external returns (uint);
}