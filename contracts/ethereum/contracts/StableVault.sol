// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

import "./interfaces/ILendingPool.sol";
import "./interfaces/IAaveIncentivesController.sol";
import "./interfaces/IDataProvider.sol";
import "./interfaces/IStableVault.sol";
import "./Admin.sol";

import {CCIPReceiver} from "./chainlink/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

// TODO: Unchecked in all mathematical operations

contract StableVault is
    ReentrancyGuard,
    Admin,
    ERC20,
    IStableVault,
    CCIPReceiver
{
    uint256 private _vaultBalance;
    mapping(address => bool) public userSetCompound;
    mapping(string => mapping(uint256 => bool)) public validNetworks;
    mapping(uint64 => bool) public whitelistedSourceChains;
    mapping(address => bool) public whitelistedSenders;

    using SafeERC20 for IERC20;

    address private AAVE_LENDING_POOL;
    address private AAVE_INCENTIVES_CONTROLLER;
    address private AAVE_DATA_PROVIDER;

    error SourceChainNotWhitelisted(uint64 sourceChainSelector);
    error SenderNotWhitelisted(address sender);

    event MessageReceived(
        bytes32 indexed messageId, // The unique ID of the message.
        uint64 indexed sourceChainSelector, // The chain selector of the source chain.
        address sender, // The address of the sender from the source chain.
        address text // The text that was received.
    );

    constructor(
        address admin,
        string memory tokenName,
        string memory tokenSymbol,
        address router
    ) ERC20(tokenName, tokenSymbol) Admin(admin) CCIPReceiver(router) {}

    modifier onlyWhitelistedSourceChain(uint64 _sourceChainSelector) {
        if (!whitelistedSourceChains[_sourceChainSelector])
            revert SourceChainNotWhitelisted(_sourceChainSelector);
        _;
    }

    modifier onlyWhitelistedSenders(address _sender) {
        if (!whitelistedSenders[_sender]) revert SenderNotWhitelisted(_sender);
        _;
    }

    function deposit(
        uint256 amount,
        address _asset,
        address _beneficiary
    ) external override nonReentrant whenNotPaused returns (bool) {
        uint correctedAmount = _correctAmount(amount, _asset);

        IERC20(_asset).safeTransferFrom(msg.sender, address(this), amount);
        _mint(_beneficiary, correctedAmount);
        _increaseBalance(correctedAmount);
        if (userSetCompound[_beneficiary]) {
            depositAave(_asset, amount);
        }
        return true;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        uint256 amount = message.destTokenAmounts[0].amount;
        address _asset = message.destTokenAmounts[0].token;
        address _beneficiary = abi.decode(message.data, (address));

        uint correctedAmount = _correctAmount(amount, _asset);
        _mint(_beneficiary, correctedAmount);
        _increaseBalance(correctedAmount);
        if (userSetCompound[_beneficiary]) {
            depositAave(_asset, amount);
        }

        emit MessageReceived(
            message.messageId,
            message.sourceChainSelector, // fetch the source chain identifier (aka selector)
            abi.decode(message.sender, (address)), // abi-decoding of the sender address,
            _beneficiary
        );
    }

    /**
     * @dev Standardizes an asset amount to have 18 decimal places.
     *
     * @param amount The original amount of the asset.
     * @param asset The address of the asset token.
     *
     * @return The amount standardized to 18 decimal places.
     *
     * @notice This function adjusts the amount of a certain asset to have 18 decimal places.
     * If the asset already uses 18 decimal places, it keeps the amount the same.
     * If not, it changes the amount either by increasing or decreasing it, so that it matches the standard of 18 decimal places.
     */
    function _correctAmount(
        uint256 amount,
        address asset
    ) internal view returns (uint) {
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

    function vaultBalance() public view override returns (uint256) {
        return _vaultBalance;
    }

    function _decreaseBalance(uint256 amount) private {
        require(_vaultBalance >= amount, "Insufficient vault balance");
        unchecked {
            _vaultBalance -= amount;
        }
        emit BalanceUpdated(amount);
    }

    function withdraw(
        uint256 amount,
        address _asset
    ) external override nonReentrant whenNotPaused returns (bool) {
        uint correctedAmount = _correctAmount(amount, _asset);

        require(
            balanceOf(msg.sender) >= correctedAmount,
            "Insufficient balance"
        );
        _burn(msg.sender, correctedAmount);
        IERC20(_asset).safeTransfer(msg.sender, amount);
        _decreaseBalance(correctedAmount);

        emit Withdrawal(msg.sender, correctedAmount, _asset);
        return true;
    }

    function depositAave(
        address _asset,
        uint256 _amount
    ) private whenNotPaused {
        if (!validNetworks["depositAave"][getChainID()]) {
            return;
        }
        IERC20(_asset).approve(AAVE_LENDING_POOL, _amount);
        ILendingPool(AAVE_LENDING_POOL).deposit(
            _asset,
            _amount,
            address(this),
            0
        );
        emit DepositAave(msg.sender, _asset, _amount);
    }

    function withdrawFromAave(
        address _asset,
        uint256 _amount,
        address _to
    ) private whenNotPaused {
        ILendingPool(AAVE_LENDING_POOL).withdraw(_asset, _amount, _to);
    }

    function getRewardBalance(address _asset) private view returns (uint256) {
        address aToken;
        (aToken, , ) = IDataProvider(AAVE_DATA_PROVIDER)
            .getReserveTokensAddresses(_asset);

        address[] memory assets = new address[](1);
        assets[0] = aToken;
        return
            IDataProvider(AAVE_DATA_PROVIDER).getRewardsBalance(
                assets,
                address(this)
            );
    }

    function getAaveBalance(
        address _asset
    ) public view override returns (uint) {
        address aToken;
        (aToken, , ) = IDataProvider(AAVE_DATA_PROVIDER)
            .getReserveTokensAddresses(_asset);
        return IERC20(aToken).balanceOf(address(this));
    }

    function setAaveSettings(
        address _AAVE_DATA_PROVIDER,
        address _AAVE_INCENTIVES_CONTROLLER,
        address _AAVE_LENDING_POOL
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        AAVE_DATA_PROVIDER = _AAVE_DATA_PROVIDER;
        AAVE_INCENTIVES_CONTROLLER = _AAVE_INCENTIVES_CONTROLLER;
        AAVE_LENDING_POOL = _AAVE_LENDING_POOL;
    }

    function setUserCompoundPreference(
        bool useCompound,
        address wallet
    ) external override {
        require(
            hasRole(keccak256("CHANGE_PARAMETERS"), msg.sender),
            "Caller is not authorized"
        );
        userSetCompound[wallet] = useCompound;
    }

    function getChainID() public view override returns (uint256) {
        uint256 chainID;
        assembly {
            chainID := chainid()
        }
        return chainID;
    }

    function isValidNetworkForFunction(
        string memory functionName
    ) public view override returns (bool) {
        return validNetworks[functionName][getChainID()];
    }

    function updateValidNetworks(
        string memory functionName,
        uint256[] memory chainIDs
    ) external override {
        for (uint256 i = 0; i < 255; i++) {
            validNetworks[functionName][i] = false;
        }
        for (uint256 i = 0; i < chainIDs.length; i++) {
            validNetworks[functionName][chainIDs[i]] = true;
        }
    }

    function whitelistSourceChain(
        uint64 _sourceChainSelector
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelistedSourceChains[_sourceChainSelector] = true;
    }

    function denylistSourceChain(
        uint64 _sourceChainSelector
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelistedSourceChains[_sourceChainSelector] = false;
    }

    function whitelistSender(
        address _sender
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelistedSenders[_sender] = true;
    }

    function denySender(address _sender) external onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelistedSenders[_sender] = false;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, CCIPReceiver) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
