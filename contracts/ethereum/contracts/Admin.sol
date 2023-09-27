// SPDX-License-Identifier: MIT

pragma solidity 0.8.1;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Admin is AccessControl, Pausable {
    event NewAdminAdded(address indexed new_admin);
    event RemovedAdmin(address indexed removed_admin);

    constructor(address admin) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an Admin");
        _;
    }

    function addAdmin(address account) external onlyAdmin() whenNotPaused() {
        _setupRole(DEFAULT_ADMIN_ROLE, account);
        emit NewAdminAdded(account);
    } 

    function removeAdmin(address account) external onlyAdmin() whenNotPaused() {
    	_revokeRole(DEFAULT_ADMIN_ROLE, account);
        emit RemovedAdmin(account);
    }

    function pause() external onlyAdmin() whenNotPaused() {
        _pause();
    }
    
    function unpause() external onlyAdmin() whenPaused() {
        _unpause();
    }
}