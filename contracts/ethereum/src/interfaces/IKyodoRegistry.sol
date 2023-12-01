// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

interface IKyodoRegistry {
    // Events
    event RegistryCreated(bytes32 indexed key, address value, uint256 blockNumber);
    event RegistryUpdated(bytes32 indexed key, address value, uint256 blockNumber);

    /**
     * @notice Creates a new registry entry.
     * @param registry The name of the registry to create.
     * @param value The address to be associated with the registry.
     * @param blockNumber The block number at which the registry is created.
     */
    function createRegistry(string memory registry, address value, uint256 blockNumber) external;

    /**
     * @notice Updates an existing registry entry.
     * @param registry The name of the registry to update.
     * @param value The new address to be associated with the registry.
     * @param blockNumber The block number at which the registry is updated.
     */
    function updateRegistry(string memory registry, address value, uint256 blockNumber) external;

    /**
     * @notice Retrieves the address associated with a registry.
     * @param registry The name of the registry to query.
     * @return address The address associated with the given registry.
     */
    function getRegistry(string memory registry) external view returns (address);

    /**
     * @notice Retrieves the block number at which a registry was created or updated.
     * @param registry The name of the registry to query.
     * @return uint The block number of the registry creation or update.
     */
    function getBlockDeployment(string memory registry) external view returns (uint256);
}
