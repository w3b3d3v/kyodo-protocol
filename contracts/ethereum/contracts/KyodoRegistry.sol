// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "./Admin.sol";

contract KyodoRegistry is Admin {
    mapping(bytes32 => address) private registryStorage;

    event RegistrySet(bytes32 indexed key, address value);
    event RegistryUpdated(bytes32 indexed key, address value);

    constructor(address admin) Admin(admin) {}

    function setRegistry(string memory registry, address value) external onlyAdmin() whenNotPaused() {
        bytes4 key = returnKey(registry);
        require(registryStorage[key] == address(0), 'The registry already exists');
        registryStorage[key] = value;
        emit RegistrySet(key, value);
    }

    function updateRegistry(string memory registry, address value) external onlyAdmin() whenNotPaused() {
        bytes4 key = returnKey(registry);
        require(registryStorage[key] != address(0), 'Registry does not exists');
        registryStorage[key] = value;
        emit RegistryUpdated(key, value);
    }

    function getRegistry(string memory registry) external view returns (address) {
        bytes4 key = returnKey(registry);
        address addressToReturn = registryStorage[key];
        require(addressToReturn != address(0), 'Registry does not exists');
        return addressToReturn;
    }

    function returnKey(string memory registry) private pure returns (bytes4){
        return bytes32ToBytes4(keccak256(abi.encodePacked(registry)));
    }

    function bytes32ToBytes4(bytes32 input) private pure returns (bytes4) {
        return bytes4(uint32(uint256(input)));
    }
}
