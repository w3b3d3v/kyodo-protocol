// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "./Admin.sol";

contract VariableStorage is Admin {
    mapping(bytes32 => address) private variableStorage;

    event VariableUpdated(bytes32 indexed key, address value);

    constructor(address admin) Admin(admin) {}

    function setVariable(string memory variable, address value) external onlyAdmin() whenNotPaused() {
        bytes32 key = keccak256(abi.encodePacked(variable));
        variableStorage[bytes32ToBytes4(key)] = value;
        emit VariableUpdated(key, value);
    }

    function getVariable(string memory variable) external view returns (address) {
        bytes32 key = keccak256(abi.encodePacked(variable));
        return variableStorage[bytes32ToBytes4(key)];
    }

    function bytes32ToBytes4(bytes32 input) internal pure returns (bytes4) {
        return bytes4(uint32(uint256(input)));
    }
}
