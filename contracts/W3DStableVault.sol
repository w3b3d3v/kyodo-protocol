// SPDX-License-Identifier: MIT

pragma solidity 0.8.1;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./W3DAdmin.sol";

// TODO: Unchecked in all mathematical operations

contract W3DStableVault is ReentrancyGuard, W3DAdmin, ERC20 {
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
     * @notice Deposits an asset into the Vault and mints vault tokens for the beneficiary.
     * @param amount The amount of the asset to deposit.
     * @param _asset The address of the asset token being deposited.
     * @param _beneficiary The address that will receive the minted vault tokens.
     * 
     * @dev This function allows a user to deposit assets into the vault. 
     * The function first corrects the asset amount to have 18 decimal places, if it doesn't already.
     * It then transfers the asset from the sender to the vault and mints vault tokens for the beneficiary.
     * The vault's balance is also updated.
     */
    function deposit(uint256 amount, address _asset, address _beneficiary) external nonReentrant() whenNotPaused() {
        uint correctedAmount = _correctAmount(amount, _asset);

        IERC20(_asset).safeTransferFrom(msg.sender, address(this), amount);
        _mint(_beneficiary, correctedAmount);
        _increaseBalance(correctedAmount);
    }

    /**
     * @dev Standardizes an asset amount to have 18 decimal places.
     * 
     * @param amount The original amount of the asset.
     * @param asset The address of the asset token.
     * 
     * @return The amount standardized to 18 decimal places.
     * 
     * @notice This function takes an amount of a given asset and standardizes it to have 18 decimal places.
     * If the asset already has 18 decimal places, the original amount is returned.
     * Otherwise, the function scales the amount up or down to make it equivalent in terms of 18 decimal places.
     */
    function _correctAmount(uint256 amount, address asset) internal view returns(uint) {
        uint assetDecimals = IERC20Metadata(asset).decimals();

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
        return amount;
    }

    function _increaseBalance(uint256 amount) private {
        unchecked {
            _vaultBalance += amount;
        }

        emit BalanceUpdated(amount);
    }

    function vaultBalance() public view returns(uint256){
        return _vaultBalance;
    }
}