// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";

import {CCIPReceiver} from "./CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

abstract contract CCIPTokenAndDataReceiver is CCIPReceiver, Ownable {

    mapping(uint64 => bool) public whitelistedSourceChains;
    mapping(address => bool) public whitelistedSenders;
    mapping(address => mapping (address=>uint256)) public balances;

    event DepositCallSuccessfull(address indexed receiver, uint256 value);

    error SourceChainNotWhitelisted(uint64 sourceChainSelector);
    error SenderNotWhitelisted(address sender);

    modifier onlyWhitelistedSourceChain(uint64 _sourceChainSelector) {
        if (!whitelistedSourceChains[_sourceChainSelector])
            revert SourceChainNotWhitelisted(_sourceChainSelector);
        _;
    }

    modifier onlyWhitelistedSenders(address _sender) {
        if (!whitelistedSenders[_sender]) revert SenderNotWhitelisted(_sender);
        _;
    }

    constructor(address router, address initialOwner) CCIPReceiver(router) Ownable(initialOwner) {

    }

    function whitelistSourceChain(
        uint64 _sourceChainSelector
    ) external onlyOwner {
        whitelistedSourceChains[_sourceChainSelector] = true;
    }

    function denylistSourceChain(
        uint64 _sourceChainSelector
    ) external onlyOwner {
        whitelistedSourceChains[_sourceChainSelector] = false;
    }

    function whitelistSender(address _sender) external onlyOwner {
        whitelistedSenders[_sender] = true;
    }

    function denySender(address _sender) external onlyOwner {
        whitelistedSenders[_sender] = false;
    }

    function _ccipReceive(Client.Any2EVMMessage memory message) override internal virtual;
}