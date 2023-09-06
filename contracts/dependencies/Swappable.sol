// SPDX-License-Identifier: MIT

pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./interfaces/IChainLink.sol";
import "./interfaces/IUniswapRouter.sol";

abstract contract Swappable {
    uint constant public SWAP_PRECISION = 1e18;
    uint constant public RATIO_PRECISION = 10000; // 100%
    uint public swapSlippageRatio = 100; // 1%

    mapping(address => IChainLink) public oracles;

    uint public maxPriceOffset = 600; // 10 minutes

    function setSwapSlippageRatio(uint _ratio) external {
        require(_ratio != swapSlippageRatio, "Same ratio");
        require(_ratio <= RATIO_PRECISION, "Can't be more than 100%");
        swapSlippageRatio = _ratio;
    }

    function setMaxPriceOffset(uint _offset) external {
        require(_offset != maxPriceOffset, "Same offset");
        require(_offset <= 86400, "Can't be more than 1 day");
        maxPriceOffset = _offset;
    }

    function setPriceFeed(address _token, IChainLink _feed) external {
        require(_token != address(0), "!ZeroAddress");
        (uint80 round, int price,,,) = _feed.latestRoundData();
        require(round > 0 && price > 0, "Invalid feed");

        oracles[_token] = _feed;
    }

    function _expectedForSwap(uint _amount, address _fromToken, address _toToken) internal view returns (uint) {
        // ratio is a 18 decimals ratio number calculated to get the minimum
        // amount of want-tokens. So the balance is multiplied by the ratio
        // and then divided by 9 decimals to get the same "precision".
        // Then the result should be divided for the decimal diff between tokens.
        // Oracle Price Feed has always 8 decimals.
        // E.g want is USDT with only 6 decimals:
        // tokenDiffPrecision = 1e21 ((1e18 MATIC decimals / 1e6 USDT decimals) * 1e9 ratio precision)
        // ratio = 1_507_423_500 ((152265000 * 1e9) / 100000000) * 99 / 100 [with 1.52 USDT/MATIC]
        // _balance = 1e18 (1.0 MATIC)
        // expected = 1507423 (1e18 * 1_507_423_500 / 1e21) [1.507 in USDT decimals]
        uint tokenDiffPrecision = (
            (10 ** IERC20Metadata(_fromToken).decimals()) / (10 ** IERC20Metadata(_toToken).decimals())
        ) * SWAP_PRECISION;
        uint ratio = (
            (_getPriceFor(_fromToken) * SWAP_PRECISION) / _getPriceFor(_toToken)
        ) * (RATIO_PRECISION - swapSlippageRatio) / RATIO_PRECISION;

        return (_amount * ratio / tokenDiffPrecision);
    }

    function _getPriceFor(address _token) internal view returns (uint) {
        // This could be implemented with FeedRegistry but it's not available in polygon
        // (, int price,,uint timestamp,) = oracles[_token].latestRoundData();
        // (, int price,,,) = oracles[_token].latestRoundData();        

        // require(timestamp >= (block.timestamp - maxPriceOffset), "Old price");

        // return uint(price); //Desactivated for test purposes TODO: Implement chainLink on local network with https://github.com/smartcontractkit/hardhat-starter-kit
        // is need to guarantee that the prices will be returned in the same decimal scale
        return 1000000000000000000;
    }
}