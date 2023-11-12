// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./Admin.sol";

contract KyodoRegistry is Admin {
    mapping(bytes32 => address) private addressRegistry;

    event RegistryCreated(bytes32 indexed key, address value);
    event RegistryUpdated(bytes32 indexed key, address value);

    constructor(address admin) Admin(admin) {}

    function createRegistry(string memory registry, address value) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused() {
        bytes32 key = keccak256(abi.encodePacked(registry));
        require(addressRegistry[key] == address(0), 'The registry already exists');
        addressRegistry[key] = value;
        emit RegistryCreated(key, value);
    }

    function updateRegistry(string memory registry, address value) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused() {
        bytes32 key = keccak256(abi.encodePacked(registry));
        require(addressRegistry[key] != address(0), 'Registry does not exists');
        addressRegistry[key] = value;
        emit RegistryUpdated(key, value);
    }

    function getRegistry(string memory registry) external view returns (address) {
        bytes32 key = keccak256(abi.encodePacked(registry));
        address registeredAddress = addressRegistry[key];
        require(registeredAddress != address(0), 'Registry does not exists');
        return registeredAddress;
    }
}
