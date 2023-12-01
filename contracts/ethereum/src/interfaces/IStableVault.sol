// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

interface IStableVault {
    /// @notice Emitted when the vault's balance is updated.
    /// @param _vaultBalance The new balance of the vault.
    event BalanceUpdated(uint256 _vaultBalance);

    /// @notice Emitted when a user withdraws assets from the vault.
    /// @param user The address of the user who made the withdrawal.
    /// @param amount The amount of the asset withdrawn.
    /// @param asset The address of the asset that was withdrawn.
    event Withdrawal(address indexed user, uint256 amount, address indexed asset);

    /// @notice Emitted when a deposit is made to the Aave Lending Pool.
    /// @param user The user who made the deposit.
    /// @param asset The address of the asset deposited.
    /// @param amount The amount of the asset deposited.
    event DepositAave(address indexed user, address asset, uint256 amount);

    /// @notice Deposits an asset into the Vault and mints vault tokens for the beneficiary.
    /// @param amount The amount of the asset to deposit.
    /// @param _asset The address of the asset token being deposited.
    /// @param _beneficiary The address that will receive the minted vault tokens.
    /// @return bool Indicates if the deposit was successful.
    function deposit(uint256 amount, address _asset, address _beneficiary) external returns (bool);

    /// @notice Withdraws an asset from the Vault and burns the corresponding vault tokens.
    /// @param amount The amount of the asset to withdraw.
    /// @param _asset The address of the asset token being withdrawn.
    /// @return bool Indicates if the withdrawal was successful.
    function withdraw(uint256 amount, address _asset) external returns (bool);

    /// @notice Sets the addresses for the Aave ecosystem components.
    /// @param _AAVE_DATA_PROVIDER Address of the Aave Data Provider.
    /// @param _AAVE_INCENTIVES_CONTROLLER Address of the Aave Incentives Controller.
    /// @param _AAVE_LENDING_POOL Address of the Aave Lending Pool.
    function setAaveSettings(
        address _AAVE_DATA_PROVIDER,
        address _AAVE_INCENTIVES_CONTROLLER,
        address _AAVE_LENDING_POOL
    ) external;

    /// @notice Sets the user's preference for automatic compounding in the Aave Lending Pool.
    /// @param useCompound Boolean indicating whether to use compounding or not.
    /// @param wallet The address of the user's wallet.
    function setUserCompoundPreference(bool useCompound, address wallet) external;

    /// @notice Retrieves the current chain ID.
    /// @return uint256 The current chain ID.
    function getChainID() external view returns (uint256);

    /// @notice Checks if a given function is valid for the current network.
    /// @param functionName The name of the function to check.
    /// @return bool Indicates if the network is valid for the given function.
    function isValidNetworkForFunction(string memory functionName) external view returns (bool);

    /// @notice Updates the valid networks for a specific function.
    /// @param functionName The function name to update.
    /// @param chainIDs An array of chain IDs that are valid for the function.
    function updateValidNetworks(string memory functionName, uint256[] memory chainIDs) external;

    /// @notice Returns the current balance of the vault.
    /// @return uint256 The current vault balance.
    function vaultBalance() external view returns (uint256);

    /// @notice Retrieves the balance of Aave tokens for a given asset.
    /// @param _asset The address of the asset token.
    /// @return uint The balance of Aave tokens for the specified asset.
    function getAaveBalance(address _asset) external view returns (uint256);
}
