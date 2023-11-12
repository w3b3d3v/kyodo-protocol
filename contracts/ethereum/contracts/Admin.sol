// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Admin is AccessControl, Pausable {
    event NewAdminAdded(address indexed new_admin);
    event RemovedAdmin(address indexed removed_admin);
    event NewProfileAdded(address indexed profile);

    bytes32 public constant CHANGE_PARAMETERS = keccak256("CHANGE_PARAMETERS");

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(CHANGE_PARAMETERS, admin);
    }

    function addAdmin(address account) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused() {
        _grantRole(DEFAULT_ADMIN_ROLE, account);
        emit NewAdminAdded(account);
    } 

    function removeAdmin(address account) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused() {
    	_revokeRole(DEFAULT_ADMIN_ROLE, account);
        emit RemovedAdmin(account);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused() {
        _pause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) whenPaused() {
        _unpause();
    }

    function addProfile(address account) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused() {
        _grantRole(CHANGE_PARAMETERS, account);
        emit NewProfileAdded(account);
    }
}