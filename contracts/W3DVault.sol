// SPDX-License-Identifier: MIT

pragma solidity 0.8.1;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./dependencies/interfaces/ILendingPool.sol";
import "./dependencies/interfaces/IAaveIncentivesController.sol";
import "./dependencies/interfaces/IDataProvider.sol";
import "./dependencies/interfaces/IChainLink.sol";
import "./dependencies/Swappable.sol";
import "./W3DAdmin.sol";

contract W3DVault is ReentrancyGuard, Swappable, W3DAdmin, ERC20 {
    uint256 private _vaultBalance;
    
    using SafeERC20 for IERC20;

    event BalanceUpdated(uint256 _vaultBalance);

    constructor(
        address admin, 
        string memory tokenName, 
        string memory tokenSymbol
    ) 
    ERC20(tokenName, 
    tokenSymbol) W3DAdmin(admin) 
    {}

    /**
    * @notice # Deposit money in the Vault.
    * @param amount The amount of the deposit.
    * @param _asset The address of the asset being deposited.
    */
    function deposit(uint256 amount, address _asset) external nonReentrant() whenNotPaused() {
        uint usdAmount = _amountInUSD(amount, _asset);

        IERC20(_asset).safeTransferFrom(msg.sender, address(this), amount);
        _mintVault(msg.sender, usdAmount);
        _increaseBalance(usdAmount);
    }

    /**
     * @dev Mints vault tokens for a user based on their deposit.
     * 
     * @param user The address of the user receiving the minted tokens.
     * @param amount The amount in USD to be minted as vault tokens.
     * 
     * @notice This function mints vault tokens for a user. The amount of tokens minted is based on the USD amount passed in.
     * If this is the first deposit (i.e., totalSupply is zero), the tokens are minted based on an initial ratio 1:1.
     * Otherwise, the tokens are minted based on the current price of the vault token.
     */
    function _mintVault(address user, uint256 amount) private whenNotPaused() {
        if (totalSupply() != 0) {
            _mint(user, _amountInTokens(amount));
        } 
        else {
            _mint(user, amount);
        }
    }

    /**
     * @dev Converts an asset amount to its equivalent in USD.
     * 
     * @param amount The amount of the asset to be converted.
     * @param asset The address of the asset token.
     * 
     * @return The equivalent amount in USD.
     * 
     * @notice This function takes an amount of a given asset and converts it to its equivalent value in USD.
     * The function first standardizes the amount to have 18 decimal places, if it doesn't already.
     * It then multiplies the standardized amount by the current price of the asset to get the equivalent value in USD.
     */
    function _amountInUSD(uint256 amount, address asset) internal view returns(uint) {
        uint assetDecimals = IERC20Metadata(asset).decimals();
        uint price;

        if (assetDecimals != 18) {
            if (assetDecimals > 18) {
                unchecked {
                    amount = amount / (10 ** (assetDecimals - 18));
                }
            } else {
                unchecked {
                    amount = amount * (10 ** (18 - assetDecimals));
                }
            }
        }

        console.log("amount: ", amount);

        unchecked {
            price = _getPriceFor(asset);
            amount = (price * amount) / 1e18;
        }

        console.log("afterPrice: ", amount);

        return amount;
    }

    function _amountInTokens(uint256 amount) internal view returns(uint){
        return (amount * 1e18) / getPrice();
    }

    function getPrice() public view returns(uint256){
        return (_vaultBalance * 1e18) / totalSupply();
    }

    function _increaseBalance(uint256 amount) private {
        _vaultBalance += amount;
        emit BalanceUpdated(amount);
    }
}