// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./Admin.sol";
import "./interfaces/IKyodoRegistry.sol";

contract KyodoRegistry is Admin, IKyodoRegistry {
    mapping(bytes32 => address) private addressRegistry;
    mapping(bytes32 => uint) private blockDeployment;

    constructor(address admin) Admin(admin) {}

    function createRegistry(string memory registry, address value, uint blockNumber) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused() {
        bytes32 key = keccak256(abi.encodePacked(registry));
        require(addressRegistry[key] == address(0), 'The registry already exists');
        addressRegistry[key] = value;
        blockDeployment[key] = blockNumber;
        emit RegistryCreated(key, value, blockNumber);
    }

    function updateRegistry(string memory registry, address value, uint blockNumber) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused() {
        bytes32 key = keccak256(abi.encodePacked(registry));
        require(addressRegistry[key] != address(0), 'Registry does not exists');
        addressRegistry[key] = value;
        blockDeployment[key] = blockNumber;
        emit RegistryUpdated(key, value, blockNumber);
    }

    function getRegistry(string memory registry) external override view returns (address) {
        bytes32 key = keccak256(abi.encodePacked(registry));
        address registeredAddress = addressRegistry[key];
        require(registeredAddress != address(0), 'Registry does not exists');
        return registeredAddress;
    }

    function getBlockDeployment(string memory registry) external override view returns (uint) {
        bytes32 key = keccak256(abi.encodePacked(registry));
        uint blockNumber = blockDeployment[key];
        return blockNumber;
    }
}
