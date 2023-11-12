// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./dependencies/interfaces/ILendingPool.sol";
import "./dependencies/interfaces/ISparkIncentivesController.sol";
import "./dependencies/interfaces/IDataProvider.sol";

import "./Admin.sol";


// TODO: Unchecked in all mathematical operations

contract StableVault is ReentrancyGuard, Admin, ERC20 {
    uint256 private _vaultBalance;
    mapping(address => bool) public userSetCompound;
    mapping(string => mapping(uint256 => bool)) public validNetworks;

    using SafeERC20 for IERC20;

    address private SPARK_LENDING_POOL;
    address private SPARK_INCENTIVES_CONTROLLER;
    address private SPARK_DATA_PROVIDER;

    event BalanceUpdated(uint256 _vaultBalance);
    event Withdrawal(address indexed user, uint256 amount, address indexed asset);
    event DepositSpark(address indexed user, address asset, uint256 amount);

    constructor(
        address admin, 
        string memory tokenName, 
        string memory tokenSymbol
    ) 
    ERC20(tokenName, 
    tokenSymbol) Admin(admin) 
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
    function deposit(uint256 amount, address _asset, address _beneficiary) external nonReentrant() whenNotPaused() returns(bool){
        uint correctedAmount = _correctAmount(amount, _asset);
        console.log("Deposit amount: ", amount);
        console.log("Deposit correctedAmount: ", correctedAmount);

        IERC20(_asset).safeTransferFrom(msg.sender, address(this), amount);
        _mint(_beneficiary, correctedAmount);
        _increaseBalance(correctedAmount);
        if (userSetCompound[_beneficiary]) {
            depositSpark(_asset, amount);
        }
        return true;
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

    function _decreaseBalance(uint256 amount) private {
        require(_vaultBalance >= amount, "Insufficient vault balance");
        unchecked {
            _vaultBalance -= amount;
        }

        emit BalanceUpdated(amount);
    }

    /**
     * @notice Withdraws an asset from the Vault and burns the vault tokens.
     * @param amount The amount of the asset to withdraw.
     * @param _asset The address of the asset token being withdrawn.
     * 
     * @dev This function allows a user to withdraw assets from the vault. 
     * The function first corrects the asset amount to have 18 decimal places, if it doesn't already.
     * It then burns the vault tokens from the sender and transfers the asset back to the sender.
     * The vault's balance is also updated.
     */
    function withdraw(uint256 amount, address _asset) external nonReentrant() whenNotPaused() returns(bool){
        uint correctedAmount = _correctAmount(amount, _asset);

        require(balanceOf(msg.sender) >= correctedAmount, "Insufficient balance");
        _burn(msg.sender, correctedAmount);
        IERC20(_asset).safeTransfer(msg.sender, amount);
        _decreaseBalance(correctedAmount);

        emit Withdrawal(msg.sender, correctedAmount, _asset);
        return true;
    }
    
    function depositSpark(address _asset, uint256 _amount) private whenNotPaused() {
        if (!validNetworks["depositSpark"][getChainID()]) {
            return;
        }
        IERC20(_asset).approve(SPARK_LENDING_POOL, _amount);
        ILendingPool(SPARK_LENDING_POOL).deposit(_asset, _amount, address(this), 0);
        emit DepositSpark(msg.sender, _asset, _amount);
    }

    function withdrawFromSpark(address _asset, uint256 _amount, address _to) private whenNotPaused() {
        ILendingPool(SPARK_LENDING_POOL).withdraw(_asset, _amount, _to);
    }

    function getRewardBalance(address _asset) private view returns(uint256){
        address aToken;
        (aToken,,) = IDataProvider(SPARK_DATA_PROVIDER).getReserveTokensAddresses(_asset);

        address[] memory assets = new address[](1);
        assets[0] = aToken;

        return IDataProvider(SPARK_DATA_PROVIDER).getRewardsBalance(assets, address(this));
    }

    function getSparkBalance(address _asset) public view returns(uint){
        address aToken;
        (aToken,,) = IDataProvider(SPARK_DATA_PROVIDER).getReserveTokensAddresses(_asset);
        return IERC20(aToken).balanceOf(address(this));
    }

    function setSparkSettings(
        address _SPARK_DATA_PROVIDER, 
        address _SPARK_INCENTIVES_CONTROLLER, 
        address _SPARK_LENDING_POOL
        ) 
        external onlyRole(DEFAULT_ADMIN_ROLE) {
        SPARK_DATA_PROVIDER = _SPARK_DATA_PROVIDER;
        SPARK_INCENTIVES_CONTROLLER = _SPARK_INCENTIVES_CONTROLLER;
        SPARK_LENDING_POOL = _SPARK_LENDING_POOL;
    }

    function setUserCompoundPreference(bool useCompound, address wallet) external {
        require(hasRole(keccak256("CHANGE_PARAMETERS"), msg.sender), "Caller is not authorized");
        userSetCompound[wallet] = useCompound;
    }


    function getChainID() public view returns (uint256) {
        uint256 chainID;
        assembly {
            chainID := chainid()
        }
        return chainID;
    }

    function isValidNetworkForFunction(string memory functionName) public view returns (bool) {
        return validNetworks[functionName][getChainID()];
    }

    function updateValidNetworks(string memory functionName, uint256[] memory chainIDs) external {
        // Reset the mapping for this function name
        for (uint256 i = 0; i < 255; i++) {
            validNetworks[functionName][i] = false;
        }
        // Set the valid networks
        for (uint256 i = 0; i < chainIDs.length; i++) {
            validNetworks[functionName][chainIDs[i]] = true;
        }
    }
}